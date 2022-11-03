import { FOLLOW_NFT_ABI } from '@abis/FollowNFT'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import logger from '@lib/logger'
import usePersistStore from '@lib/store/persist'
import { RELAYER_ENABLED, SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import { ethers, Signer, utils } from 'ethers'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import {
  BroadcastDocument,
  CreateBurnEip712TypedData,
  CreateUnfollowBroadcastItemResult,
  CreateUnfollowTypedDataDocument,
  Profile
} from 'src/types/lens'
import { CustomErrorWithData } from 'src/types/local'
import { useSigner, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
  onUnSubscribe: () => void
}

const UnSubscribe: FC<Props> = ({ channel, onUnSubscribe }) => {
  const [loading, setLoading] = useState(false)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message)
    setLoading(false)
  }
  const onCompleted = () => {
    toast.success(`Unsubscribed ${channel.handle}`)
    onUnSubscribe()
    setLoading(false)
  }

  const { data: signer } = useSigner({ onError })

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const [broadcast] = useMutation(BroadcastDocument, {
    onCompleted(data) {
      if (data?.broadcast?.__typename === 'RelayerResult') {
        onCompleted()
      }
    },
    onError
  })

  const burnWithSig = async (
    signature: string,
    typedData: CreateBurnEip712TypedData
  ) => {
    const { v, r, s } = utils.splitSignature(signature)
    const sig = {
      v,
      r,
      s,
      deadline: typedData.value.deadline
    }
    const followNftContract = new ethers.Contract(
      typedData.domain.verifyingContract,
      FOLLOW_NFT_ABI,
      signer as Signer
    )
    const txn = await followNftContract.burnWithSig(
      typedData?.value.tokenId,
      sig
    )
    if (txn.hash) onCompleted()
  }

  const [createUnsubscribeTypedData] = useMutation(
    CreateUnfollowTypedDataDocument,
    {
      async onCompleted(data) {
        const { typedData, id } =
          data.createUnfollowTypedData as CreateUnfollowBroadcastItemResult
        try {
          const signature: string = await signTypedDataAsync({
            domain: omitKey(typedData?.domain, '__typename'),
            types: omitKey(typedData?.types, '__typename'),
            value: omitKey(typedData?.value, '__typename')
          })
          if (!RELAYER_ENABLED) {
            return await burnWithSig(signature, typedData)
          }
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.__typename === 'RelayError')
            await burnWithSig(signature, typedData)
        } catch (error) {
          setLoading(false)
          logger.error('[Error UnSubscribe Typed Data]', error)
        }
      },
      onError
    }
  )

  const unsubscribe = () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    setLoading(true)
    createUnsubscribeTypedData({
      variables: {
        request: { profile: channel?.id }
      }
    })
  }

  return (
    <Button disabled={loading} loading={loading} onClick={() => unsubscribe()}>
      Unsubscribe
    </Button>
  )
}

export default UnSubscribe

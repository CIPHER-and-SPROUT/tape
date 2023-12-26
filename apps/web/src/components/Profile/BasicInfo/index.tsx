import type {
  CreateBlockProfilesBroadcastItemResult,
  CreateUnblockProfilesBroadcastItemResult,
  Profile
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'

import Badge from '@components/Common/Badge'
import FollowActions from '@components/Common/FollowActions'
import FlagOutline from '@components/Common/Icons/FlagOutline'
import LinkOutline from '@components/Common/Icons/LinkOutline'
import ProfileBanOutline from '@components/Common/Icons/ProfileBanOutline'
import ThreeDotsOutline from '@components/Common/Icons/ThreeDotsOutline'
import WarningOutline from '@components/Common/Icons/WarningOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import ReportProfile from '@components/Report/Profile'
import Tooltip from '@components/UIElements/Tooltip'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import {
  Badge as BadgeUI,
  Callout,
  Dialog,
  DropdownMenu,
  Flex,
  IconButton,
  Text
} from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { useCopyToClipboard } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  MISUSED_CHANNELS,
  REQUESTING_SIGNATURE_MESSAGE,
  STATIC_ASSETS,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  getProfile,
  getSignature,
  trimify
} from '@tape.xyz/generic'
import {
  useBlockMutation,
  useBroadcastOnchainMutation,
  useCreateBlockProfilesTypedDataMutation,
  useCreateUnblockProfilesTypedDataMutation,
  useUnblockMutation
} from '@tape.xyz/lens'
import { useApolloClient } from '@tape.xyz/lens/apollo'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

import Bubbles from '../Mutual/Bubbles'
import Stats from './Stats'

type Props = {
  profile: Profile
}

const BasicInfo: FC<Props> = ({ profile }) => {
  const [copy] = useCopyToClipboard()
  const [loading, setLoading] = useState(false)

  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const { activeProfile } = useProfileStore()
  const { canBroadcast } = checkLensManagerPermissions(activeProfile)

  const hasOnChainId =
    profile.onchainIdentity?.ens?.name ||
    profile.onchainIdentity?.proofOfHumanity ||
    profile.onchainIdentity?.worldcoin.isHuman ||
    profile.onchainIdentity?.sybilDotOrg.verified

  const isOwnChannel = profile?.id === activeProfile?.id

  const misused = MISUSED_CHANNELS.find((c) => c.id === profile?.id)
  const isBlockedByMe = profile.operations.isBlockedByMe.value

  const { cache } = useApolloClient()

  const updateCache = (value: boolean) => {
    cache.modify({
      fields: {
        operations: () => ({
          ...profile.operations,
          isBlockedByMe: { value }
        })
      },
      id: `Profile:${profile?.id}`
    })
  }

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (
    __typename?: 'LensProfileManagerRelayError' | 'RelayError' | 'RelaySuccess'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return
    }
    setLoading(false)
    updateCache(!isBlockedByMe)
    toast.success(
      `${isBlockedByMe ? `Unblocked` : `Blocked`} ${getProfile(profile)
        ?.displayName}`
    )
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    abi: LENSHUB_PROXY_ABI,
    address: LENSHUB_PROXY_ADDRESS,
    functionName: 'setBlockStatus',
    onError,
    onSuccess: () => onCompleted()
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

  const broadcastTypedData = async (
    typedDataResult:
      | CreateBlockProfilesBroadcastItemResult
      | CreateUnblockProfilesBroadcastItemResult
  ) => {
    const { id, typedData } = typedDataResult
    const { blockStatus, byProfileId, idsOfProfilesToSetBlockStatus } =
      typedData.value
    const args = [byProfileId, idsOfProfilesToSetBlockStatus, blockStatus]
    try {
      toast.loading(REQUESTING_SIGNATURE_MESSAGE)
      if (canBroadcast) {
        const signature = await signTypedDataAsync(getSignature(typedData))
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          write({ args })
        }
        return
      }
      write({ args })
    } catch {
      setLoading(false)
    }
  }

  const [createBlockTypedData] = useCreateBlockProfilesTypedDataMutation({
    onCompleted: async ({ createBlockProfilesTypedData }) => {
      broadcastTypedData(createBlockProfilesTypedData)
    },
    onError
  })

  const [createUnBlockTypedData] = useCreateUnblockProfilesTypedDataMutation({
    onCompleted: async ({ createUnblockProfilesTypedData }) => {
      broadcastTypedData(createUnblockProfilesTypedData)
    },
    onError
  })

  const [block] = useBlockMutation({
    onCompleted: async ({ block }) => {
      onCompleted(block.__typename)
      if (block.__typename === 'LensProfileManagerRelayError') {
        return await createBlockTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: { profiles: [profile.id] }
          }
        })
      }
    },
    onError
  })
  const [unBlock] = useUnblockMutation({
    onCompleted: async ({ unblock }) => {
      onCompleted(unblock.__typename)
      if (unblock.__typename === 'LensProfileManagerRelayError') {
        return await createUnBlockTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: { profiles: [profile.id] }
          }
        })
      }
    },
    onError
  })

  const toggleBlockProfile = async () => {
    setLoading(true)
    if (isBlockedByMe) {
      await unBlock({
        variables: {
          request: {
            profiles: [profile.id]
          }
        }
      })
    } else {
      await block({
        variables: {
          request: {
            profiles: [profile.id]
          }
        }
      })
    }
    setLoading(false)
  }

  return (
    <div className="px-2 xl:px-0">
      {misused?.description && (
        <Callout.Root color="red" mt="4">
          <Callout.Icon>
            <WarningOutline className="size-5" />
          </Callout.Icon>
          <Callout.Text highContrast>
            <Flex align="center" gap="2">
              <BadgeUI>{misused.type}</BadgeUI>
              <InterweaveContent content={misused.description} />
            </Flex>
          </Callout.Text>
        </Callout.Root>
      )}
      <div className="flex flex-1 flex-wrap justify-between pb-1 pt-4 md:gap-5">
        <div className="flex flex-col items-start">
          <Text
            className="flex items-center space-x-1.5 text-lg md:text-3xl"
            weight="bold"
          >
            <span>{getProfile(profile)?.displayName}</span>
            <Badge id={profile?.id} size="xl" />
          </Text>

          <div className="flex items-center space-x-2">
            {profile.operations.isFollowingMe.value && (
              <BadgeUI>Follows you</BadgeUI>
            )}
            <div className="hidden items-center md:flex">
              {hasOnChainId && (
                <div className="flex items-center space-x-0.5 py-2">
                  {profile.onchainIdentity?.ens?.name && (
                    <Tooltip
                      content={profile.onchainIdentity?.ens?.name}
                      placement="top"
                    >
                      <img
                        alt="ens"
                        className="size-6"
                        draggable={false}
                        src={`${STATIC_ASSETS}/images/social/ens.svg`}
                      />
                    </Tooltip>
                  )}
                  {profile?.onchainIdentity?.sybilDotOrg.verified && (
                    <Tooltip content={`Sybil Verified`} placement="top">
                      <img
                        alt="sybil"
                        className="size-7"
                        draggable={false}
                        src={`${STATIC_ASSETS}/images/social/sybil.png`}
                      />
                    </Tooltip>
                  )}
                  {profile?.onchainIdentity?.proofOfHumanity && (
                    <Tooltip content={`Proof of Humanity`} placement="top">
                      <img
                        alt="poh"
                        className="size-7"
                        draggable={false}
                        src={`${STATIC_ASSETS}/images/social/poh.png`}
                      />
                    </Tooltip>
                  )}
                  {profile?.onchainIdentity?.worldcoin.isHuman && (
                    <Tooltip content={`Proof of Personhood`} placement="top">
                      <img
                        alt="worldcoin"
                        className="size-7"
                        draggable={false}
                        src={`${STATIC_ASSETS}/images/social/worldcoin.png`}
                      />
                    </Tooltip>
                  )}
                </div>
              )}
              {profile?.id && !isOwnChannel ? (
                <Bubbles showSeparator={hasOnChainId} viewing={profile.id} />
              ) : null}
            </div>
          </div>
        </div>
        <Flex align="center" gap="3">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton variant="ghost">
                <ThreeDotsOutline className="size-4" />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" sideOffset={10} variant="soft">
              <DropdownMenu.Item
                onClick={() =>
                  copy(`${TAPE_WEBSITE_URL}${getProfile(profile).link}`)
                }
              >
                <Flex align="center" gap="2">
                  <LinkOutline className="size-3.5" />
                  <span className="whitespace-nowrap">Permalink</span>
                </Flex>
              </DropdownMenu.Item>

              {activeProfile?.id && (
                <Dialog.Root>
                  <Dialog.Trigger>
                    <button className="!cursor-default rounded-md px-3 py-1.5 hover:bg-gray-500/20">
                      <Flex align="center" gap="2">
                        <FlagOutline className="size-3.5" />
                        <Text className="whitespace-nowrap" size="2">
                          Report
                        </Text>
                      </Flex>
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Content style={{ maxWidth: 450 }}>
                    <Dialog.Title>Report</Dialog.Title>
                    <ReportProfile profile={profile} />
                  </Dialog.Content>
                </Dialog.Root>
              )}

              {profile.operations.canBlock && (
                <DropdownMenu.Item
                  color="red"
                  disabled={loading}
                  onClick={() => toggleBlockProfile()}
                >
                  <Flex align="center" gap="2">
                    <ProfileBanOutline className="size-4" />
                    <span className="whitespace-nowrap">
                      {isBlockedByMe ? 'Unblock' : 'Block'}
                    </span>
                  </Flex>
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <FollowActions profile={profile} />
        </Flex>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {profile.metadata?.bio && (
          <div className="line-clamp-5">
            <InterweaveContent
              content={trimify(profile.metadata.bio).replaceAll('\n', ' ')}
            />
          </div>
        )}
        <Stats profile={profile} />
      </div>
    </div>
  )
}

export default BasicInfo

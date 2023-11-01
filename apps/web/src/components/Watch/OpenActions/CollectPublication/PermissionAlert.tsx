import { getCollectModuleConfig } from '@lib/getCollectModuleInput'
import { Button } from '@radix-ui/themes'
import type { ApprovedAllowanceAmountResult } from '@tape.xyz/lens'
import { useGenerateModuleCurrencyApprovalDataLazyQuery } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import type { Dispatch, FC } from 'react'
import React from 'react'
import toast from 'react-hot-toast'
import { useSendTransaction, useWaitForTransaction } from 'wagmi'

type Props = {
  setIsAllowed: Dispatch<boolean>
  isAllowed: boolean
  allowanceModule: ApprovedAllowanceAmountResult
}

const PermissionAlert: FC<Props> = ({
  setIsAllowed,
  isAllowed,
  allowanceModule
}) => {
  const [generateAllowanceQuery, { loading }] =
    useGenerateModuleCurrencyApprovalDataLazyQuery()

  const {
    data: txData,
    isLoading: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    onError: (error: CustomErrorWithData) => {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { isLoading: waiting } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      toast.success(
        `Module ${isAllowed ? `disabled` : `enabled`} successfully!`
      )
      setIsAllowed(!isAllowed)
    },
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const handleAllowance = async () => {
    const result = await generateAllowanceQuery({
      variables: {
        request: {
          allowance: {
            currency: allowanceModule.allowance.asset.contract.address,
            value: Number.MAX_SAFE_INTEGER.toString()
          },
          module: {
            [getCollectModuleConfig(allowanceModule.moduleName).type]:
              allowanceModule.moduleName
          }
        }
      }
    })
    const data = result?.data?.generateModuleCurrencyApprovalData
    sendTransaction?.({
      to: data?.to,
      data: data?.data
    })
  }

  const processing = transactionLoading || waiting || loading

  return (
    <div className="flex justify-end">
      <Button
        disabled={processing}
        onClick={() => handleAllowance()}
        highContrast
      >
        {processing && <Loader size="sm" />}
        Allow Collect
      </Button>
    </div>
  )
}

export default PermissionAlert

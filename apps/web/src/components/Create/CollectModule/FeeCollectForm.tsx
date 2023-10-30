import { Input } from '@components/UIElements/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import useProfileStore from '@lib/store/profile'
import { Button, Flex, Select, Text } from '@radix-ui/themes'
import { WMATIC_TOKEN_ADDRESS } from '@tape.xyz/constants'
import type { Erc20 } from '@tape.xyz/lens'
import type { CollectModuleType } from '@tape.xyz/lens/custom-types'
import type { Dispatch, FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { isAddress } from 'viem'
import type { z } from 'zod'
import { number, object, string } from 'zod'

import Splits from './Splits'

type Props = {
  setCollectType: (data: CollectModuleType) => void
  setShowModal: Dispatch<boolean>
  enabledCurrencies: Erc20[]
}

const formSchema = object({
  currency: string(),
  amount: string().min(1, { message: `Invalid amount` }).optional(),
  referralPercent: number()
    .max(100, { message: `Percentage should be 0 to 100` })
    .nonnegative({ message: `Should to greater than or equal to zero` })
})
export type FormData = z.infer<typeof formSchema>

const FeeCollectForm: FC<Props> = ({
  setCollectType,
  setShowModal,
  enabledCurrencies
}) => {
  const submitContainerRef = useRef<HTMLDivElement>(null)
  const [validationError, setValidationError] = useState('')

  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const activeProfile = useProfileStore((state) => state.activeProfile)

  const splitRecipients = uploadedVideo.collectModule.multiRecipients ?? []

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralPercent: Number(uploadedVideo.collectModule.referralFee || 0),
      currency:
        uploadedVideo.collectModule.amount?.currency ?? WMATIC_TOKEN_ADDRESS,
      amount: uploadedVideo.collectModule.amount?.value || '0'
    }
  })

  useEffect(() => {
    setValidationError('')
  }, [uploadedVideo.collectModule.multiRecipients])

  const onSubmit = (data: FormData) => {
    setCollectType({
      amount: {
        currency: data.currency,
        value: data.amount || '0'
      },
      referralFee: data.referralPercent,
      recipient: activeProfile?.ownedBy.address
    })
    setShowModal(false)
  }

  const validateInputs = (data: FormData) => {
    const amount = Number(data.amount)
    const { isFeeCollect } = uploadedVideo.collectModule
    if (isFeeCollect) {
      if (amount === 0) {
        return setError('amount', {
          message: `Amount should be greater than 0`
        })
      }
      if (splitRecipients.length > 5) {
        return setValidationError('Only 5 splits supported')
      }
      const splitsSum = splitRecipients.reduce(
        (total, obj) => obj.split + total,
        0
      )
      const invalidSplitAddresses = splitRecipients.filter(
        (splitRecipient) => !isAddress(splitRecipient.recipient)
      )
      if (invalidSplitAddresses.length) {
        return setValidationError('Invalid split recipient address')
      }
      const uniqueValues = new Set(splitRecipients.map((v) => v.recipient))
      if (uniqueValues.size < splitRecipients.length) {
        return setValidationError('Split addresses should be unique')
      }
      if (
        uploadedVideo.collectModule.isMultiRecipientFeeCollect &&
        splitsSum !== 100
      ) {
        return setValidationError('Sum of all splits should be 100%')
      }
      data.amount = String(amount)
    }
    onSubmit(data)
  }

  return (
    <form className="space-y-3">
      {uploadedVideo.collectModule.isFeeCollect ? (
        <>
          <Flex align="start" gap="2">
            <Input
              type="number"
              placeholder="1.5"
              min="0"
              autoComplete="off"
              max="100000"
              validationError={errors.amount?.message}
              {...register('amount', {
                setValueAs: (v) => String(v)
              })}
            />
            <Select.Root
              {...register('currency')}
              value={uploadedVideo.collectModule.amount?.currency}
              onValueChange={(value) => {
                setCollectType({
                  amount: { currency: value, value: '' }
                })
              }}
            >
              <Select.Trigger />
              <Select.Content highContrast>
                {enabledCurrencies?.map((currency) => (
                  <Select.Item
                    key={currency.contract.address}
                    value={currency.contract.address}
                  >
                    {currency.symbol}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>

          <Splits submitContainerRef={submitContainerRef} />

          <div>
            <Input
              label="Referral Percentage"
              type="number"
              placeholder="2"
              suffix="%"
              info="Percent of collect revenue can be shared with anyone who mirrors your content."
              {...register('referralPercent', { valueAsNumber: true })}
              validationError={errors.referralPercent?.message}
            />
          </div>
        </>
      ) : null}
      <div className="flex justify-between pt-4" ref={submitContainerRef}>
        <Text color="red" weight="medium">
          {validationError}
        </Text>
        <Button
          highContrast
          type="button"
          onClick={() => handleSubmit(validateInputs)()}
        >
          Set Collect Type
        </Button>
      </div>
    </form>
  )
}

export default FeeCollectForm

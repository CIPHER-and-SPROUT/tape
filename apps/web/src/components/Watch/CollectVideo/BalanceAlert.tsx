import Alert from '@components/Common/Alert'
import { Trans } from '@lingui/macro'
import { IS_MAINNET } from '@tape.xyz/constants'
import type { CustomCollectModule } from '@tape.xyz/lens/custom-types'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

const getUniswapURL = (amount: number, outputCurrency: string): string => {
  return `https://app.uniswap.org/#/swap?exactField=output&exactAmount=${amount}&outputCurrency=${outputCurrency}&chain=${
    IS_MAINNET ? 'polygon' : 'polygon_mumbai'
  }`
}

type Props = {
  collectModule: CustomCollectModule
}

const BalanceAlert: FC<Props> = ({ collectModule }) => {
  return (
    <div className="flex-1">
      <Alert variant="warning">
        <div className="flex flex-1 items-center justify-between text-sm">
          <span>
            <Trans>Not enough</Trans> {collectModule?.amount?.asset?.symbol}{' '}
            <Trans>token balance</Trans>
          </span>
          <Link
            href={getUniswapURL(
              parseFloat(collectModule?.amount?.value),
              collectModule?.amount?.asset?.address
            )}
            rel="noreferer noreferrer"
            target="_blank"
            className="text-brand-500"
          >
            <Trans>Swap</Trans>
          </Link>
        </div>
      </Alert>
    </div>
  )
}

export default BalanceAlert

import Login from '@components/Common/Auth/Login'
import MetaTags from '@components/Common/MetaTags'
import useAuthPersistStore from '@lib/store/auth'
import { t, Trans } from '@lingui/macro'
import { STATIC_ASSETS, TAPE_APP_NAME } from '@tape.xyz/constants'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const AuthRequiredPage = () => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const { replace, query } = useRouter()

  useEffect(() => {
    if (selectedSimpleProfile?.id && query?.next) {
      replace(query?.next as string)
    }
  }, [selectedSimpleProfile, query, replace])

  return (
    <>
      <MetaTags title={t`Login`} />
      <div className="mt-10 flex h-full flex-col items-center justify-start md:mt-20">
        <img
          src={`${STATIC_ASSETS}/brand/logo.svg`}
          draggable={false}
          height={50}
          width={50}
          alt={TAPE_APP_NAME}
        />
        <div className="flex flex-col items-center justify-center py-10">
          <h1 className="mb-4 text-3xl font-bold">
            <Trans>Sign In Required</Trans>
          </h1>
          <div className="mb-6 text-center">
            <Trans>Connect Wallet & Sign with Lens to continue,</Trans>
          </div>
          <div>
            <Login />
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthRequiredPage

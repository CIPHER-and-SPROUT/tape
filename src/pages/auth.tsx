import Login from '@components/Common/Login'
import MetaTags from '@components/Common/MetaTags'
import usePersistStore from '@lib/store/persist'
import { APP_NAME } from '@utils/constants'
import { HOME } from '@utils/url-path'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AuthRequiredPage() {
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const { replace, query } = useRouter()
  useEffect(() => {
    if (selectedChannelId) {
      replace(query?.next ? (query?.next as string) : HOME)
    }
  }, [selectedChannelId, query, replace])

  return (
    <>
      <MetaTags title="Login" />
      <div className="flex flex-col items-center justify-start h-full mt-10 md:mt-20">
        <img
          src="/lenstube.svg"
          alt={APP_NAME}
          draggable={false}
          height={50}
          width={50}
        />
        <div className="flex flex-col items-center justify-center py-10">
          <h1 className="mb-4 text-3xl font-bold">Sign In Required</h1>
          <div className="mb-6 text-center">
            Connect Wallet & Sign with Lens to continue,
          </div>
          <div>
            <Login />
          </div>
        </div>
      </div>
    </>
  )
}

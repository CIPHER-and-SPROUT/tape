import useAuthPersistStore from '@lib/store/auth'
import {
  IS_PRODUCTION,
  MIXPANEL_API_HOST,
  MIXPANEL_TOKEN
} from '@tape.xyz/constants'
import mixpanel from 'mixpanel-browser'
import type { FC } from 'react'
import { useEffect } from 'react'

if (IS_PRODUCTION) {
  mixpanel.init(MIXPANEL_TOKEN, {
    ignore_dnt: true,
    api_host: MIXPANEL_API_HOST
  })
}

const TelemetryProvider: FC = () => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  useEffect(() => {
    if (IS_PRODUCTION && selectedSimpleProfile?.id) {
      mixpanel.identify(selectedSimpleProfile?.id)
      mixpanel.people.set({
        $name: selectedSimpleProfile?.handle,
        $last_active: new Date()
      })
      mixpanel.people.set_once({
        $created_at: new Date()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSimpleProfile?.id])

  return null
}

export default TelemetryProvider

import { Image as ExpoImage } from 'expo-image'
import * as SplashScreen from 'expo-splash-screen'
import type { FC, PropsWithChildren } from 'react'
import React, { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'

import { useMobilePersistStore } from '~/store/persist'

import { useAuth, useCachedResources } from '../../hooks'

SplashScreen.preventAutoHideAsync()

const Splash = () => {
  const { height, width } = useWindowDimensions()

  return (
    <ExpoImage
      source={require('assets/splash.png')}
      contentFit="cover"
      style={{ width, height }}
    />
  )
}

const AppLoading: FC<PropsWithChildren> = ({ children }) => {
  const [appLoadingIsVisible, setAppLoadingIsVisible] = useState(true)
  const selectedChannelId = useMobilePersistStore(
    (state) => state.selectedChannelId
  )

  const isCached = useCachedResources()
  const isAuthValidated = useAuth()

  useEffect(() => {
    SplashScreen.hideAsync()
    if (isCached && isAuthValidated) {
      const timer = selectedChannelId ? 50 : 500
      setTimeout(() => {
        setAppLoadingIsVisible(false)
      }, timer)
    }
  }, [isCached, isAuthValidated, selectedChannelId])

  if (appLoadingIsVisible) {
    return <Splash />
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

export default AppLoading

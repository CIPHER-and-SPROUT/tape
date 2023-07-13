import { ApolloProvider } from '@apollo/client'
import { getLivepeerClient, videoPlayerTheme } from '@lenstube/browser'
import {
  IS_MAINNET,
  LENSTUBE_APP_NAME,
  LENSTUBE_WEBSITE_URL,
  POLYGON_RPC_URL,
  WC_PROJECT_ID
} from '@lenstube/constants'
import apolloClient from '@lenstube/lens/apollo'
import authLink from '@lib/authLink'
import { loadLocale } from '@lib/i18n'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { LivepeerConfig } from '@livepeer/react'
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import type { ThemeOptions } from '@rainbow-me/rainbowkit/dist/themes/baseTheme'
import {
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { ThemeProvider, useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import React, { useEffect } from 'react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import ErrorBoundary from '../ErrorBoundary'

const { chains, publicClient } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: POLYGON_RPC_URL
      })
    })
  ]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains, shimDisconnect: true }),
      rainbowWallet({ chains, projectId: WC_PROJECT_ID }),
      ledgerWallet({ chains, projectId: WC_PROJECT_ID }),
      coinbaseWallet({ appName: LENSTUBE_APP_NAME, chains }),
      walletConnectWallet({ chains, projectId: WC_PROJECT_ID })
    ]
  }
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const Disclaimer = () => (
  <div className="prose-sm prose-a:text-indigo-500 text-[10px]">
    <span>By continuing, you agree to Lenstube's</span>{' '}
    <a href="/terms" target="_blank">
      terms
    </a>{' '}
    <span>and</span>{' '}
    <a href="/privacy" target="_blank">
      privacy policy
    </a>
    .
  </div>
)

// Enables usage of theme in RainbowKitProvider
const RainbowKitProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme()
  const themeOptions: ThemeOptions = {
    fontStack: 'system',
    overlayBlur: 'small',
    accentColor: '#6366f1'
  }
  return (
    <RainbowKitProvider
      appInfo={{
        appName: LENSTUBE_APP_NAME,
        learnMoreUrl: LENSTUBE_WEBSITE_URL,
        disclaimer: () => <Disclaimer />
      }}
      modalSize="compact"
      chains={chains}
      theme={
        theme === 'dark' ? darkTheme(themeOptions) : lightTheme(themeOptions)
      }
    >
      {children}
    </RainbowKitProvider>
  )
}

const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    loadLocale()
  }, [])

  return (
    <I18nProvider i18n={i18n}>
      <ErrorBoundary>
        <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
          <WagmiConfig config={wagmiConfig}>
            <ThemeProvider defaultTheme="dark" attribute="class">
              <RainbowKitProviderWrapper>
                <ApolloProvider client={apolloClient(authLink)}>
                  {children}
                </ApolloProvider>
              </RainbowKitProviderWrapper>
            </ThemeProvider>
          </WagmiConfig>
        </LivepeerConfig>
      </ErrorBoundary>
    </I18nProvider>
  )
}

export default Providers

import 'react-native-reanimated';
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler';

import {
  EXPLORER_RECOMMENDED_WALLET_IDS,
  LIVEPEER_STUDIO_API_KEY,
  TAPE_APP_DESCRIPTION,
  TAPE_APP_NAME,
  TAPE_LOGO,
  TAPE_WEBSITE_URL,
  WC_PROJECT_ID
} from '@dragverse/constants';
import { ApolloProvider, apolloClient } from '@dragverse/lens/apollo';
import {
  LivepeerConfig,
  createReactClient,
  studioProvider
} from '@livepeer/react-native';
import { WalletConnectModal } from '@walletconnect/modal-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
// eslint-disable-next-line import/no-duplicates
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppLoading from './components/common/AppLoading';
import { ToastProvider } from './components/common/toast';
import mobileAuthLink from './helpers/auth-link';
import { Navigation } from './navigation';

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1
  }
})

const providerMetadata = {
  name: TAPE_APP_NAME,
  description: TAPE_APP_DESCRIPTION,
  url: TAPE_WEBSITE_URL,
  icons: [TAPE_LOGO],
  redirect: {
    native: 'dragverse://',
    universal: 'dragverse.app'
  }
}

const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: LIVEPEER_STUDIO_API_KEY })
})

const App = (): JSX.Element => {
  return (
    <AppLoading>
      <SafeAreaProvider>
        <ApolloProvider client={apolloClient(mobileAuthLink)}>
          <ToastProvider>
            <LivepeerConfig client={livepeerClient}>
              <WalletConnectModal
                themeMode="dark"
                projectId={WC_PROJECT_ID}
                explorerExcludedWalletIds="ALL"
                providerMetadata={providerMetadata}
                explorerRecommendedWalletIds={EXPLORER_RECOMMENDED_WALLET_IDS}
              />
              <GestureHandlerRootView style={styles.gestureHandlerRootView}>
                <Navigation />
              </GestureHandlerRootView>
            </LivepeerConfig>
          </ToastProvider>
        </ApolloProvider>
      </SafeAreaProvider>
    </AppLoading>
  )
}

export default App

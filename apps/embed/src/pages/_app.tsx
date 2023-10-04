import '../styles/index.css'

import { LivepeerConfig } from '@livepeer/react'
import { bloomer, getLivepeerClient, videoPlayerTheme } from '@tape.xyz/browser'
import type { AppProps } from 'next/app'
import React from 'react'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
      <style jsx global>{`
        body {
          font-family: ${bloomer.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </LivepeerConfig>
  )
}

export default MyApp

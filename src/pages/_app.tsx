import React from 'react'
import { AppProps } from 'next/app'

import '../styles/global.css'

import '../styles/components/Button.css'
import '../styles/components/PostCard.css'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default MyApp

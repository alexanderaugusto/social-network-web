import React from 'react'
import { AppProps } from 'next/app'

import '../styles/global.css'

import '../styles/pages/Home.css'
import '../styles/pages/Post.css'
import '../styles/pages/PostMedia.css'

import '../styles/components/Button.css'
import '../styles/components/Header.css'
import '../styles/components/Input.css'
import '../styles/components/InputArea.css'
import '../styles/components/PostCard.css'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default MyApp

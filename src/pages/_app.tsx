import React from 'react'
import { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/auth'
import { AlertProvider } from '../contexts/alert'
import { LoaderProvider } from '../contexts/loader'

import '../styles/global.css'

import '../styles/pages/Home.css'
import '../styles/pages/Login.css'
import '../styles/pages/Post.css'
import '../styles/pages/PostMedia.css'
import '../styles/pages/Profile.css'
import '../styles/pages/Register.css'

import '../styles/components/Alert.css'
import '../styles/components/Button.css'
import '../styles/components/Header.css'
import '../styles/components/Input.css'
import '../styles/components/InputArea.css'
import '../styles/components/PostCard.css'
import '../styles/components/Loader.css'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <LoaderProvider>
      <AlertProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </AlertProvider>
    </LoaderProvider>
  )
}

export default MyApp

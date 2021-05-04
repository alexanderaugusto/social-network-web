import React from 'react'
import Head from 'next/head'
import { Header } from '../components'

const Login: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Procurar usuários</title>
      </Head>

      <main>
        <Header />
      </main>
    </div>
  )
}

export default Login

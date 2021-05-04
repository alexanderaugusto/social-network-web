import React from 'react'
import Head from 'next/head'
import { Header } from '../components'

const Login: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Procurar usuários</title>
      </Head>

      <Header />

      <main className="page users-page">
        <p>oi</p>
      </main>
    </div>
  )
}

export default Login

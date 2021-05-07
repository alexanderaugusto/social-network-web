import React from 'react'
import Head from 'next/head'

const Login: React.FC = () => {
  console.log('loop')
  return (
    <div>
      <Head>
        <title>Lazy - Entrar</title>
      </Head>

      <main className="login-page">
        <p>Login</p>
      </main>
    </div>
  )
}

export default Login

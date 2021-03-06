import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/auth'
import { useAlert } from '../../contexts/alert'
import { useLoader } from '../../contexts/loader'

import { Button, Input } from '../../components'

import LazyLogo from '../../assets/lazy-black.png'

const Login: React.FC = () => {
  const loader = useLoader()
  const alert = useAlert()
  const auth = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function login() {
    loader.start()

    await auth
      .signIn(email, password)
      .then(() => {
        router.push('/')
      })
      .catch(err => {
        const type = err.response.status >= 500 ? 'error' : 'warning'
        const title = 'Algo deu errado :('
        const message = 'E-mail ou senha incorretos, tente novamente.'
        alert.show(type, title, message)
        console.error(err)
      })

    loader.stop()
  }

  return (
    <div>
      <Head>
        <title>Lazy - Entrar</title>
      </Head>

      <main className="login-page">
        <div className="login-container">
          <img src={LazyLogo} alt="Lazy Logo" />

          <form
            onSubmit={e => {
              e.preventDefault()
              login()
            }}
          >
            <Input
              type="email"
              placeholder="Ex: alexaasf1010@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              label="E-mail"
            />
            <Input
              type="password"
              placeholder="●●●●●●●●●●●●●"
              value={password}
              onChange={e => setPassword(e.target.value)}
              label="Senha"
            />
            <Button id="btn-login" type="submit">
              Entrar
            </Button>
          </form>
          <Button
            id="btn-register"
            onClick={() => router.push('/auth/register')}
          >
            Criar conta
          </Button>
        </div>
      </main>
    </div>
  )
}

export default Login

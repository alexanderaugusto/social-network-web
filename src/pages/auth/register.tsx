import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Dropzone from 'react-dropzone'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/auth'
import api from '../../services/api'
import { Button, Input } from '../../components'

const DEFAULT_AVATAR =
  process.env.NEXT_PUBLIC_API_STORAGE + 'lazy/user/default-avatar.png'

const Register: React.FC = () => {
  const auth = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: null
  })

  function onChangeUser(type, value) {
    setUserData({ ...userData, [type]: value })
  }

  function onChangeAvatar(file) {
    const avatar = file
    avatar.preview = URL.createObjectURL(file)
    setUserData({ ...userData, avatar })
  }

  async function login() {
    await auth
      .signIn(userData.email, userData.password)
      .then(() => {
        router.push('/')
      })
      .catch(err => {
        console.error(err)
      })
  }

  async function register() {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const data = new FormData()
    data.append('name', userData.name)
    data.append('email', userData.email)
    data.append('password', userData.password)
    data.append('file', userData.avatar)

    await api
      .post('/users', data, config)
      .then(() => {
        login()
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <div>
      <Head>
        <title>Lazy - Criar conta</title>
      </Head>

      <main className="register-page">
        <div className="register-container">
          <form
            onSubmit={e => {
              e.preventDefault()
              register()
            }}
          >
            <Dropzone
              accept={['image/jpeg', 'image/png', 'image/webp']}
              onDrop={acceptedFiles => {
                if (acceptedFiles) {
                  onChangeAvatar(acceptedFiles[0])
                }
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className="avatar">
                    <img
                      src={
                        userData.avatar
                          ? userData.avatar.preview
                          : DEFAULT_AVATAR
                      }
                      alt="Seu avatar"
                    />
                  </div>
                </div>
              )}
            </Dropzone>
            <Input
              type="text"
              placeholder="Ex: Alexander Augusto"
              value={userData.name}
              onChange={e => onChangeUser('name', e.target.value)}
              label="Nome"
            />
            <Input
              type="email"
              placeholder="Ex: alexaasf1010@gmail.com"
              value={userData.email}
              onChange={e => onChangeUser('email', e.target.value)}
              label="E-mail"
            />
            <Input
              type="password"
              placeholder="●●●●●●●●●●●●●"
              value={userData.password}
              onChange={e => onChangeUser('password', e.target.value)}
              label="Senha"
            />
            <Button type="submit">Criar conta</Button>
          </form>
          <p>
            Já possui conta?{' '}
            <Link href="/auth/login">
              <a>Entrar</a>
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Register

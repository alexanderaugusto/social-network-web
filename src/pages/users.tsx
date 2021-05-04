import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/auth'
import api from '../services/api'
import { Header } from '../components'

const Users: React.FC = () => {
  const router = useRouter()
  const auth = useAuth()
  const { name } = router.query
  const [users, setUsers] = useState([])

  const getUsersByName = useCallback(async () => {
    const config = {
      params: {
        name
      }
    }

    await api
      .get('/users/search', config)
      .then(res => {
        setUsers(res.data.content)
      })
      .catch(err => {
        console.error(err)
      })
  }, [name])

  useEffect(() => {
    if (auth.signed && name) {
      getUsersByName()
    }
  }, [getUsersByName, name, auth.signed])

  console.log(users)

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

export default Users

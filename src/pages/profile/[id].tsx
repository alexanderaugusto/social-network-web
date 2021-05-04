import React from 'react'
import Head from 'next/head'
import { Header } from '../../components'

const Profile: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Perfil</title>
      </Head>

      <Header />

      <main className="page profile-page">
        <p>oi</p>
      </main>
    </div>
  )
}

export default Profile

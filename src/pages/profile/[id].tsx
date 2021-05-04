import React from 'react'
import Head from 'next/head'
import { Header } from '../../components'

const Profile: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Perfil</title>
      </Head>

      <main>
        <Header />
      </main>
    </div>
  )
}

export default Profile

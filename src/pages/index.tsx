import React from 'react'
import Head from 'next/head'
import { PostCard } from '../components'

const USER = {
  id: 1,
  name: 'Alexander Augusto',
  avatar: 'https://www.pngkey.com/png/detail/193-1938385_-pikachu-avatar.png'
}

const POST = {
  id: 1,
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi quis eaque placeat natus, hic dolorum amet neque sunt odio iure.',
  media:
    'https://lh3.googleusercontent.com/proxy/hjbEGvBproLi_sAipXzFDq6ffOkApbR1F7dc5Vp4xWvkJ1xhhnZWK0OD-xCOCTiikGXKtuSrDU_qJMtOmgpdDLc2IQi_ijEOfpAR4W-AanGhmyXw-TbDiVPI54dNTYReW1GiIfrMQ4WPVcrsUGUfgqNILGgQ8hHGTrUQwb8A',
  totalReactions: 2,
  totalComments: 10
}

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Rede Social</title>
      </Head>

      <main>
        <p>Home</p>
        <PostCard post={POST} user={USER} />
      </main>
    </div>
  )
}

export default Home

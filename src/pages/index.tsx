import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import api from '../services/api'
import { Header, PostCard } from '../components'

type UserProps = {
  id: number
  name: string
  avatar: string
}

type PostProps = {
  id: number
  description: string
  media: string | null
  totalReactions: number
  totalComments: number
  owner: UserProps
  reactions: [number]
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Array<PostProps>>([])

  const getUserTimeline = useCallback(async () => {
    await api
      .get('/users/timeline')
      .then(res => {
        setPosts(res.data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  useEffect(() => {
    getUserTimeline()
  }, [getUserTimeline])

  async function addReactionToPost(postId: number) {
    let newPosts = posts
    newPosts = posts.map(post => {
      if (post.id === postId) {
        post.reactions.push(1)
        return post
      }

      return post
    })
    setPosts(newPosts)
  }

  async function removeReactionFromPost(postId: number) {
    let newPosts = posts
    newPosts = newPosts.map(post => {
      if (post.id === postId) {
        const index = post.reactions.indexOf(1)
        console.log(index)
        post.reactions.splice(index)
        return post
      }

      return post
    })
    setPosts(newPosts)
  }

  return (
    <div>
      <Head>
        <title>lazy</title>
      </Head>

      <Header />

      <main className="page home-page">
        <div className="timeline">
          {posts.map(post => {
            return (
              <PostCard
                key={post.id}
                post={post}
                onAddReaction={() => addReactionToPost(post.id)}
                onRemoveReaction={() => removeReactionFromPost(post.id)}
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default Home

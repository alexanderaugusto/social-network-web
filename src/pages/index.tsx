import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import api from '../services/api'
import { useAuth } from '../contexts/auth'
import { Button, Header, InputArea, PostCard } from '../components'

import ImageIcon from '@material-ui/icons/Image'

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

type NewPostProps = {
  description: string
  media: string
}

const Home: React.FC = () => {
  const auth = useAuth()
  const [posts, setPosts] = useState<Array<PostProps>>([])
  const [newPost, setNewPost] = useState<NewPostProps>({
    description: '',
    media:
      'https://img.freepik.com/vetores-gratis/imagens-animadas-abstratas-neon-lines_23-2148344065.jpg?size=626&ext=jpg'
  })

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
    if (auth.signed) {
      getUserTimeline()
    }
  }, [getUserTimeline, auth.signed])

  async function addReactionToPost(postId: number) {
    let newPosts = posts
    newPosts = posts.map(post => {
      if (post.id === postId) {
        post.reactions.push(1)
        post.totalReactions += 1
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
        post.reactions.splice(index)
        post.totalReactions -= 1
        return post
      }

      return post
    })
    setPosts(newPosts)
  }

  async function publishPost() {
    const data = {
      description: newPost.description,
      media: newPost.media
    }

    await api
      .post('/posts', data)
      .then(() => {
        setNewPost({
          description: '',
          media: ''
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  if (!auth.signed) {
    return null
  }

  return (
    <div>
      <Head>
        <title>Lazy</title>
      </Head>

      <Header />

      <main className="page home-page">
        <div className="timeline">
          <div className="add-post">
            <div className="user">
              <Link href={`/profile/${auth.user.id}`}>
                <a>
                  <img src={auth.user.avatar} alt={auth.user.name} />
                </a>
              </Link>
              <Link href={`/profile/${auth.user.id}`}>
                <a>
                  <label>{auth.user.name}</label>
                </a>
              </Link>
            </div>
            <InputArea
              placeholder="Descreva o que você está pensando"
              value={newPost.description}
              onChange={e =>
                setNewPost({ ...newPost, description: e.target.value })
              }
            />
            <div className="actions">
              <Button id="btn-image">
                <ImageIcon id="icon" />
                <label>Adicionar imagem</label>
              </Button>
              <Button id="btn-publish" onClick={publishPost}>
                Publicar
              </Button>
            </div>
          </div>
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

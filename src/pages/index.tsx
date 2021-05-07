import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import api from '../services/api'
import Dropzone from 'react-dropzone'
import { useAuth } from '../contexts/auth'
import { useAlert } from '../contexts/alert'
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
  file: any
}

const Home: React.FC = () => {
  const alert = useAlert()
  const auth = useAuth()
  const [posts, setPosts] = useState<Array<PostProps>>([])
  const [newPost, setNewPost] = useState<NewPostProps>({
    description: '',
    file: null
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

  function addFile(acceptedFile) {
    const file = acceptedFile
    file.preview = URL.createObjectURL(acceptedFile)
    setNewPost({ ...newPost, file })
  }

  function validate() {
    if (newPost.description.length >= 3 || newPost.file !== null) {
      publishPost()
    } else {
      const type = 'warning'
      const title = 'Algo deu errado :('
      const message = 'Seu post deve conter uma descrição ou uma imagem'
      alert.show(type, title, message)
    }
  }

  async function publishPost() {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const data = new FormData()
    data.append('description', newPost.description)
    data.append('file', newPost.file)

    await api
      .post('/posts', data, config)
      .then(() => {
        setNewPost({
          description: '',
          file: null
        })
      })
      .catch(err => {
        const type = err.response.status >= 500 ? 'error' : 'warning'
        const title = 'Algo deu errado :('
        const message =
          'Não conseguimos criar seu post, verifique se vc está enviando os dados corretamente.'
        alert.show(type, title, message)
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
                  <img
                    src={process.env.NEXT_PUBLIC_API_STORAGE + auth.user.avatar}
                    alt={auth.user.name}
                  />
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
            {newPost.file && (
              <div className="image-preview">
                <img src={newPost.file.preview} alt="post preview" />
              </div>
            )}
            <div className="actions">
              <Dropzone
                accept={['image/jpeg', 'image/png', 'image/webp']}
                onDrop={acceptedFiles => {
                  if (acceptedFiles) {
                    addFile(acceptedFiles[0])
                  }
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Button id="btn-image">
                      <ImageIcon id="icon" />
                      <label>Adicionar imagem</label>
                    </Button>
                  </div>
                )}
              </Dropzone>
              <Button id="btn-publish" onClick={validate}>
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

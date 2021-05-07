import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Dropzone from 'react-dropzone'
import { useAuth } from '../../contexts/auth'
import { useAlert } from '../../contexts/alert'
import api from '../../services/api'
import { Button, Header, PostCard } from '../../components'

import BgImage from '../../assets/profile-background.jpg'

import CheckIcon from '@material-ui/icons/Check'

type UserProps = {
  id: number
  name: string
  avatar: string
  totalFollowers: number
  totalFollowings: number
  totalPosts: number
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

const Profile: React.FC = () => {
  const alert = useAlert()
  const auth = useAuth()
  const router = useRouter()
  const { id: userId } = router.query
  const [user, setUser] = useState<UserProps>(null)
  const [userFollows, setUserFollows] = useState(false)
  const [userPosts, setUserPosts] = useState<Array<PostProps>>([])

  const getUserProfile = useCallback(async () => {
    await api
      .get(`/users/${userId}`)
      .then(res => {
        setUser(res.data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [userId])

  const getUserPosts = useCallback(async () => {
    await api
      .get(`/users/${userId}/posts`)
      .then(res => {
        setUserPosts(res.data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [userId])

  const isFollowerByAuthenticatedUser = useCallback(async () => {
    await api
      .get(`/users/${auth.user.id}/follow/${userId}`)
      .then(() => {
        setUserFollows(true)
      })
      .catch(err => {
        setUserFollows(false)
        console.error(err)
      })
  }, [userId, auth.user])

  useEffect(() => {
    if (auth.signed && userId) {
      getUserProfile()
      getUserPosts()
      isFollowerByAuthenticatedUser()
    }
  }, [
    getUserProfile,
    getUserPosts,
    isFollowerByAuthenticatedUser,
    auth.signed,
    userId
  ])

  async function followUser() {
    await api
      .put(`/users/follow/${userId}`)
      .then(() => {
        setUserFollows(true)
        setUser({ ...user, totalFollowers: user.totalFollowers + 1 })
      })
      .catch(err => {
        console.error(err)
      })
  }

  async function unfollowUser() {
    await api
      .delete(`/users/follow/${userId}`)
      .then(() => {
        setUserFollows(false)
        setUser({ ...user, totalFollowers: user.totalFollowers - 1 })
      })
      .catch(err => {
        console.error(err)
      })
  }

  async function addReactionToPost(postId: number) {
    let newPosts = userPosts
    newPosts = userPosts.map(post => {
      if (post.id === postId) {
        post.reactions.push(1)
        post.totalReactions += 1
        return post
      }

      return post
    })
    setUserPosts(newPosts)
  }

  async function removeReactionFromPost(postId: number) {
    let newPosts = userPosts
    newPosts = newPosts.map(post => {
      if (post.id === postId) {
        const index = post.reactions.indexOf(1)
        post.reactions.splice(index)
        post.totalReactions -= 1
        return post
      }

      return post
    })
    setUserPosts(newPosts)
  }

  async function removePost(postId: number) {
    const newPosts = userPosts.filter(post => post.id !== postId)
    setUserPosts(newPosts)
  }

  async function changeAvatar(file) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const data = new FormData()
    data.append('file', file)

    await api
      .put(`/users/${auth.user.id}/avatar`, data, config)
      .then(res => {
        const { avatar } = res.data
        setUser({ ...user, avatar })
        auth.setUser(res.data)
        createPostFromImage(file)
      })
      .catch(err => {
        const type = err.response.status >= 500 ? 'error' : 'warning'
        const title = 'Algo deu errado :('
        const message = 'Não conseguimos atualizar sua image, tente novamente.'
        alert.show(type, title, message)
        console.error(err)
      })
  }

  async function createPostFromImage(file) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const data = new FormData()
    data.append('description', 'Atualizando imagem de perfil...')
    data.append('file', file)

    await api
      .post('/posts', data, config)
      .then(res => {
        const newPosts = userPosts
        newPosts.unshift(res.data)
        setUserPosts(newPosts)
        setUser({ ...user, totalPosts: user.totalPosts += 1 })
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <div>
      <Head>
        <title>Perfil</title>
      </Head>

      <Header />

      <main className="page profile-page">
        <div className="bg-image">
          <img src={BgImage} alt="Perfil" />
        </div>
        {user && (
          <div className="user-profile">
            <div className="user-info">
              <div className="user">
                <Dropzone
                  accept={['image/jpeg', 'image/png', 'image/webp']}
                  onDrop={acceptedFiles => {
                    if (acceptedFiles) {
                      changeAvatar(acceptedFiles[0])
                    }
                  }}
                  disabled={user.id.toString() !== auth.user.id.toString()}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <img
                        src={process.env.NEXT_PUBLIC_API_STORAGE + user.avatar}
                        alt={user.name}
                        style={{
                          cursor:
                            user.id.toString() !== auth.user.id.toString()
                              ? 'default'
                              : 'pointer'
                        }}
                      />
                    </div>
                  )}
                </Dropzone>
                <label>{user.name}</label>
              </div>
              <div className="follow-container">
                {userId.toString() !== auth?.user?.id.toString() && (
                  <div className="follow">
                    {userFollows ? (
                      <Button id="btn-unfollow" onClick={unfollowUser}>
                        <CheckIcon id="icon" />
                        Seguir
                      </Button>
                    ) : (
                      <Button id="btn-follow" onClick={followUser}>
                        Seguir
                      </Button>
                    )}
                  </div>
                )}
                <div className="follow">
                  <h2>Publicações</h2>
                  <p>{user.totalPosts}</p>
                </div>
                <div className="follow">
                  <h2>Seguidores</h2>
                  <p>{user.totalFollowers}</p>
                </div>
                <div className="follow">
                  <h2>Segue</h2>
                  <p>{user.totalFollowings}</p>
                </div>
              </div>
            </div>
            <div className="user-posts">
              {userPosts.map(post => {
                return (
                  <PostCard
                    key={post.id}
                    post={post}
                    onAddReaction={() => addReactionToPost(post.id)}
                    onRemoveReaction={() => removeReactionFromPost(post.id)}
                    onDeletePost={() => removePost(post.id)}
                  />
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Profile

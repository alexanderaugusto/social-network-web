import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/auth'
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
                <img
                  src={process.env.NEXT_PUBLIC_API_STORAGE + user.avatar}
                  alt={user.name}
                />
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
                console.log(process.env.NEXT_PUBLIC_API_STORAGE + post.media)
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
          </div>
        )}
      </main>
    </div>
  )
}

export default Profile

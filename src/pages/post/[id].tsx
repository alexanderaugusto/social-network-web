import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/auth'
import { useAlert } from '../../contexts/alert'
import { useLoader } from '../../contexts/loader'
import api from '../../services/api'
import { Button, Header, Input } from '../../components'

import DeleteIcon from '@material-ui/icons/Delete'
import SendIcon from '@material-ui/icons/Send'

type UserProps = {
  id: number
  name: string
  avatar: string
}

type PostInfoProps = {
  id: number
  description: string
  media: string | null
  totalReactions: number
  totalComments: number
  owner: UserProps
  reactions: [number]
}

type PostCommentsProps = {
  id: number
  description: string
  user: UserProps
}

const Post: React.FC = () => {
  const loader = useLoader()
  const alert = useAlert()
  const auth = useAuth()
  const router = useRouter()
  const { id: postId } = router.query
  const [postInfo, setPostInfo] = useState<PostInfoProps>(null)
  const [postComments, setPostComments] = useState<Array<PostCommentsProps>>([])
  const [ownerPosts, setOwnerPosts] = useState<Array<PostInfoProps>>([])
  const [userComment, setUserComment] = useState('')

  const getPostInfo = useCallback(async () => {
    loader.start()

    await api
      .get(`/posts/${postId}`)
      .then(res => {
        setPostInfo(res.data)
      })
      .catch(err => {
        console.error(err)
      })

    loader.stop()
  }, [postId])

  const getPostComments = useCallback(async () => {
    loader.start()

    await api
      .get(`/posts/${postId}/comments`)
      .then(res => {
        setPostComments(res.data)
      })
      .catch(err => {
        console.error(err)
      })

    loader.stop()
  }, [postId])

  const getOwnerPosts = useCallback(
    async post => {
      const ownerId = post.owner.id

      loader.start()

      await api
        .get(`/users/${ownerId}/posts`)
        .then(res => {
          const newOwnerPosts = res.data.filter(
            post => post.id.toString() !== postId.toString()
          )
          setOwnerPosts(newOwnerPosts)
        })
        .catch(err => {
          console.error(err)
        })

      loader.stop()
    },
    [postId]
  )

  useEffect(() => {
    if (auth.signed && postId) {
      getPostInfo()
      getPostComments()
    }
  }, [getPostInfo, getPostComments, postId, auth.signed])

  useEffect(() => {
    if (auth.signed && postId && postInfo) {
      getOwnerPosts(postInfo)
    }
  }, [postId, postInfo, getOwnerPosts, auth.signed])

  async function addComment() {
    const data = {
      description: userComment
    }

    await api
      .post(`/posts/${postId}/comments`, data)
      .then(res => {
        const newComments = postComments
        newComments.push(res.data)
        setPostComments(newComments)

        setUserComment('')
      })
      .catch(err => {
        const type = 'warning'
        const title = 'Algo deu errado :('
        const message =
          'N??o conseguimos enviar seu coment??rio, tente novamente.'
        alert.show(type, title, message)
        console.error(err)
      })
  }

  async function deleteComment(commentId: number) {
    await api
      .delete(`/posts/${postId}/comments/${commentId}`)
      .then(() => {
        let newComments = postComments
        newComments = newComments.filter(comment => comment.id !== commentId)
        setPostComments(newComments)
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <div>
      <Head>
        <title>Detalhes do Post</title>
      </Head>

      <Header />

      <main className="page post-page">
        {postInfo && (
          <div className="post">
            <div className="post-image">
              <img
                src={process.env.NEXT_PUBLIC_API_STORAGE + postInfo.media}
                alt={postInfo.description}
              />
            </div>

            <div className="post-info-container">
              <div className="description">
                <div className="user">
                  <Link href={`/profile/${postInfo.owner.id}`}>
                    <a>
                      <img
                        src={
                          process.env.NEXT_PUBLIC_API_STORAGE +
                          postInfo.owner.avatar
                        }
                        alt={postInfo.owner.name}
                      />
                    </a>
                  </Link>
                  <Link href={`/profile/${postInfo.owner.id}`}>
                    <a>
                      <label>{postInfo.owner.name}</label>
                    </a>
                  </Link>
                </div>
                <p>{postInfo.description}</p>
              </div>

              <div className="comments-container">
                {postComments.map(comment => {
                  return (
                    <div key={comment.id} className="comment-container">
                      <div className="user">
                        <Link href={`/profile/${comment.user.id}`}>
                          <a>
                            <img
                              src={
                                process.env.NEXT_PUBLIC_API_STORAGE +
                                comment.user.avatar
                              }
                              alt={comment.user.name}
                            />
                          </a>
                        </Link>
                      </div>
                      <div className="comment">
                        <p>{comment.description}</p>
                      </div>
                      {comment.user?.id === auth.user?.id && (
                        <Button onClick={() => deleteComment(comment.id)}>
                          <DeleteIcon id="icon" />
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>

              <form
                className="input-container"
                onSubmit={e => {
                  e.preventDefault()
                  addComment()
                }}
              >
                <Input
                  type="text"
                  placeholder="Deixe aqui seu coment??rio"
                  value={userComment}
                  onChange={e => setUserComment(e.target.value)}
                />
                <Button type="submit">
                  <SendIcon id="icon" />
                </Button>
              </form>
            </div>
          </div>
        )}

        <div className="owner-posts">
          <h1>
            Outros posts de <span> {postInfo?.owner.name}</span>
          </h1>

          <div className="posts-container">
            {ownerPosts.map(post => {
              return (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <a>
                    <div className="owner-post">
                      <img
                        src={process.env.NEXT_PUBLIC_API_STORAGE + post.media}
                        alt={post.description}
                      />
                    </div>
                  </a>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Post

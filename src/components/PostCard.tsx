import React from 'react'
import Button from './Button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/auth'
import api from '../services/api'

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import CommentIcon from '@material-ui/icons/Comment'

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

type PostCardProps = {
  post: PostProps
  onAddReaction: () => void
  onRemoveReaction: () => void
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onAddReaction,
  onRemoveReaction
}) => {
  const router = useRouter()
  const auth = useAuth()

  async function addReactionToPost() {
    await api
      .put(`/posts/${post.id}/reactions`)
      .then(() => {
        onAddReaction()
      })
      .catch(err => {
        console.error(err)
      })
  }

  async function removeReactionFromPost() {
    await api
      .delete(`/posts/${post.id}/reactions`)
      .then(() => {
        onRemoveReaction()
      })
      .catch(err => {
        console.error(err)
      })
  }

  function isReactedByUser() {
    if (!auth.signed) {
      return false
    }

    return post.reactions.includes(auth.user.id)
  }

  return (
    <div className="post-card-container">
      <div className="user">
        <Link href={`/profile/${post.owner.id}`}>
          <a>
            <img
              src={process.env.NEXT_PUBLIC_API_STORAGE + post.owner.avatar}
              alt={post.owner.name}
            />
          </a>
        </Link>
        <Link href={`/profile/${post.owner.id}`}>
          <a>
            <label>{post.owner.name}</label>
          </a>
        </Link>
      </div>
      <div className="post">
        <h2>{post.description}</h2>
        <img
          src={process.env.NEXT_PUBLIC_API_STORAGE + post.media}
          alt={post.description}
        />
      </div>
      <div className="actions">
        <Button
          className={isReactedByUser() ? 'user-reacted' : ''}
          onClick={() => {
            if (isReactedByUser()) {
              removeReactionFromPost()
            } else {
              addReactionToPost()
            }
          }}
        >
          {isReactedByUser() ? (
            <FavoriteIcon id="icon" />
          ) : (
            <FavoriteBorderIcon id="icon" />
          )}
          <label>Curtir</label>
          <label>({post.totalReactions})</label>
        </Button>
        <Button onClick={() => router.push(`/post/${post.id}`)}>
          <CommentIcon id="icon" />
          <label>Comentar</label>
          <label>({post.totalComments})</label>
        </Button>
      </div>
    </div>
  )
}

export default PostCard

import React from 'react'
import Button from './Button'
import Link from 'next/link'
import { useRouter } from 'next/router'

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import CommentIcon from '@material-ui/icons/Comment'

type PostProps = {
  id: number
  description: string
  media: string
  totalReactions: number
  totalComments: number
}

type UserProps = {
  id: number
  name: string
  avatar: string
}

type PostCardProps = {
  post: PostProps
  user: UserProps
}

const PostCard: React.FC<PostCardProps> = ({ post, user }) => {
  const router = useRouter()

  return (
    <div className="post-card-container">
      <div className="user">
        <Link href={`/profile/${user.id}`}>
          <a>
            <img src={user.avatar} alt={user.name} />
          </a>
        </Link>
        <Link href={`/profile/${user.id}`}>
          <a>
            <label>{user.name}</label>
          </a>
        </Link>
      </div>
      <div className="post">
        <h2>{post.description}</h2>
        <img src={post.media} alt={post.description} />
      </div>
      <div className="actions">
        <Button>
          <FavoriteBorderIcon id="icon" />
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

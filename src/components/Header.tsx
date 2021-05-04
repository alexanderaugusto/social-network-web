import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Button from './Button'
import Input from './Input'

import LazyLogo from '../assets/lazy-black.png'

import SearchIcon from '@material-ui/icons/Search'

const Header: React.FC = () => {
  const router = useRouter()
  const auth = {
    id: 1,
    avatar: 'https://www.pngkey.com/png/detail/193-1938385_-pikachu-avatar.png',
    name: 'Alexander Augusto'
  }
  const [searchText, setSearchText] = useState('')

  function searchUser() {
    router.push(`/users?name=${searchText}`)
  }

  return (
    <div className="header-container">
      <div className="header">
        <div className="logo">
          <Link href="/">
            <a>
              <img src={LazyLogo} alt="Lazy" />
            </a>
          </Link>
        </div>
        <div className="search-container">
          <form
            className="search-input"
            onSubmit={e => {
              e.preventDefault()
              searchUser()
            }}
          >
            <Input
              type="text"
              placeholder="Procurar novo usuário"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button type="submit">
              <a>
                <SearchIcon id="icon" />
              </a>
            </Button>
          </form>
        </div>
        <div className="user">
          <Link href={`/profile/${auth.id}`}>
            <a>
              <img src={auth.avatar} alt={auth.name} />
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Header

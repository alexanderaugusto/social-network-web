import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/auth'
import Button from './Button'
import Input from './Input'

import LazyLogo from '../assets/lazy-black.png'

import SearchIcon from '@material-ui/icons/Search'

const Header: React.FC = () => {
  const router = useRouter()
  const auth = useAuth()
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
        {auth.signed && (
          <div className="user">
            <Link href={`/profile/${auth.user.id}`}>
              <a>
                <img src={auth.user.avatar} alt={auth.user.name} />
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../contexts/auth'
import api from '../services/api'
import Button from './Button'
import Input from './Input'

import LazyLogo from '../assets/lazy-black.png'

import SearchIcon from '@material-ui/icons/Search'
import ExitIcon from '@material-ui/icons/ExitToApp'

const Header: React.FC = () => {
  const auth = useAuth()
  const [searchText, setSearchText] = useState('')
  const [searchedUsers, setSearchedUsers] = useState([])
  const [searchFocus, setSearchFocus] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef, menuOpen])

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocus(false)
      }
    }

    if (searchFocus) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchRef, searchFocus])

  async function searchUsers() {
    const config = {
      params: {
        name: searchText
      }
    }

    await api
      .get('/users/search', config)
      .then(res => {
        setSearchedUsers(res.data.content)
      })
      .catch(err => {
        console.error(err)
      })
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
        <div className="search-container" ref={searchRef}>
          <form
            className="search-input"
            onSubmit={e => {
              e.preventDefault()
              searchUsers()
            }}
          >
            <Input
              type="text"
              placeholder="Procurar novo usuário"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              // onBlur={() => setSearchFocus(false)}
              onKeyUp={() => searchUsers()}
            />
            <SearchIcon id="icon" />
            {searchFocus && (
              <div className="users-container">
                {searchedUsers.map(user => {
                  return (
                    <div key={user.id} className="user">
                      <Link href={`/profile/${user.id}`}>
                        <a>
                          <img
                            src={
                              process.env.NEXT_PUBLIC_API_STORAGE + user.avatar
                            }
                            alt={user.name}
                          />
                          <label>{user.name}</label>
                        </a>
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </form>
        </div>
        {auth.signed && (
          <div ref={menuRef}>
            <div className="user">
              <Button onClick={() => setMenuOpen(!menuOpen)}>
                <img
                  src={process.env.NEXT_PUBLIC_API_STORAGE + auth.user.avatar}
                  alt={auth.user.name}
                />
              </Button>
            </div>
            {menuOpen && (
              <div className="user-options">
                <div className="user">
                  <Link href={`/profile/${auth.user.id}`}>
                    <a>
                      <img
                        src={
                          process.env.NEXT_PUBLIC_API_STORAGE + auth.user.avatar
                        }
                        alt={auth.user.name}
                      />
                    </a>
                  </Link>
                  <Link href={`/profile/${auth.user.id}`}>
                    <a className="name">
                      <label>{auth.user.name}</label>
                      <p>Veja seu perfil</p>
                    </a>
                  </Link>
                </div>

                <Button onClick={() => auth.signOut()}>
                  <ExitIcon id="icon" />
                  Sair
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Header

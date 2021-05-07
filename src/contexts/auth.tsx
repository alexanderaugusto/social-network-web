import { AxiosResponse } from 'axios'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'
import { useRouter } from 'next/router'
import api from '../services/api'

type UserProps = {
  id: number
  email: string
  name: string
  avatar: string
}

type AuthContextProps = {
  signed: boolean
  signIn: (email: string, password: string) => Promise<AxiosResponse>
  signOut: () => void
  user: UserProps
  setUser: (user: UserProps) => void
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

// eslint-disable-next-line react/prop-types
export const AuthProvider: React.FC = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState<UserProps | null>(null)

  const loadStorageData = useCallback(async () => {
    const userToken = localStorage.getItem('user-token')

    if (userToken) {
      api.defaults.headers.Authorization = `Bearer ${userToken}`

      await api
        .get('/users')
        .then(res => {
          setUser(res.data)
        })
        .catch(err => {
          console.error(err)
          api.defaults.headers.Authorization = ''
          localStorage.clear()
          router.push('/auth/login')
        })
    } else {
      router.push('/auth/login')
    }
  }, [router])

  useEffect(() => {
    if (
      !router.pathname.includes('/auth/login') &&
      !router.pathname.includes('/auth/register')
    ) {
      loadStorageData()
    }
  }, [router.pathname])

  function signIn(email: string, password: string) {
    return new Promise<AxiosResponse>((resolve, reject) => {
      const data = {
        email,
        password
      }

      api
        .post('/auth/login', data)
        .then(res => {
          const { token } = res.data

          localStorage.setItem('user-token', token)

          loadStorageData()

          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  function signOut() {
    localStorage.clear()
    api.defaults.headers.Authorization = ''
    setUser(null)
    router.push('/auth/login')
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user: user, signIn, signOut, setUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useAuth() {
  return useContext(AuthContext)
}

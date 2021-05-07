import React, { createContext, useContext, useState } from 'react'
import { Loader } from '../components'

type LoaderContextProps = {
  active: boolean
  start: () => void
  stop: () => void
}

const LoaderContext = createContext<LoaderContextProps>(
  {} as LoaderContextProps
)

export const LoaderProvider: React.FC = ({ children }) => {
  const [loaderActive, setLoaderActive] = useState(false)

  return (
    <LoaderContext.Provider
      value={{
        active: loaderActive,
        start: () => setLoaderActive(true),
        stop: () => setLoaderActive(false)
      }}
    >
      <Loader active={loaderActive} />
      {children}
    </LoaderContext.Provider>
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useLoader() {
  return useContext(LoaderContext)
}

import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

type LoaderProps = {
  active: boolean
}

const Loader: React.FC<LoaderProps> = ({ active }) => {
  if (!active) {
    return null
  }

  return (
    <div className="loader-container">
      <CircularProgress id="icon" size={50} thickness={5} />
    </div>
  )
}

export default Loader

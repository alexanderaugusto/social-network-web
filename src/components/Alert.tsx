import React, { useEffect } from 'react'
import Button from './Button'

import CloseIcon from '@material-ui/icons/Close'
import CheckIcon from '@material-ui/icons/Check'
import InfoIcon from '@material-ui/icons/Info'

type AlertProps = {
  className?: string
  show: boolean
  type: string
  title: string
  message: string
  toggle: () => void
}

const ICONS = {
  error: <InfoIcon id="alert-icon" />,
  warning: <InfoIcon id="alert-icon" />,
  info: <InfoIcon id="alert-icon" />,
  success: <CheckIcon id="alert-icon" />
}

let timer = null

const Alert: React.FC<AlertProps> = ({
  message,
  show,
  toggle,
  type,
  title
}) => {
  if (!show) {
    return null
  }

  useEffect(() => {
    if (show) {
      clearTimeout(timer)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      timer = setTimeout(() => {
        toggle()
        clearTimeout(timer)
      }, 7000)
    }
  }, [show])

  return (
    <div className={'alert alert-' + type}>
      <div className="alert-container">
        {ICONS[type]}
        <div className="text">
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
        <Button onClick={toggle}>
          <CloseIcon id="icon" />
        </Button>
      </div>
    </div>
  )
}

export default Alert

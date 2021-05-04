import React, { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input: React.FC<InputProps> = ({ label, ...inputProps }) => {
  return (
    <div className="input">
      {label && <label>{label}</label>}
      <div className="input-container">
        <input {...inputProps} autoComplete="new-password" />
      </div>
    </div>
  )
}

export default Input

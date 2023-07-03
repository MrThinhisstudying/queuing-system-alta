import React, { useState } from 'react'
import styles from './Input.module.css';

type InputProps = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  status: boolean,
  value: string | undefined,
  placeholder: string,
}


export const Input = (props: InputProps) => {

  const [text, setText] = useState<string>("")

  return (
    <input
      className={props.status ? styles.input : styles.error}
      type='text'
      value={props.value !== '' ? props.value : text }
      onChange={(e) => {
        props.handleChange(e)
        setText(e.target.value)
      }}
      placeholder={props.placeholder}
    />
  )
}

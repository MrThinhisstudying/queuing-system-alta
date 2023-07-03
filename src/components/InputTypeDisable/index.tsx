import React from 'react'
import styles from './inputTypeDisable.module.css'

type InputTypeDisableType = {
    value: string
}

export const InputTypeDisable = (props: InputTypeDisableType) => {
  return (
    <>
        <div className={styles.input} >
            <p>{props.value}</p>
        </div>
    </>
  )
}

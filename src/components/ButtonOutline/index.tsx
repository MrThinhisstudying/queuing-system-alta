import React from 'react';
import styles from './buttonOutline.module.css';

type ButtonOutlineProps = {
    text: string,
    handleClick: () => void,
}

export const ButtonOutline = (props: ButtonOutlineProps) => {
  return (
    <div className={styles.buttonOutline} onClick={props.handleClick}>
        {props.text}
    </div>
  )
}

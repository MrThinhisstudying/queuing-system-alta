import React, { useEffect } from 'react';
import { Progress } from 'antd';
import styles from './progressCustom.module.css';

type ProgressCustomProps = {
  numberCircle: number,
  colorsCode: string[],
  percents: number[],
}

export const ProgressCustom = (props: ProgressCustomProps) => {

  // useEffect(() => {
  //   console.log(props.percents);
    
  // }, [])

  return (
    <React.Fragment>
      {props.numberCircle === 3 &&
        <Progress
          className={styles.three}
          type="circle"
          percent={props.percents.length !== 0 ? props.percents[2] : 0}
          showInfo={false}
          size={40}
          strokeColor={props.colorsCode[2]}
        />}
      <Progress
        className={styles.two}
        type="circle"
        // showInfo={false}
        status={"normal"}
        percent={props.percents.length !== 0 ? props.percents[1] : 0}
        size={50}
        strokeColor={props.colorsCode[1]}
      />
      <Progress
        className={styles.one}
        type="circle"
        showInfo={false}
        percent={props.percents.length !== 0 ? props.percents[0] : 0}
        size={60}
        strokeColor={props.colorsCode[0]}
      />
    </React.Fragment>
  )
}

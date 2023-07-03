import React, { useEffect, useState } from 'react';
import styles from './checkbox.module.css';


type CheckBoxType = {
    value: string,
    checked: boolean,
    onClick: (value: string) => void
}

export const CheckBox = (props: CheckBoxType) => {

    const [isCheck, setIsCheck] = useState<boolean>(false);

    useEffect(() => {
        setIsCheck(props.checked)
    }, [props.checked])

    const handleCheck = (value: string) => {
        setIsCheck(!isCheck);
        return props.onClick(value);
    }

    return (
        <div className={styles.checkbox} >
            <input
                className={styles.checkBtn}
                type='checkbox'
                checked={isCheck}
                onChange={() => handleCheck(props.value)} 
            />
            <label>{props.value}</label>
        </div>
    )
}

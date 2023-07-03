import React, { useEffect, useState } from 'react';
import styles from './dropdowm.module.css';


type DropdownType = {
    data: string[],
    onClick: (value: string) => void,
    setWidth: string,
    text: string,
    value: string | undefined | null,
}

export const Dropdown = (props: DropdownType) => {

    const [isSelect, setIsSelect] = useState<boolean>(false);
    const [text, setText] = useState<string>(props.data[0])

    useEffect(() => {
        if (props.value !== "" && props.value !== undefined && props.value !== null) return setText(props.value);
    }, [props.value])


    return (
        <div className={styles.dropdown}
            style={{
                width: `${props.setWidth}px`
            }}
        >
            <div
                onClick={() => {
                    setIsSelect(!isSelect)
                }}
            >
                <p>{text === '' && props.text !== '' ? props.text : text}</p>
                <div className={isSelect ? styles.spin : ''} >
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L13 1" fill="#FF7506" />
                        <path d="M1 1L7 7L13 1H1Z" stroke="#FF7506" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            <div className={isSelect ? styles.active : styles.none} >
                <ul>
                    {props.data.map(i => (
                        <li
                            key={i}
                            onClick={() => {
                                setIsSelect(false);
                                setText(i);
                                props.onClick(i);
                            }}
                        >{i}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

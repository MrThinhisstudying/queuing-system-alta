import React, { useState } from 'react'
import styles from './searchText.module.css'

type SearchText = {
    onFind: (text: string) => void;
    setWidth: number,
}

export const SearchText = (props: SearchText) => {

    const [text, setText] = useState<string>("")

    return (
        <div 
            className={styles.searchText}
            style={{
                width: `${props.setWidth}px`
            }}
        >
            <input 
                type="text" 
                placeholder='Nhập từ khóa' 
                onChange={(e) => setText(e.target.value)}
            />
            <div
                onClick={() => props.onFind(text)}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#FF7506" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.5 17.5L13.875 13.875" stroke="#FF7506" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    )
}

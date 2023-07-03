import React, { useCallback, useEffect } from 'react';
import styles from './notification.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getAllNotification } from '../../store/reducers/notificationSlice';

export const Notification = () => {

    const notificationsState = useSelector((state: RootState) => state.notification.notifications);

    const dispatch = useDispatch<any>();

    useEffect(() => {
        dispatch(getAllNotification())
    }, [dispatch])

    const handleDisplayTime = useCallback(
        (time: string) => {
            const dateToFormat = new Date(time);
            let date: string = dateToFormat.getDate().toString();
            let month: string = dateToFormat.getMonth().toString();
            if(parseInt(date) < 10) date = `0${date}`;
            if(parseInt(month) < 10) month = `0${month}`;
            return `${dateToFormat.getHours()}h${dateToFormat.getUTCMinutes()} ngày ${date}/${month}/${dateToFormat.getFullYear()}`
        }, [],
    )


    return (
        <div className={styles.container} >
            <div className={styles.header} >
                <p>Thông báo</p>
            </div>

            <div className={styles.content} >
                {notificationsState.map((item) => {
                    return (
                        <div key={item.id} className={styles.item} >
                            <p className={styles.from} >Người dùng: {item.usernameRecive}</p>
                            <p className={styles.date} >Thời gian nhận số: {handleDisplayTime(item.time)}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

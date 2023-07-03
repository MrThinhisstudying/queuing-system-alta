import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllDataInColection } from "../../config/firebase/firestore";
import { notification } from "../../types";

export const getAllNotification = createAsyncThunk(
    "Notification: GET ALL",
    async () => {
        try {
            const res = await getAllDataInColection('notifications');
            if(res.length === 0 ) return [];
            return res;
        } catch (error) {
            return [];
        }
    }
)

type notificationSliceType = {
    notifications: notification[],
}


const initialState: notificationSliceType = {
    notifications: [],
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        updateNotifications: (state, action) => {
            state.notifications = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getAllNotification.fulfilled, (state, action) => {
            state.notifications = action.payload;
        })
    },
})

export const { updateNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
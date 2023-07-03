import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { device } from "../../types";
import { getAllDataInColection } from "../../config/firebase/firestore";

export const getAllDevices = createAsyncThunk(
    "Devices: GET ALL",
    async () => {
        try {
            const res = await getAllDataInColection('devices');
            return res;
        } catch (error) {
            return [];
        }
    }   
)

type devicesSliceType = {
    devices: device[],
    device: device,
    isFilter: boolean,
    devicesFilter: device[],
}

const initialState: devicesSliceType = {
    devices: [],
    device: {
        id: '',
        deviceUse: '',
        deviceIP: '',
        deviceName: '',
        deviceCode: '',
        activeStatus: 'Ngưng hoạt động',
        connectStatus: 'Mất kết nối',
        username: '',
        password: '',
        deviceType: '',
    },
    isFilter: false,
    devicesFilter: []
}

const devicesSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        addDevice: (state, action) => {
            state.device = action.payload;
        },
        resetDevice: (state, action) => {
            state.device = {
                id: '',
                activeStatus: 'Ngưng hoạt động',
                connectStatus: 'Mất kết nối',
                deviceCode: '',
                deviceIP: '',
                deviceName: '',
                deviceType: '',
                deviceUse: '',
                password: '',
                username: '',
            }
        },
        changeFilter: (state, action) => {
            state.isFilter = action.payload
        },
        addDeviceFilter: (state, action) => {
            state.devicesFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllDevices.fulfilled, (state, action) => {
            state.devices = action.payload;
        })
    }
})

export const { addDevice, resetDevice, addDeviceFilter, changeFilter } = devicesSlice.actions;

export default devicesSlice.reducer
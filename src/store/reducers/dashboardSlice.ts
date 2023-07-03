import { createSlice } from "@reduxjs/toolkit";

type dashboardSliceType = {
    data: {label: Date, value: number}[] & {month: number, week: number, value: number}[],
    typeFilter: string,
}

const initialState: dashboardSliceType = {
    data: [],
    typeFilter: "Ngày"
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        updateDataDashboard: (state, action) => {
            state.data = action.payload;
        },
        updateFilterDashboard: (state, action) => {
            state.typeFilter = action.payload;
        }
    }
})

export const { updateDataDashboard, updateFilterDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
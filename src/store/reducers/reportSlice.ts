import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NumberLevel, report } from "../../types";
import { getAllDataInColection } from "../../config/firebase/firestore";

export const getAllReport = createAsyncThunk(
    "Report: GET ALL",
    async () => {
        try {
            const res = await getAllDataInColection("numberLevels");
            if (res.length === 0) return [];
            const reports: report[] = [];
            res.forEach((item: NumberLevel) => {
                const report: report = {
                    number: item.stt,
                    date: item.timeuse,
                    device: item.device,
                    name: item.service,
                    status: item.status,
                };
                reports.push(report)
            });
            return reports.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        } catch (error) {
            return []
        }
    }
);

type ReportSlice = {
    reports: report[],
    reportsFilter: report[],
};

const initialState: ReportSlice = {
    reports: [],
    reportsFilter: []
};

const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {
        updateReportsFilter: (state, action) => {
            state.reportsFilter = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getAllReport.fulfilled, (state, action) => {
            state.reports = action.payload;
        })
    },
});

export const { updateReportsFilter } = reportSlice.actions;
export default reportSlice.reducer;

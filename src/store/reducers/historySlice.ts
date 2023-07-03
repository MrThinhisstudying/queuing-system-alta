import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history } from "../../types";
import { updateHistory } from "../../utils";
import { addData, getAllDataInColection } from "../../config/firebase/firestore";


export const getAllHistorys = createAsyncThunk(
    "History: GET ALL",
    async () => {
        try {
            const res = await getAllDataInColection('historys');
            return res;
        } catch (error) {
            return [];
        }
    }
)

export const addHistorys = createAsyncThunk(
    "History: ADD HISTORYS",
    async ({ name, content, type }: { name: string, content: string, type: string}) => {
        console.log(type);
        
        const newHistory: history = await updateHistory(name, content, type);
        const add = await addData(newHistory, 'historys')
        return add.data
    }
)


type HistoryType = {
    history: history[],
    isFilter: boolean,
    historyFilter: history[],
}

const initialState: HistoryType = {
    history: [],
    isFilter: false,
    historyFilter: []
}

const historySilce = createSlice({
    name: 'history',
    initialState,
    reducers: {
        updateIsFilter: (state, action) => {
            state.isFilter = action.payload;
        },
        updateHistorysFilter: (state, action) => {
            state.historyFilter = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getAllHistorys.fulfilled, (state, action) => {
            state.history = action.payload;
        })
        builder.addCase(addHistorys.fulfilled, (state, action) => {
            state.history = [...state.history , action.payload as history ];
        })
    },
})

export const { updateHistorysFilter, updateIsFilter } = historySilce.actions;

export default historySilce.reducer;
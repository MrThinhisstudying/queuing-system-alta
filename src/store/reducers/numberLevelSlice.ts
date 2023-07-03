import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NumberLevel } from "../../types";
import { getAllDataInColection } from "../../config/firebase/firestore";


export const getAllNumberLevels = createAsyncThunk(
    "Number Level: GET ALL",
    async () => {
        try {
            const res: NumberLevel[] = await getAllDataInColection('numberLevels');
            return res.sort((a,b) => { return parseInt(a.stt) -  parseInt(b.stt)});
        } catch (error) {
            return []
        }
    }
)


type NumberLevelSlice = {
    numberLevels: NumberLevel[],
    numberLevel: NumberLevel;
    isFilterNumber: boolean,
    numberLevelsFilter: NumberLevel[]
};

const initialState: NumberLevelSlice = {
    numberLevels: [],
    numberLevel: {
        id: "",
        stt: '',
        customer: "",
        device: "",
        service: "",
        status: "",
        timeuse: "",
        timeexpire: "",
        email: "",
        phone: "",
    },
    isFilterNumber: false,
    numberLevelsFilter: []
};

const numberLevelSlice = createSlice({
    name: "numberLevel",
    initialState,
    reducers: {
        addNumberLevel: (state, action) => {
            state.numberLevel = action.payload;
        },
        addNumberLevels: (state, action) => {
            state.numberLevels = [...state.numberLevels, action.payload];
        },
        updateIsFilterNumber: (state, action) => {
            state.isFilterNumber = action.payload;
        },
        setNumberLevelsFilter: (state, action) => {
            state.numberLevelsFilter = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(getAllNumberLevels.fulfilled, (state, action) => {
            state.numberLevels = action.payload;
        })
    },
});

export const {addNumberLevel, addNumberLevels, setNumberLevelsFilter, updateIsFilterNumber} = numberLevelSlice.actions;
export default numberLevelSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { role } from "../../types";
import { getAllDataInColection } from "../../config/firebase/firestore";


export const getAllRole = createAsyncThunk(
    "Role: GET ALL",
    async () => {
        try {
            const res = getAllDataInColection('roles');
            return res;
        } catch (error) {
            return [];
        }
    }
)

export const updateAllRoles = createAsyncThunk(
    "Role: UPDATE ALL",
    async (rolesUpdate, roles) => {
        try {
            
        } catch (error) {
            
        }
    }
)


type roleSliceType = {
    roles: role[],
    role: role,
}

const initialState: roleSliceType = {
    roles: [],
    role: {
        id: '',
        description: '',
        roleName: "",
        numberPeopleUse: 0,
        features: [],
    }
}

const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        addRoles: (state, action) => {
            state.roles = [...state.roles, action.payload];
        },
        updateRoles: (state, action) => {
            state.roles = action.payload;
        },
        getRole: (state, action) => {
            state.role = action.payload;
        },
        clearRole: (state, action) => {
            state.role = {
                id: '',
                description: '',
                roleName: "",
                numberPeopleUse: 0,
                features: [],
            }
        }
    },
    extraReducers(builder) {
        builder.addCase(getAllRole.fulfilled, (state, action) => {
            state.roles = action.payload;
        })
    },
})

export const { addRoles, getRole, clearRole, updateRoles } = roleSlice.actions;
export default roleSlice.reducer;
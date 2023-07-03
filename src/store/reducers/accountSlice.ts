import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { account } from "../../types";
import {
    getAllDataInColection,
    updateData,
} from "../../config/firebase/firestore";

export const getAllAccount = createAsyncThunk("Account: GET ALL", async () => {
    try {
        const res = await getAllDataInColection("accounts");
        return res;
    } catch (error) {
        return [];
    }
});

export const updateAccount = createAsyncThunk(
    "Account: UPDATE ACCOUNT",
    async (data: account) => {
        try {
            const res = await updateData(data, "accounts");
            if (res === null)
                return {
                    id: "",
                    email: "",
                    fullname: "",
                    password: "",
                    phone: "",
                    role: "",
                    status: "",
                    username: "",
                    avatar: "",
                } as account;
            return res;
        } catch (error) {
            return {
                id: "",
                email: "",
                fullname: "",
                password: "",
                phone: "",
                role: "",
                status: "",
                username: "",
                avatar: "",
            } as account;
        }
    }
);

type accountSliceType = {
    accounts: account[];
    account: account;
    accountLogin: account;
    accountsFilter: account[];
    isFilter: boolean;
};

const initialState: accountSliceType = {
    accounts: [],
    account: {
        id: "",
        email: "",
        fullname: "",
        password: "",
        phone: "",
        role: "",
        status: "",
        username: "",
        avatar: "",
    },
    accountLogin: {
        id: "",
        email: "",
        fullname: "",
        password: "",
        phone: "",
        role: "",
        status: "",
        username: "",
        avatar: "",
    },
    accountsFilter: [],
    isFilter: false,
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        addAccount: (state, action) => {
            state.account = action.payload;
        },
        clearAccount: (state, action) => {
            state.account = {
                id: "",
                email: "",
                fullname: "",
                password: "",
                phone: "",
                role: "",
                status: "",
                username: "",
                avatar: "",
            };
        },
        changeAccountLogin: (state, action) => {
            state.accountLogin = action.payload;
        },
        updateAccounts: (state, action) => {
            state.accounts = action.payload;
        },
        filterAccounts: (state, action) => {
            state.accountsFilter = action.payload;
        },
        updateFilterState: (state, action) => {
            state.isFilter = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(getAllAccount.fulfilled, (state, action) => {
            state.accounts = action.payload;
        });
        builder.addCase(updateAccount.fulfilled, (state, action) => {
            state.accountLogin = action.payload;
        });
    },
});

export const {
    addAccount,
    clearAccount,
    changeAccountLogin,
    updateAccounts,
    filterAccounts,
    updateFilterState,
} = accountSlice.actions;

export default accountSlice.reducer;

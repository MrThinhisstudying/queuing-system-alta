import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NumberLevel, service } from "../../types";
import {
    addData,
    getAllDataInColection,
    getListNumberLevelOfService,
} from "../../config/firebase/firestore";

export const getAllServices = createAsyncThunk("Service: GET ALL", async () => {
    try {
        const res = await getAllDataInColection("services");
        return res;
    } catch (error) {
        return [];
    }
});

export const createNewService = createAsyncThunk(
    "Service: CREATE SERVICE",
    async (service: service) => {
        const res = await addData(service, "services");
        if (res.status === true) return res.data;
        // return res.data;
    }
);

export const getListNumberOfService = createAsyncThunk(
    "Service: GET LIST NUMBER LEVEL OF SERVICE",
    async (name: string) => {
        try {
            const res = await getListNumberLevelOfService(name);
            res.forEach((item) => {
                if(item.status.match("Đang chờ")) return item.status = "Đang thực hiện";
                if(item.status.match("Đã sử dụng")) return item.status = "Đã hoàn thành";
                if(item.status.match("Bỏ qua")) return item.status = "Vắng";
            })
            return res;
        } catch (error) {
            return [];
        }
    }
)

type serviceSliceType = {
    services: service[];
    isFilter: boolean;
    service: service;
    listNumberLevelOfService: NumberLevel[],
    isFilterNumberList: boolean,
    filterServices: service[];
    filterNumberList: NumberLevel[];
};

const initialState: serviceSliceType = {
    services: [],
    isFilter: false,
    service: {
        id: "",
        activeStatus: "",
        description: "",
        serviceCode: "",
        serviceName: "",
        dateCreate: '',
        rule: [],
    },
    isFilterNumberList: false,
    listNumberLevelOfService: [],
    filterServices: [],
    filterNumberList: []
};

const serviceSlice = createSlice({
    name: "service",
    initialState,
    reducers: {
        setFilterServices: (state, action) => {
            state.filterServices = action.payload;
        },
        setService: (state, action) => {
            state.service = action.payload;
        },
        clearService: (state, action) => {
            state.service = {
                id: "",
                activeStatus: "",
                description: "",
                serviceCode: "",
                serviceName: "",
                dateCreate: '',
                rule: [],
            };
        },
        setFilterNumberList: (state, action) => {
            state.filterNumberList = action.payload
        },
        updateService: (state, action) => {
            state.services = action.payload;
        },
        updateIsFilterService: (state, action) => {
            state.isFilter = action.payload;
        },
        updateIsFilterNumberList: (state, action) => {
            state.isFilterNumberList = action.payload;
        }

    },
    extraReducers(builder) {
        builder.addCase(getAllServices.fulfilled, (state, action) => {
            state.services = action.payload;
        });
        builder.addCase(createNewService.fulfilled, (state, action) => {
            state.services = [...state.services, action.payload as service];
        });
        builder.addCase(getListNumberOfService.fulfilled, (state, action) => {
            state.listNumberLevelOfService = action.payload;
        })
    },
});

export const { setFilterServices, setFilterNumberList ,setService, updateIsFilterService,clearService, updateService, updateIsFilterNumberList } = serviceSlice.actions;

export default serviceSlice.reducer;

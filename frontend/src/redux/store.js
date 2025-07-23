import { configureStore } from "@reduxjs/toolkit";
import { salesSlice } from "./slices";

export const store = configureStore({
    reducer:{
        sales: salesSlice
    },
});
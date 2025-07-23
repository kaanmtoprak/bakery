import { configureStore } from "@reduxjs/toolkit";
import { ingredientsSlice } from "./slices";

export const store = configureStore({
    reducer:{
        ingredients: ingredientsSlice
    },
});
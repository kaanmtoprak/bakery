
import { createAsyncThunk } from "@reduxjs/toolkit"
import { get } from "../../../utilities/http"

export const getIngredients = createAsyncThunk("ingredients/getIngredients", async () => {
    return await get("/getIngredients")
})


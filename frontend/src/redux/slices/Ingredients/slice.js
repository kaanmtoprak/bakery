import { createSlice } from "@reduxjs/toolkit"

// import { getInfiniteSessions, getInfiniteUserSession, getSessions, getUserSession } from "./actions"

const ingredientsSlice = createSlice({
    name: "ingiredients",
    initialState: {
        ingiredients: null,
        isLoading: true,
        error: null,
    },
    reducers: {},
    // extraReducers: builder => {
    //     builder
    //         .addCase(getSessions.pending, state => {
    //             state.isLoading = true
    //         })
    //         .addCase(getSessions.fulfilled, (state, { payload }) => {
    //             state.sessions = payload
    //             state.isLoading = false
    //         })
    //         .addCase(getSessions.rejected, (state, { error }) => {
    //             state.isLoading = false
    //             state.error = error.message
    //         })
    //         .addCase(getInfiniteSessions.fulfilled, (state, { payload }) => {
    //             state.sessions = {
    //                 ...state.sessions,
    //                 Data: [...state.sessions.Data, ...payload.Data],
    //             }
    //             state.isLoading = false
    //         })

    //         .addCase(getUserSession.pending, state => {
    //             state.isLoading = true
    //         })
    //         .addCase(getUserSession.fulfilled, (state, { payload }) => {
    //             state.userSession = payload
    //             state.isLoading = false
    //         })
    //         .addCase(getUserSession.rejected, (state, { error }) => {
    //             state.isLoading = false
    //             state.error = error.message
    //         })
    //         .addCase(getInfiniteUserSession.fulfilled, (state, { payload }) => {
    //             state.userSession = {
    //                 ...state.userSession,
    //                 Data: [...state.userSession.Data, ...payload.Data],
    //             }
    //             state.isLoading = false
    //         })
    // },
})

export default ingredientsSlice.reducer

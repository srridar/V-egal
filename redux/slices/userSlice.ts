import { createSlice } from "@reduxjs/toolkit";

type User = {
    id: string;
    name: string;
    email: string;
    avatar: string;
};

type UserState = {
    user: User | null;
    loading: boolean;
};


const initialState: UserState = {
    user: null,
    loading: false,
};


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        clearUser: (state) => {
            state.user = null;
            state.loading = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
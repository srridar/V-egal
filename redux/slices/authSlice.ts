import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    isVerified?: boolean;
    isOnline?: boolean;
    lastSeen?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;

    socketId?: string;

}


interface AuthState {
    user: IUser | null;
    token: string | null;
    contacts: IUser[];
    searchUsers: IUser[];
    onlineUsers: string[];
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    contacts: [],
    searchUsers: [],
    onlineUsers: [],
    loading: false,
    error: null,
    initialized: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        setUser(state, action: PayloadAction<IUser | null>) {
            state.user = action.payload;
        },
        setToken(state, action: PayloadAction<string | null>) {
            state.token = action.payload;
        },
        login(state, action: PayloadAction<{ user: IUser; token: string }>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
            state.error = null;
            state.initialized = true;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.contacts = [];
            state.searchUsers = [];
            state.onlineUsers = [];
            state.loading = false;
            state.error = null;
            state.initialized = true;
        },

        updateProfile(state, action: PayloadAction<Partial<IUser>>) {
            if (!state.user) return;

            state.user = {
                ...state.user,
                ...action.payload,
            };
        },


        setSearchUsers(state, action: PayloadAction<IUser[]>) {  // set the list of users returned from a search query. This is typically called when the user performs a search for other users in the app.
            state.searchUsers = action.payload;
        },
        clearSearchUsers(state) {     //  clear the list of users returned from a search query.
            state.searchUsers = [];
        },
        setContacts(state, action: PayloadAction<IUser[]>) {     // set the list of contacts for the logged-in user. This is typically called when the app first loads and fetches the user's contacts from the server.
            state.contacts = action.payload;
        },
        addContact(state, action: PayloadAction<IUser>) {   //  add a new contact to the logged-in user's contact list. This is typically called when the user adds a new contact in the app.
            const contactExists = state.contacts.some(
                (contact) => contact._id === action.payload._id
            );
            if (!contactExists) {
                state.contacts.push(action.payload);
            }
        },
        removeContact(state, action: PayloadAction<string>) { // remove a contact from the logged-in user's contact list. This is typically called when the user removes a contact in the app.
            state.contacts = state.contacts.filter(
                (user) => user._id !== action.payload
            );
        },




        setOnlineUsers(state, action: PayloadAction<string[]>) {     //  set the list of online users. This is typically called when the app first connects to the socket server and receives the current list of online users.
            state.onlineUsers = action.payload;
        },

        userOnline(state, action: PayloadAction<string>) {    // when a user comes online, add their ID to the onlineUsers array if not already present 
            if (!state.onlineUsers.includes(action.payload)) {
                state.onlineUsers.push(action.payload);
            }
        },

        userOffline(state, action: PayloadAction<string>) {    // when a user goes offline, remove their ID from the onlineUsers array
            state.onlineUsers = state.onlineUsers.filter(
                (id) => id !== action.payload
            );
        },

    }
})


export const {
    setLoading,
    setError,
    clearError,

    setUser,
    setToken,
    login,
    logout,
    updateProfile,

    setContacts,
    addContact,
    removeContact,

    setSearchUsers,
    clearSearchUsers,

    setOnlineUsers,
    userOnline,
    userOffline,

} = authSlice.actions;


export default authSlice.reducer;

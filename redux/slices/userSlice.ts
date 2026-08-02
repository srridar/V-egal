import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  isVerified?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserState {

  searchUsers: IUser[];
  selectedUser: IUser | null;
  onlineUsers: string[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  searchUsers: [],
  selectedUser: null,
  onlineUsers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
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

    setSelectedUser( state, action: PayloadAction<IUser | null>) {
      state.selectedUser = action.payload;
    },

    clearSelectedUser(state) {
      state.selectedUser = null;
    },

    updateSelectedUser(  state, action: PayloadAction<Partial<IUser>>) {
      if (state.selectedUser) {
        state.selectedUser = {  ...state.selectedUser, ...action.payload};
      }
    },

    // Search Users

    setSearchUsers( state, action: PayloadAction<IUser[]>) {
      state.searchUsers = action.payload;
    },

    addSearchUser( state, action: PayloadAction<IUser>) {
      state.searchUsers.push(action.payload);
    },

    removeSearchUser(state, action: PayloadAction<string>) {
      state.searchUsers = state.searchUsers.filter(
        (user) => user._id !== action.payload
      );
    },

    clearSearchUsers(state) {
      state.searchUsers = [];
    },

    // Online Users

    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },

    userOnline( state, action: PayloadAction<string>) {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },

    userOffline(  state,  action: PayloadAction<string>) {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload
      );
    },

    clearOnlineUsers(state) {
      state.onlineUsers = [];
    },


    resetUserState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setLoading,

  setError,
  clearError,

  setSelectedUser,
  clearSelectedUser,
  updateSelectedUser,

  setSearchUsers,
  addSearchUser,
  removeSearchUser,
  clearSearchUsers,

  setOnlineUsers,
  userOnline,
  userOffline,
  clearOnlineUsers,

  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
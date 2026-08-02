import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IFriend {
  _id: string;
  username: string;
  avatar?: string;
  bio?: string;
  isOnline?: boolean;
}

export interface IFriendRequest {
  _id: string;
  sender: IFriend;
  receiver: IFriend;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

interface FriendState {
  friends: IFriend[];
  incomingRequests: IFriendRequest[];
  outgoingRequests: IFriendRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendState = {
  friends: [],
  incomingRequests: [],
  outgoingRequests: [],
  loading: false,
  error: null,
};

const friendSlice = createSlice({
  name: "friend",
  initialState,

  reducers: {

    setLoading(state, action: PayloadAction<boolean>) {       //  Loading state while fetching friends/requests
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {   //  Store API or socket errors
      state.error = action.payload;
    },

    clearError(state) {                                  // 
      state.error = null;
    },

    // Friends

    setFriends(state, action: PayloadAction<IFriend[]>) {   // Replace the entire friends list from the backend
      state.friends = action.payload;
    },

    addFriend(state, action: PayloadAction<IFriend>) {     // Add a newly accepted friend
      state.friends.push(action.payload);
    },

    removeFriend(state, action: PayloadAction<string>) {    // Remove a friend (unfriend/block)
      state.friends = state.friends.filter(
        (friend) => friend._id !== action.payload
      );
    },

    // Incoming Requests

    setIncomingRequests(state, action: PayloadAction<IFriendRequest[]>) {   //  Load pending incoming requests
      state.incomingRequests = action.payload;
    },

    receiveFriendRequest( state,  action: PayloadAction<IFriendRequest>) {   // Add a new incoming request received in real time
        state.incomingRequests.unshift(action.payload);
    },

    removeIncomingRequest( state, action: PayloadAction<string>) {       //   Remove a request after accepting/rejecting it
      state.incomingRequests =  state.incomingRequests.filter(
          (request) => request._id !== action.payload
        );
    },
  
    // Outgoing Requests
  
    setOutgoingRequests( state,  action: PayloadAction<IFriendRequest[]>) {      // Load requests the current user has sent
      state.outgoingRequests = action.payload;
    },

    sendFriendRequest( state,  action: PayloadAction<IFriendRequest>) {        // Add a newly sent request locally
      state.outgoingRequests.unshift(action.payload);
    },

    cancelFriendRequest( state, action: PayloadAction<string>) {              // Remove a pending outgoing request
      state.outgoingRequests = state.outgoingRequests.filter(
          (request) => request._id !== action.payload
        );
    },

    // Reset

    clearFriends(state) {
      state.friends = [];
      state.incomingRequests = [];
      state.outgoingRequests = [];
    },
  },
});

export const {
  setLoading,

  setError,
  clearError,

  setFriends,
  addFriend,
  removeFriend,

  setIncomingRequests,
  receiveFriendRequest,
  removeIncomingRequest,

  setOutgoingRequests,
  sendFriendRequest,
  cancelFriendRequest,

  clearFriends,
} = friendSlice.actions;

export default friendSlice.reducer;
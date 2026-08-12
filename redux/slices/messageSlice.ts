import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type MessageType = | "text" | "image" | "video" | "audio" | "file";
export type MessageStatus = | "sending" | "sent" | "delivered" | "seen"; 

export interface IMessage {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  status: MessageStatus;
  isEdited?: boolean;
  replyTo?: string;
  createdAt: string;
  updatedAt?: string;
}


interface MessageState {
  messages: IMessage[];
  selectedMessage: IMessage | null;
  replyMessage: IMessage | null;
  editMessage: IMessage | null;
  loading: boolean;
  sending: boolean;
  hasMore: boolean;
  page: number;
  error: string | null;
}


const initialState: MessageState = {
  messages: [],
  selectedMessage: null,
  replyMessage: null,
  editMessage: null,
  loading: false,
  sending: false,
  hasMore: true,
  page: 1,
  error: null,
};



const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
  
    // Loading
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setSending(state, action: PayloadAction<boolean>) {
      state.sending = action.payload;
    },

    // Error
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    clearError(state) {
      state.error = null;
    },

    // Messages
    setMessages(state, action: PayloadAction<IMessage[]>) {
      state.messages = action.payload;
    },

    addMessage(state, action: PayloadAction<IMessage>) {
      state.messages.push(action.payload);
    },

    prependMessages(state, action: PayloadAction<IMessage[]>) {
      state.messages = [...action.payload, ...state.messages];
    },

    updateMessage(state, action: PayloadAction<IMessage>) {
      const index = state.messages.findIndex(
        (msg) => msg._id === action.payload._id
      );

      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },

    deleteMessage(state, action: PayloadAction<string>) {
      state.messages = state.messages.filter(
        (msg) => msg._id !== action.payload
      );
    },

    clearMessages(state) {
      state.messages = [];
    },

    // Selected Message
    setSelectedMessage(state, action: PayloadAction<IMessage | null> ) {
      state.selectedMessage = action.payload;
    },

  
    // Reply
    setReplyMessage(state,  action: PayloadAction<IMessage | null>) {
      state.replyMessage = action.payload;
    },

    clearReplyMessage(state) {
      state.replyMessage = null;
    },
  
    // Edit
    setEditMessage(  state,  action: PayloadAction<IMessage | null> ) {
      state.editMessage = action.payload;
    },

    clearEditMessage(state) {
      state.editMessage = null;
    },

    // Message Status
    updateMessageStatus( state,action: PayloadAction<{ messageId: string; status: MessageStatus;}>  ) {
      const message = state.messages.find((msg) => msg._id === action.payload.messageId);

      if (message) {
        message.status = action.payload.status;
      }
    },

    // Pagination
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },

    setHasMore(state, action: PayloadAction<boolean>) {
      state.hasMore = action.payload;
    },

    // Reset
    resetMessages(state) {
      state.messages = [];
      state.selectedMessage = null;
      state.replyMessage = null;
      state.editMessage = null;
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
      state.sending = false;
      state.error = null;
    },
  },
});

export default messageSlice.reducer;
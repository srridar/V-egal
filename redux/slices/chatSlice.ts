
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMessage {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: "text" | "image" | "video" | "file" | "audio";
  createdAt: string;
  isEdited?: boolean;
  status?: "sending" | "sent" | "delivered" | "seen";
}


export interface IChat {
  _id: string;
  name?: string;
  isGroup: boolean;
  participants: string[];
  lastMessage?: IMessage;
  unreadCount?: number;
}


interface ChatState {
  chats: IChat[];
  activeChat: IChat | null;
  messages: IMessage[];
  selectedMessage: IMessage | null;
  typingUsers: string[];
  loading: boolean;
  loadingMessages: boolean;
  sending: boolean;
  hasMore: boolean;
  page: number;
  error: string | null;
}


const initialState: ChatState = {
  chats: [],
  activeChat: null,
  messages: [],
  selectedMessage: null,
  typingUsers: [],
  loading: false,
  loadingMessages: false,
  sending: false,
  hasMore: true,
  page: 1,
  error: null,

}


const chatSlice = createSlice({
  name: "chat",
  initialState,

  reducers: {

    // Loading  - loading chat list

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    //  Loading messages of selected chat
    setLoadingMessages(state, action: PayloadAction<boolean>) {
      state.loadingMessages = action.payload;
    },

    //  Disable send button while sending
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

    
    // Chat List - Store all conversations
   
    setChats(state, action: PayloadAction<IChat[]>) {
      state.chats = action.payload;
    },

    // Add a newly created conversation
    addChat(state, action: PayloadAction<IChat>) {
      state.chats.unshift(action.payload);
    },

    
    // Active Chat
    
    setActiveChat(state, action: PayloadAction<IChat | null>) {
      state.activeChat = action.payload;
      state.messages = [];
      state.page = 1;
    },

    
    // Messages
    
    // Load conversation messages
    setMessages(state, action: PayloadAction<IMessage[]>) {
      state.messages = action.payload;
    },

    // Receive/send a new message
    addMessage(state, action: PayloadAction<IMessage>) {
      state.messages.push(action.payload);
    },

    // Load older messages when scrolling up
    prependMessages(state, action: PayloadAction<IMessage[]>) {
      state.messages = [...action.payload, ...state.messages];
    },

    // Edit a message or update its status
    updateMessage(state, action: PayloadAction<IMessage>) {
      const index = state.messages.findIndex(
        (m) => m._id === action.payload._id
      );

      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },

    // Remove a message from the UI
    deleteMessage(state, action: PayloadAction<string>) {
      state.messages = state.messages.filter(
        (m) => m._id !== action.payload
      );
    },

    clearMessages(state) {
      state.messages = [];
    },


    // Selected Message - Select a message for reply, forward, delete, etc.
    selectMessage(state, action: PayloadAction<IMessage | null>) {
      state.selectedMessage = action.payload;
    },


    // Typing - Show "typing..." indicator
    userTyping(state, action: PayloadAction<string>) {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },

    userStoppedTyping(state, action: PayloadAction<string>) {
      state.typingUsers = state.typingUsers.filter(
        (id) => id !== action.payload
      );
    },

    clearTypingUsers(state) {
      state.typingUsers = [];
    },

   
    // Pagination

    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },

    setHasMore(state, action: PayloadAction<boolean>) {
      state.hasMore = action.payload;
    },


    // Reset

    clearChat(state) {
      state.activeChat = null;
      state.messages = [];
      state.selectedMessage = null;
      state.typingUsers = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
});

export default chatSlice.reducer;
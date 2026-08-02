import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "./storage";
import {
  persistReducer,
  persistStore,
} from "redux-persist";

import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import callReducer from "./slices/callSlice";
import friendReducer from "./slices/friendSlice";
import messageReducer from "./slices/messageSlice";
import notificationReducer from "./slices/notificationSlice";
import userReducer from "./slices/userSlice"; // <-- Fix this import

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  call: callReducer,
  friend: friendReducer,
  message: messageReducer,
  notification: notificationReducer,
  user: userReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "chat",
    "call",
    "friend",
    "message",
    "notification",
    "user",
  ],
};

// Wrap reducer with persistReducer
const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
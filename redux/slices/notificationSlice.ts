
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NotificationType = | "message" | "friend_request" | "friend_accept" | "call" | "missed_call" | "group_invite" | "system";

export interface INotification {
    _id: string;
    type: NotificationType;
    title: string;
    message: string;
    senderId?: string;
    chatId?: string;
    isRead: boolean;
    createdAt: string;
}


interface NotificationState {
    notifications: INotification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};


const notificationSlice = createSlice({
    name: "notification",
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

        setNotifications(state, action: PayloadAction<INotification[]>) {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter((notification) => !notification.isRead).length;
        },
        addNotification(state, action: PayloadAction<INotification>) {
            state.notifications.unshift(action.payload);
            if (!action.payload.isRead) {
                state.unreadCount++;
            }
        },
        removeNotification(state, action: PayloadAction<string>) {        // Remove a notification and adjust the unread count if necessary
            const notification = state.notifications.find(
                (notification) => notification._id === action.payload
            );

            if (notification && !notification.isRead) {
                state.unreadCount--;
            }

            state.notifications = state.notifications.filter(
                (notification) => notification._id !== action.payload
            );
        },


        markAsRead(state, action: PayloadAction<string>) {              // Mark a single notification as read
            const notification = state.notifications.find(
                (notification) => notification._id === action.payload
            );

            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount--;
            }
        },

        markAllAsRead(state) {                                //   Mark every notification as read and reset the unread count
            state.notifications.forEach((notification) => {
                notification.isRead = true;
            });

            state.unreadCount = 0;
        },

        clearNotifications(state) {      // Remove all notifications from the client state
            state.notifications = [];
            state.unreadCount = 0;
        },

        resetNotifications(state) {           // Reset the slice to its initial state (useful on logout)
            Object.assign(state, initialState);
        },

    }
})


export const {
  setLoading, setError, clearError,
  setNotifications, addNotification, removeNotification,
  markAsRead, markAllAsRead, clearNotifications, resetNotifications } = notificationSlice.actions;

  export default notificationSlice.reducer;
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({

    chatName: {
        type: String,
        trim: true,
        default: "Personal Chat",
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    groupDescription: {
        type: String,
        default: "",
        maxlength: 200,
    },

    groupImage: {
        type: String,
        default: "",
    },

    pinnedMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },

    isArchived: {
        type: Boolean,
        default: false,
    },

    mutedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    deletedFor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

},{timestamps: true });

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;
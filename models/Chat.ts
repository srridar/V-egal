import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({

    type: {
        type: String,
        enum: ["private", "group"],
        default: "private",
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],

    name: {
        type: String,
        default: "",
        trim: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    },
    settings: {
        onlyAdminsCanSend: {
            type: Boolean,
            default: false,
        },

        onlyAdminsCanEditInfo: {
            type: Boolean,
            default: false,
        },
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    groupDescription: {
        type: String,
        default: "",
        maxlength: 200,
    },

    pinnedMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },

    archivedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
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
    inviteLink: {
        type: String,
        default: ""
    },
    joinApproval: {
        type: Boolean,
        default: false
    },
    activeCall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Call",
        default: null
    }

}, { timestamps: true });

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;
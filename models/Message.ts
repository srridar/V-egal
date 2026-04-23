import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            trim: true,
        },
        messageType: {
            type: String,
            enum: ["text", "image", "file", "audio", "video"],
            default: "text",
        },
        fileUrl: {
            type: String,
            default: "",
        },

        fileName: {
            type: String,
            default: "",
        },

        fileSize: {
            type: Number,
            default: 0,
        },
        deletedFor: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        seenBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        deliveredTo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        isEdited: {
            type: Boolean,
            default: false,
        },

        editedAt: {
            type: Date,
        },

        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },
    },
    {
        timestamps: true, // creates createdAt & updatedAt
    }
)

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
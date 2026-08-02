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
            default: "",
            trim: true
        },
        type: {
            type: String,
            enum: ["text", "image", "file", "audio", "video"],
            default: "text",
        },
        mediaUrl: {
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
        reactions: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },

                emoji: String
            }
        ],

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
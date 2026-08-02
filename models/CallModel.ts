import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
{
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },

    initiatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    callType: {
        type: String,
        enum: ["audio", "video"],
        required: true,
    },

    callMode: {
        type: String,
        enum: ["private", "group"],
        default: "private",
    },

    status: {
        type: String,
        enum: [
            "ringing",
            "connecting",
            "ongoing",
            "ended",
            "missed",
            "rejected",
            "cancelled",
            "failed",
        ],
        default: "ringing",
    },

    startedAt: Date,

    endedAt: Date,

    duration: {
        type: Number,
        default: 0, // seconds
    },

    recordingUrl: {
        type: String,
        default: "",
    },

    isRecording: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
});

export default mongoose.models.Call || mongoose.model("Call", callSchema);
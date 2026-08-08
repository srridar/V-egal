import mongoose from "mongoose";

const callLogSchema = new mongoose.Schema(
{
    caller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },
    type: {
        type: String,
        enum: ["audio", "video"],
    },
    status: {
        type: String,
        enum: [
            "answered",
            "missed",
            "rejected",
            "cancelled",
        ],
    },

    duration: Number,
},
{
    timestamps: true,
});

export default mongoose.models.CallLog ||
mongoose.model("CallLog", callLogSchema);
import mongoose from "mongoose";

const callParticipantSchema = new mongoose.Schema(
{
    call: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Call",
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    joinedAt: Date,

    leftAt: Date,

    microphoneOn: {
        type: Boolean,
        default: true,
    },

    cameraOn: {
        type: Boolean,
        default: true,
    },

    screenSharing: {
        type: Boolean,
        default: false,
    },

    handRaised: {
        type: Boolean,
        default: false,
    },

    connectionStatus: {
        type: String,
        enum: [
            "invited",
            "ringing",
            "joined",
            "left",
            "disconnected",
        ],
        default: "invited",
    },
},
{
    timestamps: true,
});

export default mongoose.models.CallParticipant || mongoose.model("CallParticipant", callParticipantSchema); 
import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    // ✅ Single unique identifier
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ✅ Participants (works for both 1-1 and group)
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Optional chat reference
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      index: true,
    },

    // Who started call
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    callType: {
      type: String,
      enum: ["audio", "video"],
      required: true,
    },

    callStatus: {
      type: String,
      enum: [
        "initiated",
        "ringing",
        "ongoing",
        "ended",
        "missed",
        "rejected",
      ],
      default: "initiated",
      index: true,
    },

    startTime: Date,
    endTime: Date,

    // ✅ computed instead of stored
    // duration will be calculated dynamically

    isGroupCall: {
      type: Boolean,
      default: false,
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    endedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    endReason: {
      type: String,
      enum: ["ended", "missed", "rejected", "failed"],
    },
  },
  { timestamps: true }
);

// ✅ Virtual duration (BEST PRACTICE)
callSchema.virtual("duration").get(function () {
  if (this.startTime && this.endTime) {
    return Math.floor((this.endTime.getTime() - this.startTime.getTime()) / 1000);
  }
  return 0;
});

// ✅ Index for fast queries
callSchema.index({ participants: 1 });
callSchema.index({ createdAt: -1 });

const Call =
  mongoose.models.Call || mongoose.model("Call", callSchema);

export default Call;
import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdByRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FriendRequest",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate friendship
friendSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Friend = mongoose.models.Friend || mongoose.model("Friend", friendSchema);
export default Friend;
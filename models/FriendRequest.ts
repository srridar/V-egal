import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

// Prevent duplicate requests
friendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

// Improve query performance
friendRequestSchema.index({ receiver: 1, status: 1 });

friendRequestSchema.pre("save", async function () {
  if (this.sender.toString() === this.receiver.toString()) {
    throw new Error("Cannot send friend request to yourself");
  }
});


const FriendRequest =
  mongoose.models.FriendRequest ||
  mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
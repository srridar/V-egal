import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "message",
        "friend_request",
        "friend_request_accepted",
        "audio_call",
        "video_call",
        "missed_call",
        "group_invite",
        "added_to_group",
        "removed_from_group",
        "mention",
      ],
      required: true,
    },

    title: {
      type: String,
      default: "",
    },

    body: {
      type: String,
      default: "",
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
    },

    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    call: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Call",
      default: null,
    },

    friendRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FriendRequest",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Fast notification lookup
notificationSchema.index({receiver: 1,isRead: 1, createdAt: -1,});

const Notification = mongoose.models.Notification ||  mongoose.model("Notification", notificationSchema);
export default Notification;
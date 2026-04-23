import mongoose from "mongoose";

const groupAdminSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "owner", "moderator"],
      default: "admin",
    },

    permissions: {
      canAddMembers: {
        type: Boolean,
        default: true,
      },

      canRemoveMembers: {
        type: Boolean,
        default: true,
      },

      canSendMessages: {
        type: Boolean,
        default: true,
      },

      canEditGroupInfo: {
        type: Boolean,
        default: false,
      },

      canDeleteMessages: {
        type: Boolean,
        default: false,
      },
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


const GroupAdmin = mongoose.models.GroupAdmin || mongoose.model("GroupAdmin", groupAdminSchema);

export default GroupAdmin; 
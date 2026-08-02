import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Hide password by default
  },
  bio: {
    type: String,
    default: "Hey there! I am using ChatApp.",
    maxlength: 150,
  },
  avatar: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isOnline: {
    type: Boolean,
    default: false,
  },

  lastSeen: {
    type: Date,
    default: Date.now,
  },

  socketId: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: ["online", "offline", "away", "busy"],
    default: "offline",
  },
  settings: {
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },

    language: {
      type: String,
      default: "en",
    },

    notifications: {
      type: Boolean,
      default: true,
    },
  },


}, { timestamps: true, });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
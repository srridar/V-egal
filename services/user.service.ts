import User from "@/models/User";
import mongoose from 'mongoose';

export interface UserResponse {
  success: boolean;
  status: number;
  message: string;
  user?: any;
  users?: any[];
}

export const getAllUsers = async (): Promise<UserResponse> => {
  const users = await User.find({})
    .select("-password -__v")
    .sort({ createdAt: -1 })
    .lean();

  const formattedUsers = users.map((user) => ({
    ...user,
    id: user._id.toString(),
    _id: undefined,
  }));

  return {
    success: true,
    status: 200,
    message: "Users fetched successfully",
    users: formattedUsers,
  };
};

export const getUserById = async (userId: string): Promise<UserResponse> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }
  const user = await User.findById(userId).select("-password -__v");
  if (!user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    status: 200,
    message: "User fetched successfully",
    user,
  };
};



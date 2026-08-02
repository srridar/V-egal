
import Friend from "@/models/Friend";
import mongoose from "mongoose";

export interface UserResponse {
    success: boolean;
    status: number;
    message: string;
    user?: any;
    friends?: any[];
}


export const getAllFriends = async (userId: string): Promise<UserResponse> => {
    const friends = await Friend.find({
        $or: [
            { user1: userId },
            { user2: userId }
        ],
        isBlocked: false
    }).populate("user1", "-password -__v").populate("user2", "-password -__v").lean();


    const users = friends.map((friend) => {
        const friendUser = friend.user1._id.toString() === userId ? friend.user2 : friend.user1;
        return friendUser;
    });

    return {
        success: true,
        status: 200,
        message: "Friends fetched successfully",
        friends: users,
    };

}



export const removeFriend = async (currentUserId: string, friendId: string) => {
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
        throw new Error("Invalid friend id");
    }

    const deletedFriend = await Friend.findOneAndDelete({
        $or: [
            {
                user1: currentUserId,
                user2: friendId,
            },
            {
                user1: friendId,
                user2: currentUserId,
            },
        ],
    });

    if (!deletedFriend) {
        return {
            success: false,
            status: 404,
            message: "Friendship not found",
        };
    }

    return {
        success: true,
        status: 200,
        message: "Friend removed successfully",
    };
};

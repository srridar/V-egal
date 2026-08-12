import FriendRequest from '@/models/FriendRequest'
import Friend from '@/models/Friend';
import User from '@/models/User';
import mongoose from 'mongoose';

export const sendFriendRequest = async (senderId: string, receiverId: string) => {

    if (senderId === receiverId) {
        throw new Error("You cannot send request to yourself");
    }

    // Already friends?
    const existingFriend = await Friend.findOne({
        $or: [
            {
                user1: senderId,
                user2: receiverId,
            },
            {
                user1: receiverId,
                user2: senderId,
            },
        ],
    });

    if (existingFriend) {
        throw new Error("You are already friends.");
    }

    //  duplicate request?
    const existingRequest = await FriendRequest.findOne({
        sender: senderId,
        receiver: receiverId,
        status: "pending",
    });

    if (existingRequest) {
        throw new Error("Friend request already sent.");
    }

    //  reverse request check (auto accept)
    const reverseRequest = await FriendRequest.findOne({
        sender: receiverId,
        receiver: senderId,
        status: "pending",
    });

    if (reverseRequest) {
        return await acceptFriendRequest(
            reverseRequest._id.toString(),
            senderId
        );
    }

    const friendRequest = await FriendRequest.create({
        sender: senderId,
        receiver: receiverId,
    });

    return friendRequest;
};


export const getParticularFriendRequest = async (requestId: string) => {
    const request = await FriendRequest.findById(requestId)
        .populate("sender", "username email")
        .populate("receiver", "username email");

    if (!request) throw new Error("Request not found");
    return request;
};


export const acceptFriendRequest = async (requestId: string, userId: string) => {

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

   
        if (!mongoose.Types.ObjectId.isValid(requestId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid ID");
        }

        // Find friend request
        const request = await FriendRequest.findById(requestId).session(session);

        if (!request) {
            throw new Error("Friend request not found");
        }

        // Make sure the current user is the receiver
        if (request.receiver.toString() !== userId) {
            throw new Error("You are not allowed to accept this request");
        }

        // Make sure request is still pending
        if (request.status !== "pending") {
            throw new Error("Request already handled");
        }

        // Check if friendship already exists
        const existingFriend = await Friend.findOne({
            $or: [
                {
                    user1: request.sender,
                    user2: request.receiver,
                },
                {
                    user1: request.receiver,
                    user2: request.sender,
                },
            ],
        }).session(session);

        if (existingFriend) {
            throw new Error("Users are already friends");
        }

        // Update friend request
        request.status = "accepted";
        request.respondedAt = new Date();

        await request.save({ session });

        // Create friendship
        const friendship = await Friend.create(
            [
                {
                    user1: request.sender,
                    user2: request.receiver,
                    createdByRequest: request._id,
                },
            ],
            { session }
        );

        // Add each user to the other's friendList
        await Promise.all([
            User.findByIdAndUpdate(
                request.sender,
                {
                    $addToSet: {
                        friendList: request.receiver,
                    },
                },
                { session }
            ),

            User.findByIdAndUpdate(
                request.receiver,
                {
                    $addToSet: {
                        friendList: request.sender,
                    },
                },
                { session }
            ),
        ]);

        await session.commitTransaction();

        return {
            success: true,
            status: 200,
            message: "Friend request accepted successfully",
            friend: friendship[0],
        };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};


export const rejectFriendRequest = async (requestId: string, userId: string) => {
    const request = await FriendRequest.findById(requestId);
    if (!request) throw new Error("Friend request not found");

    if (request.receiver.toString() !== userId) {
        throw new Error("You are not allowed to reject this request");
    }

    if (request.status !== "pending") {
        throw new Error("Request already handled");
    }

    request.status = "rejected";
    await request.save();
    return request;
};


export const cancelFriendRequest = async (requestId: string, userId: string) => {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
        throw new Error("Friend request not found");
    }

    if (request.sender.toString() !== userId) {
        throw new Error("You are not allowed to cancel this request");
    }

    if (request.status !== "pending") {
        throw new Error("Cannot cancel this request");
    }

    await FriendRequest.findByIdAndDelete(requestId);
    return { message: "Friend request cancelled successfully" };
};


export const getAllFriendRequest = async (userId: string) => {
    const requests = await FriendRequest.find({
        receiver: userId,
        status: "pending",
    }).populate("sender", "-password -__v")
        .sort({ createdAt: -1 })
        .lean();


    const receivedRequests = requests.map((request: any) => ({
        requestId: request._id,
        status: request.status,
        createdAt: request.createdAt,
        user: request.sender,
    }));

    return {
        success: true,
        status: 200,
        message: "Received friend requests fetched successfully",
        requests: receivedRequests,
    };
}


export const getSentFriendRequests = async (userId: string) => {
    const requests = await FriendRequest.find({
        sender: userId,
        status: "pending",
    }).populate("receiver", "-password -__v").sort({ createdAt: -1 }).lean();

    const sentRequests = requests.map((request: any) => ({
        requestId: request._id,
        status: request.status,
        createdAt: request.createdAt,
        user: request.receiver,
    }));

    return {
        success: true,
        status: 200,
        message: "Sent friend requests fetched successfully",
        requests: sentRequests,
    };
};



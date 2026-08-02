import FriendRequest from '@/models/FriendRequest'
import Friend from '@/models/Friend';


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
        .populate("sender", "name email")
        .populate("receiver", "name email");

    if (!request) throw new Error("Request not found");
    return request;
};

// has route
export const acceptFriendRequest = async ( requestId: string, userId: string) => {
  
  const request = await FriendRequest.findById(requestId);
  if (!request) {
    throw new Error("Friend request not found");
  }
  if (request.receiver.toString() !== userId) {
    throw new Error("You are not allowed to accept this request");
  }
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
  });

  if (existingFriend) {
    throw new Error("Users are already friends");
  }

  // Update request status
  request.status = "accepted";
  request.respondedAt = new Date();
  await request.save();

  // Create friendship
  const friendship = await Friend.create({
    user1: request.sender,
    user2: request.receiver,
    createdByRequest: request._id,
  });

  return {
    success: true,
    status: 200,
    message: "Friend request accepted successfully",
    friend: friendship,
  };
};

// has route
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

// has route
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

    //  delete request
    await FriendRequest.findByIdAndDelete(requestId);

    return { message: "Friend request cancelled successfully" };
};

// has route
export const getAllFriendRequest = async (userId: string) => {
    const requests = await FriendRequest.find({
        receiver: userId,
        status: "pending",
    })
        .populate("sender", "-password -__v")
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

// has route
export const getSentFriendRequests = async (userId: string) => {
    const requests = await FriendRequest.find({
        sender: userId,
        status: "pending",
    })
        .populate("receiver", "-password -__v")
        .sort({ createdAt: -1 })
        .lean();

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



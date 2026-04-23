import User from '@/models/User'
import FriendRequest from '@/models/FriendRequest'



export const sendFriendRequest = async (senderId: string, receiverId: string) => {
    if (senderId === receiverId) {
        throw new Error("You cannot send request to yourself");
    }

    //  already friends?
    const sender = await User.findById(senderId);
    if (sender?.contacts.includes(receiverId)) {
        throw new Error("Already friends");
    }

    //  duplicate request?
    const existing = await FriendRequest.findOne({
        sender: senderId,
        receiver: receiverId,
        status: "pending",
    });

    if (existing) {
        throw new Error("Request already sent");
    }

    //  reverse request check (auto accept)
    const reverse = await FriendRequest.findOne({
        sender: receiverId,
        receiver: senderId,
        status: "pending",
    });

    if (reverse) {
        return await acceptFriendRequest(reverse._id.toString());
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



export const getAllFriendRequest = async (userId: string) => {
    return await FriendRequest.find({receiver: userId, status: "pending",}).populate("sender", "name email avatar").sort({ createdAt: -1 });
};



export const acceptFriendRequest = async (requestId: string, userId: string) => {
    const request = await FriendRequest.findById(requestId);

    if (!request) throw new Error("Friend request not found");

    if (request.receiver.toString() !== userId) {
        throw new Error("You are not allowed to accept this request");
    }


    if (request.status !== "pending") {
        throw new Error("Request already handled");
    }

    request.status = "accepted";
    await request.save();

    //    add both users to contacts
    await User.findByIdAndUpdate(request.sender, {
        $addToSet: { contacts: request.receiver },
    });

    await User.findByIdAndUpdate(request.receiver, {
        $addToSet: { contacts: request.sender },
    });

    return request;
};



export const rejectFriendRequest = async ( requestId: string, userId: string) => {
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
  
  //  delete request
  await FriendRequest.findByIdAndDelete(requestId);

  return { message: "Friend request cancelled successfully" };
};
import Chat from "@/models/Chat";
import "@/models/Message";

//       create or get a chat between two users 1-1 

export const accessChat = async (userId: string, targetUserId: string) => {
    if (!targetUserId) {
        throw new Error("Target userId is required");
    }

    if (userId === targetUserId) {
        throw new Error("You cannot create a chat with yourself.");
    }

    // Find existing private chat
    let chat = await Chat.findOne({
        type: "private",
        participants: {
            $all: [userId, targetUserId],
            $size: 2,
        },
    })
        .populate("participants", "-password")
        .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: "name username avatar",
            },
        });

    if (chat) {
        return chat;
    }

    // Create new private chat
    const newChat = await Chat.create({
        type: "private",
        participants: [userId, targetUserId],
        createdBy: userId,
    });

    chat = await Chat.findById(newChat._id)
        .populate("participants", "-password")
        .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: "name username avatar",
            },
        });

    return chat;
};



export const getChatById = async (chatId: string, userId: string) => {
    if (!chatId || !userId) {
        throw new Error("chatId and userId are required");
    }

    const chat = await Chat.findOne({
        _id: chatId,
        participants: userId,
    }).populate(
            "participants",
            "name username avatar isOnline lastSeen"
        )
        .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: "name username avatar",
            },
        });

    if (!chat) {
        throw new Error("Chat not found or access denied");
    }

    const response: any = {
        _id: chat._id,
        type: chat.type,
        lastMessage: chat.lastMessage,
    };

    if (chat.type === "private") {
        const receiverDoc = chat.participants.find(
            (participant: any) =>
                String(participant._id) !== String(userId)
        );

        if (!receiverDoc) {
            throw new Error("Receiver not found");
        }

        const receiver = receiverDoc.toObject
            ? receiverDoc.toObject()
            : receiverDoc;

        response.receiver = {
            _id: String(receiver._id),
            name: receiver.name ?? "",
            username: receiver.username ?? "",
            avatar: receiver.avatar ?? "",
            isOnline: receiver.isOnline ?? false,
            lastSeen: receiver.lastSeen ?? null,
        };

        console.log("Receiver:", response.receiver);
    } else {
        response.name = chat.name;
        response.avatar = chat.avatar;
        response.admins = chat.admins;
        response.participants = chat.participants;
    }

    return response;
};


//        2. Create Group Chat

export const createGroupChat = async (data: { name: string; users: string[]; adminId: string }) => {
    const { name, users, adminId } = data;

    if (!name || !users || users.length < 2) {
        throw new Error("Group must have at least 3 users");
    }

    const groupChat = await Chat.create({
        chatName: name,
        users: [...users, adminId],
        isGroupChat: true,
        groupAdmin: adminId,
    });

    return await Chat.findById(groupChat._id)
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

}



//       3. Get all chats of a user
export const getUserChats = async (userId: string) => {
    const chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

    return chats;
}



//       4. Rename Group Chat

export const renameGroup = async (chatId: string, newName: string) => {
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName: newName },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) {
        throw new Error("Chat not found");
    }

    return updatedChat;
}


//       5. Add user to group chat

export const addToGroup = async (chatId: string, userId: string) => {
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }                     // this means that the updated document will be returned
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) {
        throw new Error("Chat not found");
    }

    return updatedChat;
}


//       6. Remove user from group chat

export const removeUserFromGroup = async (chatId: string, userId: string) => {
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) {
        throw new Error("Chat not found");
    }

    return updatedChat;
}
import Chat from "@/models/Chat";
import User from "@/models/User";


//       create or get a chat between two users 1-1 

export const accessChat = async (userId: string, targetUserId: string) => {
    if (!targetUserId) {
        throw new Error("Target userId is required");
    }

    // 1. Check existing chat
    let chat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [userId, targetUserId] },
    })
        .populate("users", "-password")
        .populate("latestMessage");

    if (chat) {
        return chat;
    }

    // 2. Create new chat
    const newChat = await Chat.create({
        chatName: "private",
        isGroupChat: false,
        users: [userId, targetUserId],
    });

    // 3. Return populated chat
    chat = await Chat.findById(newChat._id).populate("users", "-password");

    return chat;
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
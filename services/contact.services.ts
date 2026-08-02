import User from "../models/User";
import Chat from "../models/Chat";


export const getAllUsers = async (userId: string) => {
    const users = await User.find(
        { _id: { $ne: userId } },
        "-password"
    ).lean();

    return users.map((user: any) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    }));
};



export const getUserById = async (userId: string) => {
    const user = await User.findById(userId, "-password");
    if (!user) {
        return null;
    }
    return user;
};


export const getYourContacts = async (userId: string) => {
    const chats = await Chat.find({
        users: { $in: [userId] }
    }).populate("users", "-password").lean();

    return chats.map((chat: any) => ({
        id: chat._id.toString(),
        users: chat.users.map((user: any) => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        })),
    }));
};


export const addToYourContacts = async (userId: string, contactId: string) => {

    const user = await User.findById(userId);
    const contact = await User.findById(contactId);

    if (!user || !contact) {
        throw new Error("User not found");
    }
    if (user.contacts.includes(contactId)) {
        throw new Error("Already in contacts");
    }

    user.contacts.push(contactId);
    await user.save();
    return user.contacts;
};


export const deleteFromYourContact = async (userId: string, contactId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (!user.contacts.includes(contactId)) {
        throw new Error("Not in contacts");
    }
    user.contacts = user.contacts.filter((id) => id !== contactId);
    await user.save();
    return user.contacts;
};




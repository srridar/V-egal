
import Message from "@/models/Message";
import Chat from "@/models/Chat";
import { uploadFile } from "@/lib/upload";
import User from "@/models/User";


//  1.                    Send Message (TEXT / FILE)

export const sendMessage = async (data: { chatId: string, senderId: string, content?: string, file?: string, fileName?: string, messageType: "text" | "image" | "file" | "audio" | "video"; }) => {

    const { chatId, senderId, content, file, fileName, messageType } = data;

    if (!chatId || !senderId) {
        throw new Error("chatId and senderId required");
    }

    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    if (!chat.participants.includes(senderId)) {
        throw new Error("You are not part of this chat");
    }


    let fileData: any = {};

    //  upload file if exists 

    if (file) {

        if (!["image", "file", "audio", "video"].includes(messageType)) {
            throw new Error("Invalid file type");
        }

        const uploadRes = await uploadFile(file, messageType);
        fileData = {
            fileUrl: uploadRes.url,
            fileName,
            fileSize: uploadRes.bytes,
        };
    }

    const message = await Message.create({
        chat: chatId,
        sender: senderId,
        content: content || "",
        messageType,
        ...fileData,
    });


    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: message._id,
    });

    const populatedMessage = await Message.findById(message._id)
        .populate("sender", "-password")
        .populate("chat");


    return populatedMessage;
};




//    2. Get all messages for a chat

export const getMessages = async (chatId: string, userId: string) => {
    if (!chatId) throw new Error("chatId required");

    const messages = await Message.find({ chat: chatId, deletedFor: { $ne: userId }}).populate("sender", "-password").sort({ createdAt: 1 });

    return messages;
};



//    3. Mark Messages as Seen


export const markMessagesAsSeen = async (chatId: string, userId: string) => {
    await Message.updateMany(
        {
            chat: chatId,
            sender: { $ne: userId },
            seenBy: { $ne: userId }, 
        },
        {
            $addToSet: { seenBy: userId },
        }
    );
    return { success: true };
};



//            4. Delete Message (for everyone)
export const deleteMessageForEveryone = async (messageId: string, userId: string) => {
    const message = await Message.findById(messageId);

    if (!message) throw new Error("Message not found");

    if (message.sender.toString() !== userId) {
        throw new Error("Not authorized");
    }

    const chatId = message.chat;

    await Message.findByIdAndDelete(messageId);

    //               fix latest message if needed
    const lastMessage = await Message.findOne({ chat: chatId }).sort({ createdAt: -1 });

    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: lastMessage?._id || null,
    });

    return { success: true };
};



//           5. Delete Message (for me)
export const deleteMessageForMe = async (
    messageId: string,
    userId: string
) => {
    const message = await Message.findById(messageId);

    if (!message) throw new Error("Message not found");

    await Message.findByIdAndUpdate(messageId, {
        $addToSet: { deletedFor: userId },
    });

    return { success: true };
};



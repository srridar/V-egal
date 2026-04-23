export interface IMessage {
  _id: string;
  chat: string; // chat ID
  sender: string; // user ID
  content?: string;
  messageType: "text" | "image" | "file" | "audio" | "video";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  seenBy?: string[];
  deliveredTo?: string[];
  isEdited?: boolean;
  editedAt?: Date;
  replyTo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
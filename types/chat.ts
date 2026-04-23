export interface IChat {
  _id: string;

  chatName: string;

  isGroupChat: boolean;

  users: string[]; // user IDs

  groupAdmin?: string;

  latestMessage?: string;

  groupDescription?: string;

  groupImage?: string;

  pinnedMessage?: string;

  mutedUsers?: string[];

  deletedFor?: string[];

  isArchived: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
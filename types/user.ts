export interface IUser {
  _id: string;

  name: string;
  email: string;
  password?: string;

  avatar?: string;

  bio?: string;

  isOnline: boolean;

  lastSeen?: Date;

  blockedUsers?: string[];

  createdAt?: Date;
  updatedAt?: Date;
}
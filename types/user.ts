export interface IUser {
  id: string;
  username: string;
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



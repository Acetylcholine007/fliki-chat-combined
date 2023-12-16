import { z } from 'zod';
import { IUser } from '../../auth/models/auth.models';

export interface IChat {
  _id: string;
  message: string;
  sender: IUser;
  chatGroup: string | IChatGroup;
  isAnnouncement: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatGroup {
  _id: string;
  name: string;
  creator: IUser | string;
  participants?: IUser[];
  chats?: IChat[];
  createdAt: Date;
  updatedAt: Date;
}

export const LiteUserSchema: z.ZodType<IUser> = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const ChatSchema: z.ZodType<IChat> = z.object({
  _id: z.string(),
  message: z.string(),
  sender: LiteUserSchema,
  chatGroup: z.string(),
  isAnnouncement: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const ChatGroupSchema: z.ZodType<IChatGroup> = z.object({
  _id: z.string(),
  name: z.string(),
  creator: z.union([z.string(), LiteUserSchema]),
  participants: z.array(LiteUserSchema).optional(),
  chats: z.array(ChatSchema).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

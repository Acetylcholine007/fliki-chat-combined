import { z } from 'zod';
import { ChatGroupSchema, IChatGroup } from '../../chat/models/chat.models';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  chatGroups?: (IChatGroup | string | null)[];
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema: z.ZodType<IUser> = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  chatGroups: z.array(z.union([z.string(), ChatGroupSchema, z.null()])),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

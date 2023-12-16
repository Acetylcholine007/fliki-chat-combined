import { IUser } from '../../features/auth/models/auth.models';
import { IChat, IChatGroup } from '../../features/chat/models/chat.models';

export interface IUserState {
  user?: IUser;
}

export interface IChatGroupState {
  myChatGroups: IChatGroup[];
  externalChatGroups: IChatGroup[];
}

export interface IChatState {
  selectedChatGroup: IChatGroup | null;
  chats: IChat[];
}

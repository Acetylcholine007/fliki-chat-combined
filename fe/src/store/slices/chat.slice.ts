import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IChatState } from '../../data/models/slice.models';
import { IChat, IChatGroup } from '../../features/chat/models/chat.models';
import { IUser } from '../../features/auth/models/auth.models';
import { joinCreateChatGroup } from './chat-group.slice';

const initialState: IChatState = {
  chats: [],
  selectedChatGroup: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedChatGroup: (state, action: PayloadAction<IChatGroup>) => {
      state.selectedChatGroup = action.payload;
      state.chats = action.payload.chats as IChat[];
    },
    //TODO: update palcement either from start or end
    addChat: (state, action: PayloadAction<IChat>) => {
      state.chats.unshift(action.payload);
    },
    deleteChat: (state, action: PayloadAction<IChat>) => {
      state.chats = state.chats.filter(
        (chat) => chat._id !== action.payload._id
      );
    },
    //TODO: update palcement either from start or end
    appendChats: (state, action: PayloadAction<IChat[]>) => {
      state.chats.concat(action.payload);
    },
    addParticipant: (state, action: PayloadAction<IUser>) => {
      state.selectedChatGroup?.participants?.push(action.payload);
    },
    removeParticipant: (state, action: PayloadAction<string>) => {
      if (state.selectedChatGroup)
        state.selectedChatGroup.participants =
          state.selectedChatGroup?.participants?.filter((user) => {
            if (typeof user === 'string') return user !== action.payload;
            else return user._id !== action.payload;
          });
    },
    resetState: (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(joinCreateChatGroup, (state, action) => {
      state.selectedChatGroup = action.payload;
    });
  },
});

export const {
  setSelectedChatGroup,
  addChat,
  appendChats,
  addParticipant,
  removeParticipant,
  resetState,
  deleteChat,
} = chatSlice.actions;

export default chatSlice;

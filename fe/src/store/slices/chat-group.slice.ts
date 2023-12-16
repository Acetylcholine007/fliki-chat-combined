import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IChatGroupState } from '../../data/models/slice.models';
import { IChatGroup } from '../../features/chat/models/chat.models';
import { setUser } from './user.slice';

const initialState: IChatGroupState = {
  myChatGroups: [],
  externalChatGroups: [],
};

export const chatGroupSlice = createSlice({
  name: 'chatGroup',
  initialState,
  reducers: {
    setMyChatGroups: (state, action: PayloadAction<IChatGroup[]>) => {
      state.myChatGroups = action.payload;
    },
    setExternalChatGroups: (state, action: PayloadAction<IChatGroup[]>) => {
      state.externalChatGroups = action.payload;
    },
    joinCreateChatGroup: (state, action: PayloadAction<IChatGroup>) => {
      state.externalChatGroups = state.externalChatGroups.filter(
        (chatGroup) => chatGroup._id !== action.payload._id
      );
      state.myChatGroups.unshift(action.payload);
    },
    leaveChatGroup: (state, action: PayloadAction<IChatGroup>) => {
      state.myChatGroups = state.myChatGroups.filter((chatGroup) => {
        return chatGroup._id !== action.payload._id;
      });
      state.externalChatGroups.push(action.payload);
    },
    updateMyChatGroup: (state, action: PayloadAction<IChatGroup>) => {
      const chatGroupIndex = state.myChatGroups.findIndex(
        (chatGroup) => chatGroup._id == action.payload._id
      );
      if (chatGroupIndex === -1) return;

      const chatGroup = state.myChatGroups.splice(chatGroupIndex, 1)[0];
      chatGroup.chats = action.payload.chats;
      state.myChatGroups.unshift(chatGroup);
    },
    addExternalChatGroup: (state, action: PayloadAction<IChatGroup>) => {
      state.externalChatGroups.unshift(action.payload);
    },
    appendExternalChatGroups: (state, action: PayloadAction<IChatGroup[]>) => {
      state.externalChatGroups = state.externalChatGroups.concat(
        action.payload
      );
    },
    removeChatGroup: (state, action: PayloadAction<string>) => {
      state.externalChatGroups = state.externalChatGroups.filter(
        (chatGroup) => chatGroup._id !== action.payload
      );
      state.myChatGroups = state.myChatGroups.filter(
        (chatGroup) => chatGroup._id !== action.payload
      );
    },
    resetState: (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setUser, (state, action) => {
      state.myChatGroups = action.payload.chatGroups?.filter(
        (item) => item != null
      ) as IChatGroup[];
    });
  },
});

export const {
  addExternalChatGroup,
  appendExternalChatGroups,
  joinCreateChatGroup,
  leaveChatGroup,
  removeChatGroup,
  resetState,
  setExternalChatGroups,
  setMyChatGroups,
  updateMyChatGroup,
} = chatGroupSlice.actions;

export default chatGroupSlice;

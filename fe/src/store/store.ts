import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/user.slice';
import chatSlice from './slices/chat.slice';
import chatGroupSlice from './slices/chat-group.slice';

export const store = configureStore({
  reducer: {
    [userSlice.name]: userSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [chatGroupSlice.name]: chatGroupSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

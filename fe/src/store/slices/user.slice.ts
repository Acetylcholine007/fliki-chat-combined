import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IUserState } from '../../data/models/slice.models';
import { IUser } from '../../features/auth/models/auth.models';

const initialState: IUserState = {};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = undefined;
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, signOut } = userSlice.actions;

export default userSlice;

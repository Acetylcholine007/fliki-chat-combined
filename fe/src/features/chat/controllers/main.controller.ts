import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useCurrentPath from '../../../common/hooks/current-path.hook';
import { useNavigate } from 'react-router-dom';
import useAppSelector from '../../../common/hooks/app-selector.hook';
import useAppDispatch from '../../../common/hooks/app-dispatch.hook';
import { getUserData } from '../../auth/services/auth.service';
import { setUser } from '../../../store/slices/user.slice';
import { ChatGroupSchema, ChatSchema } from '../models/chat.models';
import {
  addExternalChatGroup,
  removeChatGroup,
  updateMyChatGroup,
} from '../../../store/slices/chat-group.slice';
import { addChat, deleteChat } from '../../../store/slices/chat.slice';
import { toast } from 'react-toastify';

export default function useMain() {
  const [socket, setSocket] = useState<ReturnType<typeof io>>();
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAppSelector((store) => store.user);
  const [loading, setLoading] = useState(false);
  const location = useCurrentPath();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = await getUserData();
        dispatch(setUser(user));
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/sign-in');
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    const ioInstance = io(import.meta.env.VITE_API_URL, {
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    ioInstance.on('connect', () => {
      setIsConnected(true);
    });

    ioInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    ioInstance.on('connect_error', () => {
      setTimeout(() => ioInstance.connect(), 5000);
    });

    ioInstance.on('create-msg', (data) => {
      const chat = ChatSchema.parse(data);
      if (chat.sender._id !== user._id) dispatch(addChat(chat));
    });

    ioInstance.on('delete-msg', (data) => {
      const chat = ChatSchema.parse(data);
      if (chat.sender._id !== user._id) dispatch(deleteChat(chat));
    });

    ioInstance.on('create-group', (data: unknown) => {
      const chatGroup = ChatGroupSchema.parse(data);
      if (chatGroup.creator !== user._id)
        dispatch(addExternalChatGroup(chatGroup));
    });

    ioInstance.on('update-group', (data: unknown) => {
      const chatGroup = ChatGroupSchema.parse(data);
      dispatch(updateMyChatGroup(chatGroup));
    });

    ioInstance.on('delete-group', (data: unknown) => {
      const chatGroup = ChatGroupSchema.parse(data);
      dispatch(removeChatGroup(chatGroup._id));
      toast.info(`Chat group ${chatGroup.name} was deleted`);
      navigate('/');
    });

    setSocket(ioInstance);

    return () => {
      ioInstance.disconnect();
    };
  }, [user]);

  return { loading, socket, isConnected, location, navigate };
}

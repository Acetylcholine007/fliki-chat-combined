import { useCallback, useRef, useState } from 'react';
import useAppDispatch from '../../../common/hooks/app-dispatch.hook';
import useAppSelector from '../../../common/hooks/app-selector.hook';
import { useNavigate } from 'react-router-dom';
import * as ChatService from '../services/chat.service';
import { addChat } from '../../../store/slices/chat.slice';

export default function useChat() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const sendChatFormRef = useRef<HTMLFormElement>(null);
  const { selectedChatGroup, chats } = useAppSelector((store) => store.chat);
  const { user } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const sendChatHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        setLoading(true);
        setError(undefined);
        const formData = new FormData(e.currentTarget);
        const parsedJson = {
          message: formData.get('message')!.toString(),
        };

        const chat = await ChatService.createChat(
          parsedJson.message,
          selectedChatGroup!._id
        );
        dispatch(addChat(chat));
        sendChatFormRef.current?.reset();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          return;
        }
        setError('Unknown error occurred!');
      } finally {
        setLoading(false);
      }
    },
    [dispatch, selectedChatGroup]
  );

  const resetHandler = useCallback(() => {
    sendChatFormRef.current?.reset();
    setError(undefined);
  }, []);

  return {
    resetHandler,
    sendChatHandler,
    setLoading,
    selectedChatGroup,
    sendChatFormRef,
    loading,
    error,
    dispatch,
    navigate,
    chats,
    user,
  };
}

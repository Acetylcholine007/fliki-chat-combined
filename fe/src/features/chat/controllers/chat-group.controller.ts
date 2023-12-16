import { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { signOut } from '../../../store/slices/user.slice';
import useAppSelector from '../../../common/hooks/app-selector.hook';
import * as ChatGroupService from '../services/chat-group.service';
import {
  joinCreateChatGroup,
  leaveChatGroup,
  removeChatGroup,
  updateMyChatGroup,
} from '../../../store/slices/chat-group.slice';
import { toast } from 'react-toastify';

export default function useChatGroup() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const createGroupFormRef = useRef<HTMLFormElement>(null);
  const updateGroupFormRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myChatGroups, externalChatGroups } = useAppSelector(
    (store) => store.chatGroup
  );
  const { selectedChatGroup } = useAppSelector((store) => store.chat);
  const { user } = useAppSelector((store) => store.user);
  const { chatGroupId } = useParams();

  const toggleCreateGroupModal = useCallback(() => {
    setShowCreateGroupModal(!showCreateGroupModal);
  }, [showCreateGroupModal]);

  const signOutHandler = useCallback(() => {
    dispatch(signOut());
    navigate('/sign-in');
  }, [dispatch, navigate]);

  const createChatGroupHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        setLoading(true);
        setError(undefined);
        const formData = new FormData(e.currentTarget);
        const parsedJson = {
          name: formData.get('name')!.toString(),
        };

        const chatGroup = await ChatGroupService.createChatGroup(
          parsedJson.name
        );
        dispatch(joinCreateChatGroup(chatGroup));
        setShowCreateGroupModal(false);
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
    [dispatch]
  );

  const updateChatGroupHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        setLoading(true);
        setError(undefined);
        const formData = new FormData(e.currentTarget);
        const parsedJson = {
          name: formData.get('name')!.toString(),
        };

        if (selectedChatGroup == null) throw new Error('Missing chat group ID');

        const chatGroup = await ChatGroupService.updateChatGroup(
          parsedJson.name,
          selectedChatGroup._id
        );
        dispatch(updateMyChatGroup(chatGroup));
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

  const deleteChatGroupHandler = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      if (selectedChatGroup == null) throw new Error('Missing chat group ID');

      const chatGroup = await ChatGroupService.deleteChatGroup(
        selectedChatGroup._id
      );
      dispatch(removeChatGroup(chatGroup._id));
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError('Unknown error occurred!');
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate, selectedChatGroup]);

  const resetHandler = useCallback(() => {
    createGroupFormRef.current?.reset();
    updateGroupFormRef.current?.reset();
    setError(undefined);
  }, []);

  const joinChatGroupHandler = useCallback(
    async (chatGroupId: string) => {
      try {
        setLoading(true);
        const chatGroup = await ChatGroupService.joinChatGroup(chatGroupId);
        dispatch(joinCreateChatGroup(chatGroup));
        navigate(`/${chatGroupId}`);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
          return;
        }
        toast.error('Unknown error occurred');
      } finally {
        setLoading(false);
      }
    },
    [dispatch, navigate]
  );

  const leaveChatGroupHandler = useCallback(
    async (chatGroupId: string) => {
      try {
        setLoading(true);
        const chatGroup = await ChatGroupService.leaveChatGroup(chatGroupId);
        dispatch(leaveChatGroup(chatGroup));
        toast.success("You've left the chat group");
        navigate(`/`);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
          return;
        }
        toast.error('Unknown error occurred');
      } finally {
        setLoading(false);
      }
    },
    [dispatch, navigate]
  );

  return {
    resetHandler,
    createChatGroupHandler,
    updateChatGroupHandler,
    deleteChatGroupHandler,
    toggleCreateGroupModal,
    joinChatGroupHandler,
    leaveChatGroupHandler,
    signOutHandler,
    setLoading,
    dispatch,
    navigate,
    chatGroupId,
    myChatGroups,
    externalChatGroups,
    showCreateGroupModal,
    selectedChatGroup,
    createGroupFormRef,
    updateGroupFormRef,
    loading,
    error,
    user,
  };
}

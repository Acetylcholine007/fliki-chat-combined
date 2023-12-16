import { Avatar, Divider, Input, Loading, Tooltip } from 'react-daisyui';
import { Socket } from 'socket.io-client';
import useChat from '../controllers/chat.controller';
import ChatItem from './chat-item.component';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import * as ChatGroupService from '../services/chat-group.service';
import { setSelectedChatGroup } from '../../../store/slices/chat.slice';
import { stringToRandomHueHex } from '../../../common/utils/color.utils';
import { useParams } from 'react-router-dom';
import useChatGroup from '../controllers/chat-group.controller';
import useMediaQuery from '../../../common/hooks/media-query.hook';

export interface ChatListProps {
  isConnected: boolean;
  socket: Socket;
}

const ChatList: React.FC = () => {
  const {
    navigate,
    dispatch,
    selectedChatGroup,
    setLoading,
    sendChatFormRef,
    sendChatHandler,
    error,
    loading,
    chats,
    user,
  } = useChat();
  const {
    deleteChatGroupHandler,
    leaveChatGroupHandler,
    loading: chatGroupLoading,
  } = useChatGroup();
  const { chatGroupId } = useParams();
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    const fetchChatGroup = async () => {
      try {
        setLoading(true);
        if (!selectedChatGroup) {
          navigate('/');
          return;
        }
        const chatGroup = await ChatGroupService.getChatGroup(
          selectedChatGroup._id
        );
        dispatch(setSelectedChatGroup(chatGroup));
      } catch (err) {
        if (err instanceof Error) toast.error(err.message);
        else toast.error('Failed to fetch external chat groups');
      } finally {
        setLoading(false);
      }
    };

    fetchChatGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatGroupId]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="flex grow flex-col border-slate-500 sm:border-x-[1px]">
      <div className="flex w-full items-center gap-2 bg-slate-900 px-4 py-2 text-lg font-medium shadow-md">
        {isMobile && (
          <button
            className="rounded-full p-2 hover:bg-slate-400/20"
            onClick={() => navigate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </button>
        )}
        <Avatar
          className="rounded-full bg-slate-500"
          size="xs"
          children={<p>{selectedChatGroup?.name[0]}</p>}
          style={{
            backgroundColor: stringToRandomHueHex(
              selectedChatGroup?.name ?? ''
            ),
          }}
        />
        <div className="flex grow flex-col">
          <h2 className="grow">{selectedChatGroup?.name}</h2>
          <p
            className={`${isMobile ? 'cursor-pointer underline' : ''} text-xs`}
            onClick={
              isMobile
                ? () => navigate(`/participants/${chatGroupId}`)
                : undefined
            }
          >{`${selectedChatGroup?.participants?.length ?? 0} Members`}</p>
        </div>
        {chatGroupLoading && <Loading />}
        {!chatGroupLoading && selectedChatGroup?.creator === user?._id && (
          <Tooltip message="Delete Group" position="bottom">
            <button
              className="rounded-full p-2 hover:bg-slate-400/20"
              onClick={deleteChatGroupHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </Tooltip>
        )}
        {!chatGroupLoading && selectedChatGroup?.creator !== user?._id && (
          <Tooltip message="Leave Group" position="bottom">
            <button
              className="rounded-full p-2 hover:bg-slate-400/20"
              onClick={() => leaveChatGroupHandler(selectedChatGroup!._id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Tooltip>
        )}
      </div>
      <div className="flex grow flex-col-reverse overflow-y-auto p-4">
        {chats.map((item) =>
          item.isAnnouncement ? (
            <Divider key={item._id}>{item.message}</Divider>
          ) : (
            <ChatItem key={item._id} userId={user?._id} chat={item} />
          )
        )}
      </div>
      <form
        ref={sendChatFormRef}
        onSubmit={sendChatHandler}
        className="flex gap-2 border-t-[1px] border-slate-600 p-2"
      >
        <Input className="w-full" name="message" />
        {loading ? (
          <Loading />
        ) : (
          <button
            className="flex w-12 items-center justify-center rounded-full p-[0.4rem] hover:bg-slate-400/20"
            type="submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        )}
      </form>
    </div>
  );
};

export default ChatList;

import { Socket } from 'socket.io-client';
import ListTile from '../../../common/widgets/list-tile.component';
import CreateGroupModal from './create-group-modal.component';
import useChatGroup from '../controllers/chat-group.controller';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import * as ChatGroupService from '../services/chat-group.service';
import { setExternalChatGroups } from '../../../store/slices/chat-group.slice';
import { setSelectedChatGroup } from '../../../store/slices/chat.slice';
import moment from 'moment';
import { Avatar, Tooltip } from 'react-daisyui';
import { stringToRandomHueHex } from '../../../common/utils/color.utils';

export interface ChatGroupListProps {
  isConnected: boolean;
  socket: Socket;
}

const ChatGroupList: React.FC<ChatGroupListProps> = () => {
  const {
    loading,
    error,
    showCreateGroupModal,
    myChatGroups,
    selectedChatGroup,
    externalChatGroups,
    chatGroupId,
    user,
    setLoading,
    dispatch,
    toggleCreateGroupModal,
    createChatGroupHandler,
    signOutHandler,
    navigate,
  } = useChatGroup();

  useEffect(() => {
    const fetchExternalChatGroups = async () => {
      try {
        setLoading(true);
        const chatGroups = await ChatGroupService.getExternalChatGroups();
        dispatch(setExternalChatGroups(chatGroups));
      } catch (err) {
        if (err instanceof Error) toast.error(err.message);
        else toast.error('Failed to fetch external chat groups');
      } finally {
        setLoading(false);
      }
    };

    fetchExternalChatGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full basis-full flex-col sm:basis-1/5">
      <div className="flex h-1/2 flex-col">
        <h2 className="bg-slate-900 p-4 text-lg font-medium shadow-md">
          Other Groups
        </h2>
        <div className="flex grow flex-col overflow-y-auto">
          {externalChatGroups.map((item) => (
            <ListTile
              key={item._id}
              title={item.name}
              avatarName={item.name}
              active={chatGroupId === item._id}
              subtitle={`Created ${moment(item.createdAt).fromNow()}`}
              onClick={() => navigate(`/join/${item._id}`)}
            />
          ))}
        </div>
      </div>
      <div className="flex h-1/2 flex-col">
        <div className="flex items-center  gap-2 bg-slate-900 px-4 py-2 text-lg font-medium shadow-md">
          <h2 className="grow">My Groups</h2>
          <Tooltip message="Create Chat Group">
            <button
              className="rounded-full p-2 hover:bg-slate-400/20"
              onClick={toggleCreateGroupModal}
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
          </Tooltip>
        </div>
        <div className="flex grow flex-col overflow-y-auto">
          {myChatGroups.map((item) => (
            <ListTile
              key={item._id}
              title={item.name}
              avatarName={item.name}
              active={selectedChatGroup?._id === item._id}
              subtitle={
                !item.chats?.length
                  ? `Created ${moment(item.createdAt).fromNow()}`
                  : item.chats[0].isAnnouncement
                    ? item.chats[0].message
                    : `${
                        item.chats[0].sender._id === user?._id
                          ? 'You'
                          : item.chats[0].sender.name
                      }: ${item.chats[0].message}`
              }
              onClick={() => {
                if (selectedChatGroup?._id !== item._id)
                  dispatch(setSelectedChatGroup(item));
                navigate(`/${item._id}`);
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 bg-indigo-500 p-2 text-slate-300">
        <Avatar
          size="xs"
          className="rounded-full bg-slate-500 font-medium"
          style={{ backgroundColor: stringToRandomHueHex(user?.name ?? '') }}
          children={<h1>{user?.name[0]}</h1>}
        />
        <div className="flex grow flex-col items-start gap-1">
          <h6 className="truncate">{user?.name}</h6>
          <p className="truncate text-xs">{user?.email}</p>
        </div>
        <Tooltip message="Sign out">
          <button
            className="rounded-full p-2 hover:bg-slate-400/20"
            onClick={signOutHandler}
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
      </div>
      <CreateGroupModal
        loading={loading}
        error={error}
        showModal={showCreateGroupModal}
        onClose={toggleCreateGroupModal}
        submitHandler={createChatGroupHandler}
      />
    </div>
  );
};

export default ChatGroupList;

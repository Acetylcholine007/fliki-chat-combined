import { Loading } from 'react-daisyui';
import ChatGroupList from '../features/chat/components/chat-group-list.component';
import ParticipantsList, {
  ParticipantsListProps,
} from '../features/chat/components/participants-list.component';
import useMain from '../features/chat/controllers/main.controller';
import { Outlet, useOutletContext } from 'react-router-dom';
import { ChatListProps } from '../features/chat/components/chat-list.component';
import { JoinPromptProps } from '../features/chat/components/join-prompt.component';
import { useMemo } from 'react';
import useChatGroup from '../features/chat/controllers/chat-group.controller';
import useMediaQuery from '../common/hooks/media-query.hook';
import useCurrentPath from '../common/hooks/current-path.hook';

export interface MainPageProps {}

const MainPage: React.FC<MainPageProps> = () => {
  const { isConnected, loading, socket, location, navigate } = useMain();
  const { joinChatGroupHandler, loading: chatGroupLoading } = useChatGroup();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const currentPath = useCurrentPath();

  const currentContext = useMemo(() => {
    switch (location) {
      case '/join/:chatGroupId':
        return {
          onAccept: joinChatGroupHandler,
          onCancel: () => navigate(-1),
          loading: chatGroupLoading,
        };
      case '/:chatGroupId':
        return { isConnected, socket };
      case '/participants/:chatGroupId':
        return { isConnected, socket };
      default:
        return {};
    }
  }, [
    socket,
    location,
    isConnected,
    chatGroupLoading,
    navigate,
    joinChatGroupHandler,
  ]);

  if (socket == null || loading)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <Loading size="lg" />
        <p>Connecting to server...</p>
      </div>
    );

  return (
    <div className="flex h-full w-full">
      {!(
        isMobile &&
        (currentPath === '/join/:chatGroupId' ||
          currentPath === '/:chatGroupId')
      ) && <ChatGroupList isConnected={isConnected} socket={socket} />}
      <Outlet context={currentContext} />
      {!isMobile && location === '/:chatGroupId' && <ParticipantsList />}
    </div>
  );
};

export default MainPage;

export function useChatList() {
  return useOutletContext<ChatListProps>();
}

export function useJoinPrompt() {
  return useOutletContext<JoinPromptProps>();
}

export function useParticipantList() {
  return useOutletContext<ParticipantsListProps>();
}

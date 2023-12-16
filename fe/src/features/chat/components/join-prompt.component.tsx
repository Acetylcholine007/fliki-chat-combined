import { Avatar, Button, Loading } from 'react-daisyui';
import { useJoinPrompt } from '../../../pages/main.page';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import useAppSelector from '../../../common/hooks/app-selector.hook';
import { stringToRandomHueHex } from '../../../common/utils/color.utils';

export interface JoinPromptProps {
  onAccept: (chatGroupId: string) => void;
  onCancel: () => void;
  loading: boolean;
}

const JoinPrompt: React.FC = () => {
  const { onAccept, onCancel, loading } = useJoinPrompt();
  const { chatGroupId } = useParams();
  const { externalChatGroups, myChatGroups } = useAppSelector(
    (store) => store.chatGroup
  );
  const navigate = useNavigate();

  const chatGroup = useMemo(() => {
    return externalChatGroups.find((gc) => gc._id === chatGroupId);
  }, [externalChatGroups, chatGroupId]);

  useEffect(() => {
    if (myChatGroups.some((gc) => gc._id === chatGroupId))
      navigate(`/${chatGroupId}`);
  });

  return (
    <div className="flex grow flex-col border-slate-500 sm:border-x-[1px]">
      <div className="flex w-full items-center gap-2 bg-slate-900 px-4 py-3 text-lg font-medium shadow-md">
        <Avatar
          className="rounded-full bg-slate-500"
          size="xs"
          style={{
            backgroundColor: stringToRandomHueHex(chatGroup?.name ?? ''),
          }}
          children={<p>{chatGroup?.name?.[0]}</p>}
        />
        <h2 className="grow">{chatGroup?.name}</h2>
      </div>
      {!chatGroup && (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <Loading size="lg" /> <p>Fetching external chat group...</p>
        </div>
      )}
      {chatGroup && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-8">
          <h2>{`Do you want to join to group ${chatGroup.name}?`}</h2>
          <div className="flex items-center justify-center gap-8">
            <Button
              loading={loading}
              className="w-32"
              color="primary"
              onClick={() => onAccept(chatGroup._id)}
            >
              Join
            </Button>
            <Button
              className="w-32"
              color="secondary"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinPrompt;

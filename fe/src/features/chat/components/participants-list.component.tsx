import { Socket } from 'socket.io-client';
import ListTile from '../../../common/widgets/list-tile.component';
import useAppSelector from '../../../common/hooks/app-selector.hook';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import useMediaQuery from '../../../common/hooks/media-query.hook';

export interface ParticipantsListProps {
  isConnected: boolean;
  socket: Socket;
}

const ParticipantsList: React.FC = () => {
  const { selectedChatGroup } = useAppSelector((store) => store.chat);
  const { chatGroupId } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    if (!selectedChatGroup) navigate(`/${chatGroupId}`);
  });

  return (
    <div className="flex basis-full flex-col sm:basis-1/5">
      <div className="flex w-full items-center bg-slate-900 px-4 py-[0.61rem] text-lg font-medium shadow-md sm:py-4">
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
        <h2 className="bg-slate-900 text-lg font-medium shadow-md">Members</h2>
      </div>
      {selectedChatGroup?.participants && (
        <div className="flex flex-col overflow-y-auto">
          {selectedChatGroup.participants.map((participant) => (
            <ListTile
              key={participant._id}
              title={participant.name}
              subtitle={
                participant._id === selectedChatGroup.creator ? 'Creator' : ''
              }
              avatarName={participant.name}
              // badge={<div className="h-3 w-3 rounded-full bg-green-500" />}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;

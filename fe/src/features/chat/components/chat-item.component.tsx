import { ChatBubble } from 'react-daisyui';
import { IChat } from '../models/chat.models';
import moment from 'moment';
import { stringToRandomHueHex } from '../../../common/utils/color.utils';

export interface ChatItemProps {
  chat: IChat;
  userId?: string;
}

const ChatItem: React.FC<ChatItemProps> = (props) => {
  const { chat, userId } = props;

  return (
    <ChatBubble end={userId === chat.sender._id}>
      <ChatBubble.Header>
        {typeof chat.sender === 'string' ? chat.sender : chat.sender.name}{' '}
        <ChatBubble.Time>{moment(chat.createdAt).fromNow()}</ChatBubble.Time>
      </ChatBubble.Header>
      {userId !== chat.sender._id && (
        <ChatBubble.Avatar
          className="rounded-full bg-slate-500"
          style={{
            backgroundColor: stringToRandomHueHex(
              typeof chat.sender === 'string' ? '?' : chat.sender.name[0]
            ),
          }}
          children={
            <h1>
              {typeof chat.sender === 'string' ? '?' : chat.sender.name[0]}
            </h1>
          }
        />
      )}
      <ChatBubble.Message>{chat.message}</ChatBubble.Message>
    </ChatBubble>
  );
};

export default ChatItem;

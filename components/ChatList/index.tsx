import React, { useCallback, useRef, VFC } from 'react';
import { ChatZone, Section } from '@components/ChatList/styles';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatData?: IDM[];
}
const ChatList: VFC<Props> = ({ chatData }) => {
  return (
    <ChatZone>
      <Scrollbars autoHide>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;

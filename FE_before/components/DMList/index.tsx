import { IDM, IUser, IUserWithOnline } from '@typings/db';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CollapseButton } from '@components/DMList/styles';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { NavLink } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import useSocket from '@hooks/useSocket';

const DMList: FC = () => {
  const { workspace } = useParams<{ workspace?: string }>();
  const {
    data: userData,
    error,
    revalidate,
    mutate,
  } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number }>({});
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  const resetCount = useCallback(() => {
    (id: any) => () => {
      setCountList((list) => {
        return {
          ...list,
          [id]: 0,
        };
      });
    };
  }, []);

  const onMessage = (data: IDM) => {
    setCountList((list) => {
      return {
        ...list,
        [data.SenderId]: list[data.SenderId] ? list[data.SenderId] + 1 : 1,
      };
    });
  };

  useEffect(() => {
    console.log('DMList: workspace 바뀜', workspace);
    setOnlineList([]);
    setCountList({});
  }, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    return () => {
      socket?.off('onlineList');
    };
  }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            //slack html태그 그대로
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Message</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            //slack html 태그 그대로
            return (
              <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
                <i
                  className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                    isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                  }`}
                  aria-hidden="true"
                  data-qa="presence_indicator"
                  data-qa-presence-self="false"
                  data-qa-presence-active="false"
                  data-qa-presence-dnd="false"
                />
                <span>{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default DMList;

import { useCallback } from 'react';
import io from 'socket.io-client';

const backUrl = 'http://localhost:3095'; //현재는 프록시로 인해 상관X

const sockets: { [key: string]: SocketIOClient.Socket } = {};
//workspace-namespace, channel-room
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace]
    }
  },[workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`);

  return [sockets[workspace], disconnect];
};

export default useSocket;
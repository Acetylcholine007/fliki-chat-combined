import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = <
  Channels extends { [index: string]: (message: any) => void },
>(params: {
  url: string;
  path: string;
  channels: Channels;
  disabled?: boolean;
  extraHeaders?: { [index: string]: string };
}): {
  isConnected: boolean;
  transmitters?: Record<
    Exclude<keyof Channels, 'connect' | 'disconnect' | 'connect_error'>,
    (message: any) => void
  >;
} => {
  const [socket, setSocket] = useState<ReturnType<typeof io>>();
  const [isConnected, setIsConnected] = useState(false);
  const { channels, path, url, disabled, extraHeaders } = params;

  useEffect(() => {
    if (!disabled) {
      setSocket(io(url, { path, extraHeaders }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, url]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      setTimeout(() => socket.connect(), 5000);
    });

    Object.entries(channels).forEach(([event, receiveHandler]) =>
      socket.on(event, receiveHandler)
    );

    return () => {
      Object.entries(channels).forEach(([event, receiveHandler]) =>
        socket.off(event, receiveHandler)
      );
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [channels, socket]);

  const transmitters = useMemo(
    () =>
      socket
        ? Object.keys(channels).reduce(
            (a, event: keyof Channels) => {
              a[event] = (message: any) => {
                if (socket) {
                  socket.emit(event as string, message);
                }
              };
              return a;
            },
            {} as Record<keyof Channels, (message: any) => void>
          )
        : undefined,
    [channels, socket]
  );
  return { isConnected, transmitters };
};

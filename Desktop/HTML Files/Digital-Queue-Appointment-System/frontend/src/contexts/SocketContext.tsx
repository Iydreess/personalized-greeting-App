import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinQueue: (queueId: string) => void;
  leaveQueue: (queueId: string) => void;
  joinAdmin: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      const socketInstance = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token,
        },
      });

      socketInstance.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      socketInstance.on('queue-updated', (data) => {
        console.log('Queue updated:', data);
        // Handle queue updates
      });

      socketInstance.on('admin-update', (data) => {
        console.log('Admin update:', data);
        // Handle admin updates
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, token]);

  const joinQueue = (queueId: string) => {
    if (socket && isConnected) {
      socket.emit('join-queue', queueId);
    }
  };

  const leaveQueue = (queueId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-queue', queueId);
    }
  };

  const joinAdmin = () => {
    if (socket && isConnected) {
      socket.emit('join-admin');
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinQueue,
    leaveQueue,
    joinAdmin,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

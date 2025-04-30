
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId?: string;
  content: string;
  timestamp: number;
  isGroupMessage: boolean;
}

interface MessageContextType {
  groupMessages: Message[];
  directMessages: Message[];
  sendGroupMessage: (content: string) => void;
  sendDirectMessage: (receiverId: string, content: string) => void;
  getDirectMessagesForUser: (userId: string) => Message[];
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Storage keys
const GROUP_MESSAGES_KEY = "aihive_group_messages";
const DIRECT_MESSAGES_KEY = "aihive_direct_messages";

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);
  const [directMessages, setDirectMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Load messages from localStorage
    const savedGroupMessages = localStorage.getItem(GROUP_MESSAGES_KEY);
    const savedDirectMessages = localStorage.getItem(DIRECT_MESSAGES_KEY);

    if (savedGroupMessages) {
      setGroupMessages(JSON.parse(savedGroupMessages));
    }

    if (savedDirectMessages) {
      setDirectMessages(JSON.parse(savedDirectMessages));
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (groupMessages.length > 0) {
      localStorage.setItem(GROUP_MESSAGES_KEY, JSON.stringify(groupMessages));
    }
  }, [groupMessages]);

  useEffect(() => {
    if (directMessages.length > 0) {
      localStorage.setItem(DIRECT_MESSAGES_KEY, JSON.stringify(directMessages));
    }
  }, [directMessages]);

  const sendGroupMessage = (content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: `group-${Date.now()}`,
      senderId: user.id,
      senderName: user.username,
      content,
      timestamp: Date.now(),
      isGroupMessage: true,
    };

    setGroupMessages((prev) => [...prev, newMessage]);
  };

  const sendDirectMessage = (receiverId: string, content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: `direct-${Date.now()}`,
      senderId: user.id,
      senderName: user.username,
      receiverId,
      content,
      timestamp: Date.now(),
      isGroupMessage: false,
    };

    setDirectMessages((prev) => [...prev, newMessage]);
  };

  const getDirectMessagesForUser = (userId: string): Message[] => {
    if (!user) return [];

    return directMessages.filter(
      (msg) =>
        (msg.senderId === user.id && msg.receiverId === userId) ||
        (msg.senderId === userId && msg.receiverId === user.id)
    );
  };

  return (
    <MessageContext.Provider
      value={{
        groupMessages,
        directMessages,
        sendGroupMessage,
        sendDirectMessage,
        getDirectMessagesForUser,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};

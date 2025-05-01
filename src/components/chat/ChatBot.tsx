
import { useState, useEffect } from "react";
import ChatBotIcon from "./ChatBotIcon";
import ChatPanel from "./ChatPanel";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Handle chat toggle
  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setUnreadMessages(0);
    }
  };

  // Handle new message notification
  const handleNewMessage = () => {
    if (!isOpen) {
      setUnreadMessages((prev) => prev + 1);
    }
  };

  // Close chat when user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside chat container and icon
      const isChatContainer = target.closest('[data-chat-container="true"]');
      const isChatIcon = target.closest('[data-chat-icon="true"]');
      
      if (isOpen && !isChatContainer && !isChatIcon) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div data-chat-icon="true">
        <ChatBotIcon 
          isOpen={isOpen} 
          toggleChat={toggleChat} 
          unreadMessages={unreadMessages} 
        />
      </div>
      <div data-chat-container="true">
        <ChatPanel 
          isOpen={isOpen} 
          onNewMessage={handleNewMessage} 
        />
      </div>
    </>
  );
};

export default ChatBot;

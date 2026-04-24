/*import React, { createContext, useState } from 'react';

export const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addMessage = (message) => {
    setMessages([...messages, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ChatbotContext.Provider value={{
      messages,
      isOpen,
      addMessage,
      clearMessages,
      toggleChatbot
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};*/
import { createContext, useCallback, useContext, useState } from "react";

const ChatCardContext = createContext(null);

export function ChatCardProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [sessionKey, setSessionKey] = useState(0);

  const openChat = useCallback((query) => {
    setInitialQuery(query || "");
    setSessionKey((k) => k + 1);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);

  const value = { isOpen, initialQuery, sessionKey, openChat, closeChat };

  return (
    <ChatCardContext.Provider value={value}>
      {children}
    </ChatCardContext.Provider>
  );
}

export function useChatCard() {
  const ctx = useContext(ChatCardContext);
  if (!ctx) {
    throw new Error("useChatCard must be used inside a ChatCardProvider");
  }
  return ctx;
}
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UIMessage } from "ai";

interface ChatState {
  // Lưu lịch sử chat theo từng ID người dùng. 'guest' dành cho người chưa đăng nhập.
  histories: Record<string, UIMessage[]>;
  addMessage: (userId: string, message: UIMessage) => void;
  setHistory: (userId: string, messages: UIMessage[]) => void;
  clearHistory: (userId: string) => void;
}

const defaultMessage: UIMessage = {
  id: "welcome-1",
  role: "assistant",
  parts: [{ type: "text", text: "Xin chào! Tôi là trợ lý AI của NetTech. Tôi có thể giúp gì cho bạn hôm nay?" }],
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      histories: {},

      addMessage: (userId, message) =>
        set((state) => {
          const currentHistory = state.histories[userId] || [defaultMessage];
          return {
            histories: {
              ...state.histories,
              [userId]: [...currentHistory, message],
            },
          };
        }),

      setHistory: (userId, messages) =>
        set((state) => ({
          histories: {
            ...state.histories,
            [userId]: messages.length > 0 ? messages : [defaultMessage],
          },
        })),

      clearHistory: (userId) =>
        set((state) => ({
          histories: {
            ...state.histories,
            [userId]: [defaultMessage],
          },
        })),
    }),
    {
      name: "ai-chat-storage", // Lưu vào localStorage
    }
  )
);

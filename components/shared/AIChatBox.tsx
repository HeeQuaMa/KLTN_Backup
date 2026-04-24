"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";

// Helper: lấy text từ UIMessage parts
function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");
}

// Tin nhắn chào mặc định
const WELCOME_TEXT =
  "Xin chào! Tôi là trợ lý AI của NetTech. Tôi có thể giúp gì cho bạn hôm nay?";

const createDefaultMessages = (): UIMessage[] => [
  {
    id: "welcome-1",
    role: "assistant",
    parts: [{ type: "text", text: WELCOME_TEXT }],
  },
];

export const AIChatBox = () => {
  const { user } = useAuthStore();
  const currentUserId = user?.id || "guest";
  const { histories, setHistory } = useChatStore();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Khởi tạo useChat từ @ai-sdk/react v3
  // UseChatOptions = { chat: Chat } | ChatInit
  // ChatInit có field: messages, transport, ...
  // Mặc định transport sẽ gọi /api/chat
  const { messages, setMessages, sendMessage, status } = useChat({
    messages: histories[currentUserId]?.length
      ? histories[currentUserId]
      : createDefaultMessages(),
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Khi tài khoản thay đổi, nạp lại lịch sử tương ứng
  useEffect(() => {
    const saved = histories[currentUserId];
    setMessages(saved?.length ? saved : createDefaultMessages());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  // Đồng bộ messages mới vào store → localStorage
  useEffect(() => {
    if (messages.length > 0) {
      setHistory(currentUserId, messages);
    }
  }, [messages, currentUserId, setHistory]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    setInputValue("");
    // @ai-sdk/react v3: sendMessage({ text: string })
    sendMessage({ text: trimmed });
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-[6.5rem] right-6 z-50 flex h-[500px] w-[350px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl transition-all duration-300 origin-bottom-right",
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-90 opacity-0"
        )}
      >
        {/* Header */}
        <div className="bg-primary flex items-center justify-between px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <div>
              <h3 className="font-semibold text-sm">NetTech AI Support</h3>
              <p className="text-white/90 text-xs">
                Luôn sẵn sàng hỗ trợ 24/7
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-primary/90 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
          {messages.map((msg) => {
            const text = getMessageText(msg);
            if (!text) return null;
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    msg.role === "user"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {msg.role === "user" ? (
                    <UserIcon className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-sm"
                      : "bg-white border text-slate-700 rounded-tl-sm shadow-sm"
                  )}
                >
                  {text}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white border text-slate-700 rounded-2xl rounded-tl-sm shadow-sm px-4 py-3 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white p-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 rounded-full focus-visible:ring-primary h-10"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isLoading}
              className="rounded-full shrink-0 h-10 w-10 transition-transform active:scale-95"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Chat Bubble Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-primary hover:bg-primary/90 focus:ring-primary fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        aria-label="Toggle AI Chat"
      >
        <div className="relative h-7 w-7">
          <MessageCircle
            className={cn(
              "absolute inset-0 h-7 w-7 transition-all duration-300",
              isOpen
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            )}
          />
          <X
            className={cn(
              "absolute inset-0 h-7 w-7 transition-all duration-300",
              isOpen
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0"
            )}
          />
        </div>
      </button>
    </>
  );
};

export default AIChatBox;

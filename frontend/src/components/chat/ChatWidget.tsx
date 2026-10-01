"use client";

import { MessageCircle, Send, X } from "lucide-react";
import Link from "next/link";
import { SyntheticEvent, useEffect, useRef, useState } from "react";

import { ApiError } from "@/lib/api";
import {
  getCustomerChat,
  sendCustomerChatMessage,
} from "@/services/chat-service";
import { useAuthStore } from "@/store/auth-store";
import type { ChatMessage } from "@/types/chat";

const guestWelcome: ChatMessage = {
  id: -1,
  conversation_id: 0,
  sender_id: null,
  sender_type: "ASSISTANT",
  message:
    "Hello! Ask me about delivery, payment, returns, products, or orders. Log in if you want an administrator to reply personally.",
  is_read: true,
  created_at: new Date().toISOString(),
};

function getGuestAssistantReply(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("delivery") || normalized.includes("shipping")) {
    return "Delivery costs ৳80 inside Dhaka and ৳150 outside Dhaka.";
  }

  if (normalized.includes("payment") || normalized.includes("cod")) {
    return "Cash on Delivery is currently available.";
  }

  if (normalized.includes("return") || normalized.includes("exchange")) {
    return "Keep the product unused with its labels and packaging, then contact support before returning it.";
  }

  if (normalized.includes("order") || normalized.includes("status")) {
    return "Log in and open My Account → My Orders to check an order. An administrator can also help after you log in.";
  }

  if (normalized.includes("size")) {
    return "Available sizes and the size guide appear on the product page.";
  }

  return "I could not answer that automatically. Please log in to send the question to an administrator.";
}

export default function ChatWidget() {
  const token = useAuthStore((state) => state.token);

  const user = useAuthStore((state) => state.user);

  const isCustomer = Boolean(token && user?.role === "CUSTOMER");

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([guestWelcome]);

  const [text, setText] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isSending, setIsSending] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!isOpen || !token || !isCustomer) {
      return;
    }

    const accessToken = token;
    let cancelled = false;

    async function loadChat() {
      try {
        const conversation = await getCustomerChat(accessToken);

        if (!cancelled) {
          setMessages(conversation.messages);
          setError(null);
          setIsLoading(false);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load support chat.",
          );
          setIsLoading(false);
        }
      }
    }

    setIsLoading(true);
    void loadChat();

    const intervalId = window.setInterval(() => {
      void loadChat();
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isOpen, token, isCustomer]);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedText = text.trim();

    if (!normalizedText) {
      return;
    }

    setText("");
    setError(null);

    if (!token || !isCustomer) {
      const now = Date.now();

      setMessages((current) => [
        ...current,
        {
          id: now,
          conversation_id: 0,
          sender_id: null,
          sender_type: "CUSTOMER",
          message: normalizedText,
          is_read: true,
          created_at: new Date().toISOString(),
        },
        {
          id: now + 1,
          conversation_id: 0,
          sender_id: null,
          sender_type: "ASSISTANT",
          message: getGuestAssistantReply(normalizedText),
          is_read: true,
          created_at: new Date().toISOString(),
        },
      ]);

      return;
    }

    setIsSending(true);

    try {
      const conversation = await sendCustomerChatMessage(token, normalizedText);

      setMessages(conversation.messages);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to send your message.",
      );

      setText(normalizedText);
    } finally {
      setIsSending(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsOpen(true);
        }}
        aria-label="Open customer support"
        className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#D88C9A] text-white shadow-xl transition hover:bg-[#C97B89]"
      >
        <MessageCircle size={26} />
      </button>
    );
  }

  return (
    <section className="fixed inset-x-3 bottom-3 z-[70] flex h-[70vh] max-h-[620px] flex-col overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-2xl md:inset-x-auto md:bottom-5 md:right-5 md:w-[380px]">
      <header className="flex items-center justify-between bg-[#D88C9A] px-4 py-3 text-white">
        <div>
          <h2 className="font-semibold">Bandhon Noors Support</h2>

          <p className="text-xs text-white/80">Assistant and admin help</p>
        </div>

        <button
          type="button"
          aria-label="Close support chat"
          onClick={() => setIsOpen(false)}
        >
          <X size={21} />
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
        {isLoading && (
          <p className="text-center text-sm text-gray-500">
            Loading messages...
          </p>
        )}

        {messages.map((message) => {
          const fromCustomer = message.sender_type === "CUSTOMER";

          return (
            <div
              key={message.id}
              className={`flex ${
                fromCustomer ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  fromCustomer
                    ? "rounded-br-sm bg-[#D88C9A] text-white"
                    : message.sender_type === "ADMIN"
                      ? "rounded-bl-sm bg-green-100 text-gray-800"
                      : "rounded-bl-sm border bg-white text-gray-700"
                }`}
              >
                {message.sender_type === "ADMIN" && (
                  <p className="mb-1 text-xs font-semibold text-green-700">
                    Admin
                  </p>
                )}

                {message.message}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {!isCustomer && (
        <div className="border-t bg-amber-50 px-4 py-2 text-xs text-amber-800">
          <Link href="/account/login" className="font-semibold underline">
            Log in
          </Link>{" "}
          to receive personal replies from an administrator.
        </div>
      )}

      {error && (
        <p role="alert" className="border-t px-4 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t bg-white p-3"
      >
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={1000}
          placeholder="Write a message..."
          className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-pink-300"
        />

        <button
          type="submit"
          disabled={isSending || !text.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D88C9A] text-white disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </form>
    </section>
  );
}

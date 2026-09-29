"use client";

import {
  Send,
  XCircle,
} from "lucide-react";
import {
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  closeAdminChatConversation,
  getAdminChatConversation,
  getAdminChatConversations,
  sendAdminChatMessage,
} from "@/services/chat-service";
import { useAuthStore } from "@/store/auth-store";
import type {
  AdminChatSummary,
  ChatConversation,
} from "@/types/chat";

export default function AdminChatPage() {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const [conversations, setConversations] =
    useState<AdminChatSummary[]>([]);

  const [
    selectedConversationId,
    setSelectedConversationId,
  ] = useState<number | null>(
    null,
  );

  const [
    conversation,
    setConversation,
  ] = useState<ChatConversation | null>(
    null,
  );

  const [reply, setReply] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isWorking, setIsWorking] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const selectedSummary =
    conversations.find(
      (item) =>
        item.id ===
        selectedConversationId,
    );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [
    conversation?.messages,
  ]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const accessToken = token;
    let cancelled = false;

    async function loadConversations() {
      try {
        const data =
          await getAdminChatConversations(
            accessToken,
          );

        if (!cancelled) {
          setConversations(data);
          setError(null);
          setIsLoading(false);

          setSelectedConversationId(
            (current) =>
              current ??
              data[0]?.id ??
              null,
          );
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load conversations.",
          );
          setIsLoading(false);
        }
      }
    }

    void loadConversations();

    const intervalId =
      window.setInterval(
        () => {
          void loadConversations();
        },
        5000,
      );

    return () => {
      cancelled = true;
      window.clearInterval(
        intervalId,
      );
    };
  }, [token]);

  useEffect(() => {
    if (
      !token ||
      selectedConversationId ===
        null
    ) {
      setConversation(null);
      return;
    }

    const accessToken = token;
    const conversationId =
      selectedConversationId;

    let cancelled = false;

    async function loadConversation() {
      try {
        const data =
          await getAdminChatConversation(
            accessToken,
            conversationId,
          );

        if (!cancelled) {
          setConversation(data);
          setError(null);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load the conversation.",
          );
        }
      }
    }

    void loadConversation();

    const intervalId =
      window.setInterval(
        () => {
          void loadConversation();
        },
        4000,
      );

    return () => {
      cancelled = true;
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    token,
    selectedConversationId,
  ]);

  async function handleReply(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !token ||
      selectedConversationId ===
        null ||
      !reply.trim()
    ) {
      return;
    }

    const message =
      reply.trim();

    setReply("");
    setIsWorking(true);
    setError(null);

    try {
      const updated =
        await sendAdminChatMessage(
          token,
          selectedConversationId,
          message,
        );

      setConversation(updated);

      const summaries =
        await getAdminChatConversations(
          token,
        );

      setConversations(
        summaries,
      );
    } catch (requestError) {
      setReply(message);

      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to send the reply.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleClose() {
    if (
      !token ||
      selectedConversationId ===
        null
    ) {
      return;
    }

    setIsWorking(true);
    setError(null);

    try {
      const updated =
        await closeAdminChatConversation(
          token,
          selectedConversationId,
        );

      setConversation(updated);

      setConversations(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              updated.id
                ? {
                    ...item,
                    status:
                      updated.status,
                  }
                : item,
          ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to close the conversation.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <main className="flex min-h-screen min-w-0 flex-col bg-gray-50">
      <header className="border-b bg-white px-4 py-5 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Customer Chat
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Reply to customer support messages.
        </p>
      </header>

      {error && (
        <p
          role="alert"
          className="mx-4 mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:mx-8"
        >
          {error}
        </p>
      )}

      <div className="grid min-h-0 flex-1 md:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-r bg-white">
          {isLoading ? (
            <p className="p-5 text-sm text-gray-500">
              Loading conversations...
            </p>
          ) : conversations.length === 0 ? (
            <p className="p-5 text-sm text-gray-500">
              No customer conversations yet.
            </p>
          ) : (
            <div className="max-h-[35vh] overflow-y-auto md:max-h-[calc(100vh-105px)]">
              {conversations.map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setSelectedConversationId(
                        item.id,
                      )
                    }
                    className={`w-full border-b px-4 py-4 text-left ${
                      selectedConversationId ===
                      item.id
                        ? "bg-pink-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-medium text-gray-900">
                        {
                          item.customer_name
                        }
                      </p>

                      {item.unread_count >
                        0 && (
                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-pink-500 px-2 text-xs text-white">
                          {
                            item.unread_count
                          }
                        </span>
                      )}
                    </div>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {
                        item.customer_email
                      }
                    </p>

                    <p className="mt-2 truncate text-sm text-gray-600">
                      {item.last_message ??
                        "No messages"}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {item.status}
                    </p>
                  </button>
                ),
              )}
            </div>
          )}
        </aside>

        <section className="flex min-h-[60vh] min-w-0 flex-col">
          {!conversation ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-gray-500">
              Select a customer conversation.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-3">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedSummary?.customer_name ??
                      `Customer #${conversation.customer_id}`}
                  </h2>

                  <p className="text-xs text-gray-500">
                    {
                      selectedSummary?.customer_email
                    }
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    isWorking ||
                    conversation.status ===
                      "CLOSED"
                  }
                  onClick={() =>
                    void handleClose()
                  }
                  className="flex items-center gap-2 border border-red-200 px-3 py-2 text-xs text-red-600 disabled:opacity-40"
                >
                  <XCircle size={16} />

                  Close conversation
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4 md:p-6">
                {conversation.messages.map(
                  (message) => {
                    const fromAdmin =
                      message.sender_type ===
                      "ADMIN";

                    const fromAssistant =
                      message.sender_type ===
                      "ASSISTANT";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          fromAdmin
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                            fromAdmin
                              ? "rounded-br-sm bg-gray-900 text-white"
                              : fromAssistant
                                ? "rounded-bl-sm border bg-white text-gray-600"
                                : "rounded-bl-sm bg-pink-100 text-gray-800"
                          }`}
                        >
                          {fromAssistant && (
                            <p className="mb-1 text-xs font-semibold text-pink-600">
                              Assistant
                            </p>
                          )}

                          {message.message}
                        </div>
                      </div>
                    );
                  },
                )}

                <div
                  ref={messagesEndRef}
                />
              </div>

              <form
                onSubmit={handleReply}
                className="flex gap-3 border-t bg-white p-4"
              >
                <input
                  value={reply}
                  onChange={(event) =>
                    setReply(
                      event.target.value,
                    )
                  }
                  maxLength={1000}
                  placeholder="Write an admin reply..."
                  className="min-w-0 flex-1 border px-4 py-3 text-sm outline-none focus:border-pink-300"
                />

                <button
                  type="submit"
                  disabled={
                    isWorking ||
                    !reply.trim()
                  }
                  aria-label="Send reply"
                  className="flex w-12 shrink-0 items-center justify-center bg-gray-900 text-white disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

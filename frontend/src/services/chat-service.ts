import { apiRequest } from "@/lib/api";
import type {
  AdminChatSummary,
  ChatConversation,
} from "@/types/chat";

export function getCustomerChat(
  token: string,
): Promise<ChatConversation> {
  return apiRequest<ChatConversation>(
    "/chat",
    {
      token,
    },
  );
}

export function sendCustomerChatMessage(
  token: string,
  message: string,
): Promise<ChatConversation> {
  return apiRequest<ChatConversation>(
    "/chat/messages",
    {
      method: "POST",
      token,
      body: {
        message,
      },
    },
  );
}

export function getAdminChatConversations(
  token: string,
): Promise<AdminChatSummary[]> {
  return apiRequest<AdminChatSummary[]>(
    "/admin/chat",
    {
      token,
    },
  );
}

export function getAdminChatConversation(
  token: string,
  conversationId: number,
): Promise<ChatConversation> {
  return apiRequest<ChatConversation>(
    `/admin/chat/${conversationId}`,
    {
      token,
    },
  );
}

export function sendAdminChatMessage(
  token: string,
  conversationId: number,
  message: string,
): Promise<ChatConversation> {
  return apiRequest<ChatConversation>(
    `/admin/chat/${conversationId}/messages`,
    {
      method: "POST",
      token,
      body: {
        message,
      },
    },
  );
}

export function closeAdminChatConversation(
  token: string,
  conversationId: number,
): Promise<ChatConversation> {
  return apiRequest<ChatConversation>(
    `/admin/chat/${conversationId}/close`,
    {
      method: "PATCH",
      token,
    },
  );
}

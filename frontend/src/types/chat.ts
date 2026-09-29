export type ChatSenderType =
  | "CUSTOMER"
  | "ADMIN"
  | "ASSISTANT";

export type ChatConversationStatus =
  | "OPEN"
  | "CLOSED";

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number | null;
  sender_type: ChatSenderType;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatConversation {
  id: number;
  customer_id: number;
  assigned_admin_id: number | null;
  status: ChatConversationStatus;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface AdminChatSummary {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  status: ChatConversationStatus;
  assigned_admin_id: number | null;
  unread_count: number;
  last_message: string | null;
  last_message_at: string | null;
}

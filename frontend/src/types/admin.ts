import type { Product } from "@/types/product";
export interface AdminProductPage {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
export interface AdminDashboard {
  total_customers: number;
  total_products: number;
  total_orders: number;
  pending_orders: number;
  total_sales: number;
  low_stock_count: number;
}

export interface AdminProductUpdate {
  category_id?: number;
  name?: string;
  description?: string;
  price?: number;
  weight?: number;
  size_chart?: string;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface AdminProductCreate {
  category_id: number;
  name: string;
  description?: string;
  price: number;
  weight?: number;
  size_chart?: string;
  has_variants: boolean;
  initial_stock: number;
  low_stock_threshold: number;
  is_featured: boolean;
}

export interface AdminVariant {
  id: number;
  product_id: number;
  variant_code: string;
  color_theme: string | null;
  size: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  additional_price: number | null;
  created_at: string;
  updated_at: string;
}

export interface AdminVariantCreate {
  variant_code: string;
  color_theme?: string;
  size?: string;
  stock_quantity: number;
  low_stock_threshold: number;
  additional_price?: number;
}
export interface AdminVariantUpdate {
  variant_code?: string;
  color_theme?: string;
  size?: string;
  low_stock_threshold?: number;
  additional_price?: number;
}
export interface AdminProductMedia {
  id: number;
  product_id: number;
  file_url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  media_type: "IMAGE" | "VIDEO";
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export type InventoryTransactionType =
  | "STOCK_IN"
  | "STOCK_OUT"
  | "ORDER"
  | "RETURN"
  | "ADJUSTMENT";

export interface InventoryVariant {
  variant_id: number;
  product_id: number;
  product_name: string;
  variant_code: string;
  color_theme: string | null;
  size: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
}

export interface InventoryTransaction {
  id: number;
  variant_id: number;
  change_amount: number;
  transaction_type: InventoryTransactionType;
  note: string | null;
  created_by: number | null;
  created_at: string;
}


export interface AdminCategoryCreate {
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
}

export interface AdminCategoryUpdate {
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: number;
  is_active?: boolean;
}


export interface AdminCustomer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  order_count: number;
  total_spent: number;
  created_at: string;
}

export interface AdminCustomerPage {
  items: AdminCustomer[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type AdminInvitationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "USED";

export interface AdminInvitation {
  id: number;
  email: string;
  name: string | null;
  reason: string;
  requested_by: number;
  approved_by: number | null;
  status: AdminInvitationStatus;
  created_at: string;
  approved_at: string | null;
  expires_at: string | null;
}

export interface AdminInvitationCreate {
  email: string;
  name?: string;
  reason: string;
}

export interface AdminStaffUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role:
    | "ADMIN"
    | "SUPER_ADMIN";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminReview {
  id: number;
  product_id: number;
  product_name: string;
  customer_id: number;
  customer_name: string;
  order_id: number;
  rating: number;
  comment: string;
  is_visible: boolean;
  created_at: string;
}

export interface AdminReviewPage {
  items: AdminReview[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
export interface AdminStaffCreate {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

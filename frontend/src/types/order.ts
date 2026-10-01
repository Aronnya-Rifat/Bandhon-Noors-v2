/**
 * Order related TypeScript definitions.
 *
 * Matches Bandhon Noors backend order flow.
 */


/**
 * Order status.
 *
 * Backend controlled values.
 */
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";


/**
 * Delivery area.
 */
export type DeliveryArea =
  | "DHAKA"
  | "OUTSIDE";
export type PaymentMethod =
  | "COD"
  | "BKASH"
  | "NAGAD"
  | "BANK"
  | "CARD"
  | "MOBILE_BANKING";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";
export interface OrderCreate {
  address_id: number;
  delivery_area: DeliveryArea;
  payment_method: PaymentMethod;
  sender_number?: string;
  transaction_id?: string;
}
export interface OrderItem {
  id: number;
  variant_id: number;
  product_name: string;
  variant_info: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  customer_id: number;
  status: OrderStatus;
  subtotal: number;
  delivery_area: DeliveryArea;
  delivery_charge: number;
  total_amount: number;
  shipping_address: string;
  items: OrderItem[];
  payment: Payment | null;
  created_at: string;
  updated_at: string;
  courier_name: string | null;
  tracking_number: string | null;

}
export interface CustomerOrderPage {
  items: Order[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id: string | null;
  sender_number: string | null;
  verified_by_id: number | null;
  verified_at: string | null;
  verification_note: string | null;
  created_at: string;
}
export interface AdminOrder
  extends Order {
  customer_name: string;
  customer_email: string;
}

export interface AdminOrderPage {
  items: AdminOrder[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
export interface ManualPaymentOption {
  enabled: boolean;
  number: string | null;
  instructions: string;
}

export interface PaymentOptions {
  cod_enabled: boolean;
  bkash: ManualPaymentOption;
  nagad: ManualPaymentOption;
  sslcommerz_enabled: boolean;
}

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
  | "COD";
export interface OrderCreate {
  address_id: number;
  delivery_area: DeliveryArea;
  payment_method: PaymentMethod;
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
  created_at: string;
  updated_at: string;
}

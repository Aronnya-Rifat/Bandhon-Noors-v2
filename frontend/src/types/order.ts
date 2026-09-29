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
 * Payment status.
 */
export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";


/**
 * Payment method.
 */
export type PaymentMethod =
  | "COD"
  | "ONLINE";


/**
 * Product snapshot inside order.
 *
 * This represents what was purchased.
 */
export interface OrderItem {

  id: number;

  product_name: string;

  variant_name: string | null;

  quantity: number;

  unit_price: number;

  total_price: number;
}


/**
 * Shipping address snapshot.
 *
 * Stored at order creation time.
 */
export interface ShippingAddress {

  full_name: string;

  phone: string;

  address_line: string;

  city: string;

  postal_code: string | null;
}


/**
 * Payment information.
 */
export interface OrderPayment {

  id: number;

  payment_method: PaymentMethod;

  payment_status: PaymentStatus;

  amount: number;
}


/**
 * Main order response.
 */
export interface Order {

  id: number;

  order_number: string;

  status: OrderStatus;

  subtotal: number;

  delivery_charge: number;

  total_amount: number;

  items: OrderItem[];

  shipping_address: ShippingAddress;

  payment: OrderPayment | null;

  created_at: string;

  updated_at: string;
}
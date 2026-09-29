/**
 * Cart related TypeScript definitions.
 *
 * Matches backend cart structures.
 */


/**
 * Variant information shown inside cart.
 *
 * Example:
 *
 * Pink / Medium
 */
export interface CartVariant {

  id: number;

  variant_code: string;

  color_theme: string | null;

  size: string | null;

  stock_quantity: number;
  
  additional_price: number;
}


/**
 * Product information shown in cart.
 */
export interface CartProduct {

  id: number;

  product_code: string;

  name: string;

  price: number;
}


/**
 * Individual cart item.
 *
 * Example:
 *
 * Pink Saree
 * Size: M
 * Quantity: 2
 */
export interface CartItem {

  id: number;

  quantity: number;

  product: CartProduct;

  variant: CartVariant;
}


/**
 * Customer cart response.
 *
 * Used by:
 *
 * - Cart Drawer
 * - Checkout
 */
export interface Cart {

  id: number;

  items: CartItem[];

  total_items: number;

  subtotal: number;
}

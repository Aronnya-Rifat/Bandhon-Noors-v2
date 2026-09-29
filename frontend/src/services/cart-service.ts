import { apiRequest } from "@/lib/api";

import type { Cart } from "@/types/cart";

export function getCustomerCart(
  token: string,
): Promise<Cart> {
  return apiRequest<Cart>(
    "/cart",
    {
      token,
    },
  );
}

export function addCustomerCartItem(
  token: string,
  variantId: number,
  quantity: number,
): Promise<Cart> {
  return apiRequest<Cart>(
    "/cart/items",
    {
      method: "POST",
      token,
      body: {
        variant_id: variantId,
        quantity,
      },
    },
  );
}

export function updateCustomerCartItem(
  token: string,
  itemId: number,
  quantity: number,
): Promise<Cart> {
  return apiRequest<Cart>(
    `/cart/items/${itemId}`,
    {
      method: "PUT",
      token,
      body: {
        quantity,
      },
    },
  );
}

export function removeCustomerCartItem(
  token: string,
  itemId: number,
): Promise<Cart> {
  return apiRequest<Cart>(
    `/cart/items/${itemId}`,
    {
      method: "DELETE",
      token,
    },
  );
}

export function clearCustomerCart(
  token: string,
): Promise<Cart> {
  return apiRequest<Cart>(
    "/cart",
    {
      method: "DELETE",
      token,
    },
  );
}

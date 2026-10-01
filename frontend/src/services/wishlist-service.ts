import { apiRequest } from "@/lib/api";

import type {
  WishlistResponse,
} from "@/types/wishlist";


export function getCustomerWishlist(
  token: string,
): Promise<WishlistResponse> {
  return apiRequest<WishlistResponse>(
    "/wishlist",
    {
      token,
    },
  );
}


export function addCustomerWishlistItem(
  token: string,
  productId: number,
): Promise<WishlistResponse> {
  return apiRequest<WishlistResponse>(
    "/wishlist/items",
    {
      method: "POST",
      token,
      body: {
        product_id: productId,
      },
    },
  );
}


export function removeCustomerWishlistItem(
  token: string,
  productId: number,
): Promise<WishlistResponse> {
  return apiRequest<WishlistResponse>(
    `/wishlist/items/${productId}`,
    {
      method: "DELETE",
      token,
    },
  );
}

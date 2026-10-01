/**
 * Bandhon Noors Wishlist Types
 *
 * Matches future backend wishlist structure.
 *
 * Future:
 * - User wishlist API
 * - Database synchronization
 */


export interface WishlistItem {

  id: number;

  product_id: number;

  name: string;

  price: number;

  image: string;

}
export interface WishlistResponse {
  items: WishlistItem[];
}

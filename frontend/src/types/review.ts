/**
 * Bandhon Noors Review Types
 *
 * Future:
 * Matches backend review model.
 */


export interface Review {

  id: number;

  customer_name: string;

  rating: number;

  comment: string;

  product_id?: number;

  created_at: string;

}

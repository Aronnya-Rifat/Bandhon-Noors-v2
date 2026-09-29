/**
 * Bandhon Noors Search Service
 *
 * Handles global product search.
 *
 * Future:
 * - Backend search endpoint
 * - Suggestions
 * - Ranking
 */


import { apiRequest } from "@/lib/api";

import type {
  ProductCardProduct,
} from "@/types/product";



export async function searchProducts(
  query: string,
): Promise<ProductCardProduct[]> {


  if (!query.trim()) {
    return [];
  }


  const products =
    await apiRequest<ProductCardProduct[]>(
      "/products"
    );


  return products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )
  );

}

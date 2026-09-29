import { getProducts } from "@/services/product-service";

import type {
  ProductCardProduct,
} from "@/types/product";

export async function searchProducts(
  query: string,
): Promise<ProductCardProduct[]> {
  const normalizedQuery =
    query.trim();

  if (!normalizedQuery) {
    return [];
  }

  return getProducts({
    query: normalizedQuery,
  });
}

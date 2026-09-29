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

  const response =
    await getProducts({
      query: normalizedQuery,
      pageSize: 4,
    });

  return response.items;
}

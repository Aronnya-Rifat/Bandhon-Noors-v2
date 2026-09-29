/**
 * Bandhon Noors Product Mapper
 *
 * Converts FastAPI product responses
 * into frontend-friendly structures.
 */

import type { ProductDetail, ProductMedia } from "@/types/product";

/**
 * Convert backend media list
 * into frontend image list.
 *
 * Backend:
 * media
 *
 * Frontend:
 * images
 */
export function mapProductDetail(product: any): ProductDetail {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return {
    id: product.id,

    product_code: product.product_code,

    name: product.name,

    description: product.description,

    price: product.price,

    weight: product.weight,

    size_chart: product.size_chart,

    images:
      product.media?.map((item: ProductMedia) => ({
        ...item,

        file_url: `${API_URL}${item.file_url}`,

        thumbnail_url: item.thumbnail_url
          ? `${API_URL}${item.thumbnail_url}`
          : null,
      })) ?? [],

    variants: product.variants ?? [],
  };
}

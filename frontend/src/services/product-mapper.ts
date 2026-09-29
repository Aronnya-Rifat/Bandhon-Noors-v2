/**
 * Bandhon Noors Product Mapper
 *
 * Converts FastAPI product responses
 * into frontend-friendly structures.
 */

import type {
  ProductCardProduct,
  ProductDetail,
  ProductDetailResponse,
} from "@/types/product";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

function resolveMediaUrl(path: string): string {
  return new URL(path, `${API_URL}/`).href;
}

export function mapProductCard(
  product: ProductCardProduct,
): ProductCardProduct {
  return {
    ...product,
    thumbnail_url: product.thumbnail_url
      ? resolveMediaUrl(product.thumbnail_url)
      : null,
  };
}
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
export function mapProductDetail(
  product: ProductDetailResponse,
): ProductDetail {
  const { media, ...details } = product;

  return {
    ...details,
    thumbnail_url: product.thumbnail_url
      ? resolveMediaUrl(product.thumbnail_url)
      : null,
    images: media.map((item) => ({
      ...item,
      file_url: resolveMediaUrl(item.file_url),
      thumbnail_url: item.thumbnail_url
        ? resolveMediaUrl(item.thumbnail_url)
        : null,
    })),
  };
}

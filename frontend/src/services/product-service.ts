/**
 * Bandhon Noors Product Service
 *
 * Handles communication with
 * FastAPI product endpoints.
 *
 * Future:
 * - Search
 * - Pagination
 * - Filters
 */


import { apiRequest } from "@/lib/api";

import {
  mapProductDetail,
} from "./product-mapper";


import type {
  ProductCardProduct,
  ProductDetail,
} from "@/types/product";



/**
 * Get product list
 *
 * Backend:
 * GET /products
 */
export async function getProducts(
  params?: {
    category?: string;
    subcategory?: string;
    query?: string;
    sort?: string;
  }
) {

  const searchParams =
    new URLSearchParams();


  if (params?.category) {
    searchParams.set(
      "category",
      params.category
    );
  }


  if (params?.subcategory) {
    searchParams.set(
      "subcategory",
      params.subcategory
    );
  }


  if (params?.query) {
    searchParams.set(
      "query",
      params.query
    );
  }


  const url =
    searchParams.toString()
      ? `/products?${searchParams.toString()}`
      : "/products";


  return apiRequest<ProductCardProduct[]>(
    url
  );

}



/**
 * Get single product
 *
 * Backend:
 * GET /products/{id}
 */
export async function getProductById(
  id: number,
): Promise<ProductDetail> {


  const product =
    await apiRequest<any>(
      `/products/${id}`
    );


  return mapProductDetail(
    product
  );


}

export async function getNewArrivals(): Promise<ProductCardProduct[]> {

  const products =
    await apiRequest<ProductCardProduct[]>(
      "/products/new-arrivals"
    );


  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";


  return products.map(
    (product) => ({
      ...product,

      thumbnail_url:
        product.thumbnail_url
          ? `${API_URL}${product.thumbnail_url}`
          : null,
    })
  );

}

export async function getFeaturedProducts(): Promise<ProductCardProduct[]> {

  const products =
    await apiRequest<ProductCardProduct[]>(
      "/products/featured"
    );


  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";


  return products.map(
    (product) => ({
      ...product,

      thumbnail_url:
        product.thumbnail_url
          ? `${API_URL}${product.thumbnail_url}`
          : null,
    })
  );

}
export async function getProductsByCategory(
  categoryId: number,
): Promise<ProductCardProduct[]> {


  const products =
    await getProducts();


  return products.filter(
    (product) =>
      product.category_id === categoryId
  );

}
export async function getCollectionPreviewProducts(
  categoryId: number,
): Promise<ProductCardProduct[]> {


  const products =
    await getProductsByCategory(
      categoryId
    );


  return products.slice(
    0,
    4
  );

}

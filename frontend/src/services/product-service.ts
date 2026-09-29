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
  mapProductCard,
  mapProductDetail,
} from "./product-mapper";

import type {
  ProductCardProduct,
  ProductDetail,
  ProductDetailResponse,
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
    size?: string;
    color?: string;
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

  if (params?.sort) {
    searchParams.set(
      "sort",
      params.sort
    );
  }

  if (params?.size) {
    searchParams.set(
      "size",
      params.size
    );
  }

  if (params?.color) {
    searchParams.set(
      "color",
      params.color
    );
  }


  const url =
    searchParams.toString()
      ? `/products?${searchParams.toString()}`
      : "/products";


  const products = await apiRequest<ProductCardProduct[]>(url);

  return products.map(mapProductCard);
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


  const product = await apiRequest<ProductDetailResponse>(
    `/products/${id}`,
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


  return products.map(mapProductCard);
}

export async function getFeaturedProducts(): Promise<ProductCardProduct[]> {

  const products =
    await apiRequest<ProductCardProduct[]>(
      "/products/featured"
    );


  return products.map(mapProductCard);

}
export async function getProductsByCategory(
  categoryId: number,
): Promise<ProductCardProduct[]> {


  const products = await apiRequest<ProductCardProduct[]>(
    `/products/category/${categoryId}`,
  );

  return products.map(mapProductCard);

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

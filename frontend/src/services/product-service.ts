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
  ProductPage,
  ProductFilterOptions,
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
    page?: number;
    pageSize?: number;
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
  if (params?.page) {
    searchParams.set(
      "page",
      String(params.page),
    );
  }

  searchParams.set(
    "page_size",
    String(params?.pageSize ?? 24),
  );

  const url =
    searchParams.toString()
      ? `/products?${searchParams.toString()}`
      : "/products";


  const response =
    await apiRequest<ProductPage>(
      url,
    );

  return {
    ...response,
    items: response.items.map(
      mapProductCard,
    ),
  };
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

export function getProductFilterOptions(): Promise<ProductFilterOptions> {
  return apiRequest<ProductFilterOptions>(
    "/products/filter-options",
  );
}

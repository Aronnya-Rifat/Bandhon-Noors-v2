/**
 * Bandhon Noors Category Service
 *
 * Handles category API communication.
 *
 * Future:
 * - Category caching
 * - Category filtering
 * - Admin category management
 */


import type { Category } from "@/types/category";

import { apiRequest } from "@/lib/api";



export async function getCategories(): Promise<Category[]> {


  const categories =
    await apiRequest<Category[]>(
      "/categories"
    );


  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";



  return categories.map(
    (category) => ({

      ...category,


      image_url:
        category.image_url
          ? `${API_URL}${category.image_url}`
          : null,

    })
  );

}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {

  const categories =
    await getCategories();


  return (
    categories.find(
      (category) =>
        category.slug === slug
    )
    ?? null
  );

}

export async function getMainCategories(): Promise<Category[]> {

  return apiRequest<Category[]>(
    "/categories/main"
  );

}

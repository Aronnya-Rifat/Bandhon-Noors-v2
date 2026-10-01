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
import {
  getApiAssetUrl,
} from "@/lib/api";
import { apiRequest } from "@/lib/api";



export async function getCategories(): Promise<Category[]> {


  const categories =
    await apiRequest<Category[]>(
      "/categories"
    );



  return categories.map(
    (category) => ({

      ...category,


      image_url:
        category.image_url
          ? getApiAssetUrl(
              category.image_url,
            )
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

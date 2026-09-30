import { apiRequest } from "@/lib/api";

import type {
  Review,
  ReviewCreate,
} from "@/types/review";


export function getProductReviews(
  productId: number,
): Promise<Review[]> {
  return apiRequest<Review[]>(
    `/products/${productId}/reviews`,
  );
}


export function createProductReview(
  token: string,
  productId: number,
  data: ReviewCreate,
): Promise<Review> {
  return apiRequest<Review>(
    `/products/${productId}/reviews`,
    {
      method: "POST",
      token,
      body: data,
    },
  );
}
export function getFeaturedReviews(
  limit = 8,
): Promise<Review[]> {
  return apiRequest<Review[]>(
    `/reviews/featured?limit=${limit}`,
  );
}

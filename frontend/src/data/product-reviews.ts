/**
 * Temporary product review data.
 *
 * Future:
 * Replace with backend API.
 */


import type { Review } from "@/types/review";


export const productReviews: Review[] = [

  {
    id: 1,

    customer_name: "Rumana",

    rating: 5,

    comment:
      "The fabric quality is excellent and the design looks beautiful.",

    product_id: 1,

    created_at:
      "2026-01-10",
  },


  {
    id: 2,

    customer_name: "Nusrat",

    rating: 5,

    comment:
      "Very elegant traditional design. Loved the finishing.",

    product_id: 1,

    created_at:
      "2026-01-12",
  },

];

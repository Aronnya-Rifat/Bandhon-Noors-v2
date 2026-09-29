/**
 * Homepage Featured Testimonials
 *
 * These are selected customer experiences.
 *
 * Later replaced by:
 * GET /reviews/featured
 */


export interface Testimonial {

  id: number;

  name: string;

  message: string;

  rating: number;

}


export const testimonials: Testimonial[] = [

  {
    id: 1,
    name: "Farzana",
    message:
      "The fabric quality was beautiful and the design was even better than expected.",
    rating: 5,
  },


  {
    id: 2,
    name: "Nusrat",
    message:
      "Loved the traditional touch with a modern elegant style.",
    rating: 5,
  },


  {
    id: 3,
    name: "Ayesha",
    message:
      "Beautiful craftsmanship and excellent customer service.",
    rating: 5,
  },

];

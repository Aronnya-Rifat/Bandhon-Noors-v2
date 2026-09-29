/**
 * Bandhon Noors Product Reviews
 *
 * Product specific customer reviews.
 *
 * Handles:
 * - Rating display
 * - Customer comments
 *
 * Future:
 * - Backend review API
 * - Review submission
 * - Verified purchase badge
 */


import type { Review } from "@/types/review";



interface ProductReviewsProps {

  reviews: Review[];

}



export default function ProductReviews({
  reviews,
}: ProductReviewsProps) {


  return (

    <section
      className="
        mt-20
      "
    >


      <h2
        className="
          text-2xl
          font-semibold
          text-gray-800
        "
      >

        Customer Reviews

      </h2>



      {
        reviews.length === 0 ? (

          <p
            className="
              mt-6
              text-gray-500
            "
          >

            No reviews yet.

          </p>


        ) : (


          <div
            className="
              mt-8
              space-y-6
            "
          >

            {
              reviews.map(
                (review) => (

                  <div
                    key={review.id}
                    className="
                      border
                      border-pink-100
                      rounded-2xl
                      p-6
                    "
                  >


                    <div
                      className="
                        text-rose-500
                      "
                    >

                      {
                        "★".repeat(
                          review.rating
                        )
                      }

                    </div>



                    <p
                      className="
                        mt-3
                        text-gray-600
                      "
                    >

                      "{review.comment}"

                    </p>



                    <p
                      className="
                        mt-4
                        font-medium
                        text-gray-800
                      "
                    >

                      {review.customer_name}

                    </p>


                  </div>

                )
              )
            }


          </div>


        )
      }


    </section>

  );

}

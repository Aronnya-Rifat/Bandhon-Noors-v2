/**
 * Bandhon Noors Review Slider
 *
 * Homepage customer review showcase.
 *
 * Future:
 * - Load featured reviews API
 * - Auto carousel
 */


"use client";


import type { Review } from "@/types/review";



interface ReviewSliderProps {

  reviews: Review[];

}



export default function ReviewSlider({
  reviews,
}: ReviewSliderProps) {


  return (

    <section
      className="
        py-20
        bg-pink-50
      "
    >

      <div
        className="
          container
        "
      >


        <div
          className="
            text-center
            mb-12
          "
        >

          <p
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-rose-500
            "
          >

            Customer Love

          </p>


          <h2
            className="
              mt-3
              text-3xl
              font-semibold
              text-[#3F312B]
            "
          >

            Reviews

          </h2>


        </div>



        <div
          className="
            flex
            overflow-hidden
          "
        >

          <div
            className="
              flex
              gap-6
              animate-scroll
            "
          >

            {
              reviews.map(
                (review) => (

                  <div
                    key={review.id}
                    className="
                      min-w-[300px]
                      bg-white
                      rounded-2xl
                      p-6
                      border
                      border-pink-100
                    "
                  >


                    <div
                      className="
                        text-rose-300
                        text-lg
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
                        mt-4
                        text-gray-600
                      "
                    >

                      "{review.comment}"

                    </p>



                    <p
                      className="
                        mt-5
                        font-medium
                        text-[#3F312B]
                      "
                    >

                      {review.customer_name}

                    </p>


                  </div>

                )
              )
            }


          </div>


        </div>


      </div>


    </section>

  );

}

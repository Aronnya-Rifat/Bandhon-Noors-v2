/**
 * Bandhon Noors Customer Reviews
 *
 * Homepage trust section.
 *
 * Later connected to:
 * - Review database
 * - Customer feedback system
 */


const reviews = [

  {
    text:
      "The fabric quality and finishing were beautiful. The design felt traditional yet modern.",

    name:
      "Farzana",
  },


  {
    text:
      "Loved the craftsmanship and attention to detail. The product looked even better in person.",

    name:
      "Nusrat",
  },


  {
    text:
      "Excellent experience from ordering to delivery. Will definitely shop again.",

    name:
      "Ayesha",
  },

];


export default function CustomerReviews() {


  return (

    <section
      className="
        bg-white
        py-16
      "
    >

      <div
        className="
          container
        "
      >


        {/* Heading */}

        <div
          className="
            text-center
            mb-10
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
              text-3xl
              md:text-4xl
              font-semibold
              text-[#3F312B]
              mt-3
            "
          >
            What Our Customers Say
          </h2>


        </div>



        {/* Reviews */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
          "
        >

          {reviews.map(
            (review) => (

              <div
                key={review.name}
                className="
                  bg-pink-50
                  rounded-2xl
                  p-8
                  text-center
                "
              >

                <div
                  className="
                    text-rose-500
                    text-3xl
                    mb-4
                  "
                >
                  "
                </div>


                <p
                  className="
                    text-gray-600
                    leading-7
                    text-sm
                  "
                >
                  {review.text}
                </p>


                <p
                  className="
                    mt-5
                    text-[#3F312B]
                    font-medium
                  "
                >
                  — {review.name}
                </p>


              </div>

            )
          )}

        </div>


      </div>


    </section>

  );

}

/**
 * Bandhon Noors Craftsmanship Section
 *
 * Highlights:
 * - Quality
 * - Heritage
 * - Design philosophy
 */


const values = [

  {
    title: "Quality Fabrics",

    description:
      "Carefully selected materials chosen for comfort, beauty, and durability.",
  },


  {
    title: "Traditional Craft",

    description:
      "Inspired by Bengali heritage and traditional artistic techniques.",
  },


  {
    title: "Thoughtful Design",

    description:
      "Every collection balances cultural identity with modern elegance.",
  },

];


export default function CraftsmanshipSection() {


  return (

    <section
      className="
        bg-pink-50
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
            Our Craft
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
            Crafted With Care
          </h2>


        </div>



        {/* Values */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
          "
        >

          {values.map(
            (item) => (

              <div
                key={item.title}
                className="
                  bg-white
                  rounded-2xl
                  p-8
                  text-center
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    mx-auto
                    rounded-full
                    bg-pink-100
                    flex
                    items-center
                    justify-center
                    text-rose-500
                    text-xl
                    mb-5
                  "
                >
                  ✦
                </div>


                <h3
                  className="
                    text-lg
                    font-medium
                    text-[#3F312B]
                    mb-3
                  "
                >
                  {item.title}
                </h3>


                <p
                  className="
                    text-sm
                    text-gray-600
                    leading-6
                  "
                >
                  {item.description}
                </p>


              </div>

            )
          )}

        </div>


      </div>


    </section>

  );

}

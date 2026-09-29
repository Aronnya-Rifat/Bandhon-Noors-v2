/**
 * Bandhon Noors Brand Story
 *
 * Homepage storytelling section.
 *
 * Purpose:
 * - Introduce brand identity
 * - Highlight Bengali heritage
 * - Create premium fashion feeling
 */


import Link from "next/link";

import StoreImage from "@/components/ui/StoreImage";
import { getHomepageSection } from "@/services/homepage-service";

export default async function BrandStory() {
  const brandStory =
    await getHomepageSection(
      "BRAND_STORY"
    );

  return (

    <section
      className="
        bg-white
        py-12
        md:h-[520px]
      "
    >

      <div
        className="
          container
          h-full
          grid
          md:grid-cols-2
          gap-10
          items-center
        "
      >


        {/* Image */}

        <div
          className="
            relative
            h-[360px]
            md:h-[420px]
            overflow-hidden
            rounded-3xl
            "
        >

          <StoreImage

            src={
                  brandStory?.image_url ??
                  "/images/brand-story.jpg"
                }

            alt="Bandhon Noors craftsmanship"

            fill
            
            priority

            sizes="(max-width: 768px) 100vw, 50vw"

            className="
                rounded-3xl
            "
          />

        </div>



        {/* Content */}

        <div
          className="
            max-w-md
          "
        >

          <p
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-rose-500
              mb-4
            "
          >
            Our Story
          </p>



          <h2
            className="
              text-3xl
              md:text-4xl
              font-semibold
              text-[#3F312B]
              leading-tight
              mb-5
            "
          >
            {
              brandStory?.title ??
              "Tradition Woven With Modern Elegance"
            }
          </h2>



          <p
            className="
              text-gray-600
              leading-7
              mb-6
            "
          >
            {
              brandStory?.description ??
              "Bandhon Noors brings together Bengali heritage and modern elegance through thoughtfully crafted traditional fashion."
            }
          </p>



          <Link
            href="/about"
            className="
              inline-flex
              px-7
              py-3
              rounded-full
             bg-[#D88C9A]
hover:bg-[#C97B89]
              text-white
              transition
            "
          >
            Discover Our Story
          </Link>


        </div>


      </div>


    </section>

  );

}

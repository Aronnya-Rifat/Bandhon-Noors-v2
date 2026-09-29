/**
 * Bandhon Noors Hero Section
 *
 * Main homepage banner.
 *
 * Contains:
 * - Brand message
 * - Call to action
 * - Fashion visual
 */


import Link from "next/link";
import { getHeroImages } from "@/services/homepage-service";
import HeroSlider from "./HeroSlider";


export default async function HeroSection() {
  const heroImages =
    await getHeroImages();
  
  const images =
    heroImages.length > 0
      ? heroImages
      : [
          "/images/hero-placeholder.jpg",
        ];

  return (

    <section
      className="
       bg-rose-50
        py-16
        md:py-24
      "
    >

      <div
        className="
          container
          grid
          md:grid-cols-2
          gap-12
          items-center
        "
      >


        {/* Text Content */}

        <div>

          <p
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-rose-500
              mb-5
            "
          >
            Bandhon Noors
          </p>


          <h1
            className="
              text-4xl
              md:text-6xl
              font-semibold
             text-[#3F312B]
              leading-tight
              mb-6
            "
          >
            Timeless Bengali
            <br />
            Elegance
          </h1>


          <p
            className="
              text-gray-600
              text-base
              md:text-lg
              max-w-md
              leading-7
              mb-8
            "
          >
            Discover premium traditional clothing
            designed with heritage, craftsmanship,
            and modern elegance.
          </p>



          <Link
            href="/collections"
            className="
              inline-flex
              items-center
              justify-center
             bg-[#D88C9A]
hover:bg-[#C97B89]
              text-white
              px-8
              py-3
              rounded-full
              transition
            "
          >
            Shop Collection
          </Link>


        </div>



        {/* Hero Image */}

        <div
          className="
            relative
            flex
            justify-center
          "
        >
          <HeroSlider
            images={images}
          />
        </div>

      </div>

    </section>

  );
}

/**
 * Bandhon Noors New Arrivals Section
 *
 * Homepage product showcase.
 */

import NewArrivalsSlider from "./NewArrivalsSlider";

import { getNewArrivals } from "@/services/product-service";

export default async function NewArrivals() {
  const products = await getNewArrivals();

  return (
    <section
      className="
        py-20
        bg-white
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
            Latest Collection
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
            New Arrivals
          </h2>
        </div>

       <NewArrivalsSlider
          products={products}
        />
      </div>
    </section>
  );
}

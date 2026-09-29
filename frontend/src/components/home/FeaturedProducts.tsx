/**
 * Bandhon Noors Featured Products
 *
 * Homepage highlighted products.
 *
 * Later connected with:
 * - Featured products API
 * - Admin selected products
 */

import Link from "next/link";

import FeaturedProductSlider from "./FeaturedProductSlider";

import { getFeaturedProducts } from "@/services/product-service";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

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
        {/* Heading */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-end
            md:justify-between
            mb-12
            gap-4
          "
        >
          <div>
            <p
              className="
                text-sm
                uppercase
                tracking-[0.3em]
                text-pink-400
              "
            >
              Our Selection
            </p>

            <h2
              className="
                text-3xl
                md:text-4xl
                font-semibold
                text-gray-800
                mt-3
              "
            >
              Featured Products
            </h2>
          </div>

          <Link
            href="/products"
            className="
              text-pink-500
              hover:text-pink-600
            "
          >
            View All Products →
          </Link>
        </div>

        {/* Products */}

        <FeaturedProductSlider
          products={products}
        />
      </div>
    </section>
  );
}

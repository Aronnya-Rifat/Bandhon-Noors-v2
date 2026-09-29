/**
 * Bandhon Noors Collection Section
 *
 * Used on:
 * /collections
 *
 * Displays:
 * - Collection title
 * - Product previews
 * - Link to full collection page
 */

import Link from "next/link";

import ProductCard from "@/components/product/ProductCard";

import type { Category } from "@/types/category";

import type { ProductCardProduct } from "@/types/product";

interface CollectionSectionProps {
  category: Category;

  products: ProductCardProduct[];
}

export default function CollectionSection({
  category,
  products,
}: CollectionSectionProps) {
  return (
    <section
      className="
        py-16
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
          mb-10
          gap-4
        "
      >
        <div>
          <p
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-rose-500
            "
          >
            Collection
          </p>

          <h2
            className="
              mt-3
              text-3xl
              md:text-4xl
              font-semibold
              text-[#3F312B]
            "
          >
            {category.name}
          </h2>
        </div>

        <Link
          href={`/products?category=${category.slug}`}
          className="
            text-pink-500
            hover:text-pink-600
            font-medium
          "
        >
          View Collection →
        </Link>
      </div>

      {/* Products */}

      {products.length === 0 ? (
        <p
          className="
              text-gray-500
            "
        >
          New products coming soon.
        </p>
      ) : (
        <div
          className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-6
            "
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

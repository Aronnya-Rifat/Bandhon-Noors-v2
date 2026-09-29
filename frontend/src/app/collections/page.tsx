/**
 * Bandhon Noors Collections Landing Page
 *
 * Displays main collections only.
 *
 * Example:
 * - Women
 * - Men
 * - Baby
 * - Jute Products
 * - Pearl Ornaments
 * - Miscellaneous
 *
 * Each section shows:
 * - 4 product previews
 * - Link to full collection page
 */

import CollectionSection from "@/components/collection/CollectionSection";

import { getMainCategories } from "@/services/category-service";

import { getCollectionPreviewProducts } from "@/services/product-service";

export default async function CollectionsPage() {
  const categories = (
      await getMainCategories()
    ).sort(
      (firstCategory, secondCategory) =>
        firstCategory.id -
        secondCategory.id,
    );

  const collections = await Promise.all(
    categories.map(async (category) => ({
      category,

      products: await getCollectionPreviewProducts(category.id),
    })),
  );

  return (
    <main
      className="
        container
        py-16
      "
    >
      {/* Page Header */}

      <div
        className="
          mb-16
          text-center
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
          Explore
        </p>

        <h1
          className="
            mt-3
            text-4xl
            md:text-5xl
            font-semibold
            text-[#3F312B]
          "
        >
          Our Collections
        </h1>

        <p
          className="
            mt-4
            text-gray-600
            max-w-xl
            mx-auto
          "
        >
          Discover our carefully curated collections inspired by tradition,
          craftsmanship, and modern elegance.
        </p>
      </div>

      {/* Collection Sections */}

      {collections.map(({ category, products }) => (
        <CollectionSection
          key={category.id}
          category={category}
          products={products}
        />
      ))}
    </main>
  );
}

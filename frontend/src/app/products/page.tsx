/**
 * Bandhon Noors Products Page
 *
 * Main ecommerce catalogue.
 *
 * Handles:
 * - All products
 * - Category filtering
 * - Subcategory filtering
 * - Search
 */

import ProductListing from "@/components/product/ProductListing";

import { getProducts } from "@/services/product-service";

import { getCategories } from "@/services/category-service";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    query?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const category = params.category;

  const subcategory = params.subcategory;

  const query = params.query;

  const sort = params.sort;

  const products = await getProducts({
    category,

    subcategory,

    query,

    sort,
  });

  const categories = await getCategories();

  return (
    <main
      className="
        container
        py-16
      "
    >
      <div
        className="
          mb-12
        "
      >
        <p
          className="
            uppercase
            tracking-[0.3em]
            text-sm
            text-rose-500
          "
        >
          Shop
        </p>

        <h1
          className="
            mt-3
            text-4xl
            font-semibold
            text-[#3F312B]
          "
        >
          {subcategory
            ? `${subcategory} Collection`
            : category
              ? `${category} Collection`
              : "All Products"}
        </h1>
      </div>

      <ProductListing
        products={products}
        categories={categories}
        selectedCategory={category ?? ""}
        selectedSubcategory={subcategory ?? ""}
        layout="catalogue"
      />
    </main>
  );
}

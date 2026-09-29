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

import {
  getProductFilterOptions,
  getProducts,
} from "@/services/product-service";

import { getCategories } from "@/services/category-service";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    query?: string;
    sort?: string;
    size?: string;
    color?: string;
    page?: string;
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

  const categoriesWithSizes = new Set(["women", "men", "baby"]);

  const size =
    category && categoriesWithSizes.has(category) ? params.size : undefined;

  const color = params.color;

  const requestedPage = Number(params.page);

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const [productPage, categories, filterOptions] = await Promise.all([
    getProducts({
      category,
      subcategory,
      query,
      sort,
      size,
      color,
      page,
    }),
    getCategories(),
    getProductFilterOptions(),
  ]);
  const selectedCategoryData = categories.find(
    (item) => item.parent_id === null && item.slug === category,
  );

  const selectedSubcategoryData = categories.find(
    (item) => item.parent_id !== null && item.slug === subcategory,
  );

  const collectionName =
    selectedSubcategoryData?.name ?? selectedCategoryData?.name;
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
          {query
            ? `Search results for “${query}”`
            : collectionName
              ? `${collectionName} Collections`
              : "All Products"}
        </h1>
      </div>

      <ProductListing
        products={productPage.items}
        currentPage={productPage.page}
        totalPages={productPage.total_pages}
        totalProducts={productPage.total}
        categories={categories}
        selectedCategory={category ?? ""}
        selectedSubcategory={subcategory ?? ""}
        initialSearch={query ?? ""}
        selectedSort={sort ?? ""}
        selectedSize={size ?? ""}
        selectedColor={color ?? ""}
        layout="catalogue"
        availableSizes={filterOptions.sizes}
        availableColors={filterOptions.colors}
      />
    </main>
  );
}

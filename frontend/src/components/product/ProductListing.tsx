/**
 * Bandhon Noors Product Listing
 *
 * Handles:
 * - Product grid
 * - Search
 * - Sorting
 * - Filtering
 *
 * Future:
 * - Backend filtering
 * - Pagination
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import ProductToolbar from "@/components/product/ProductToolbar";
import ProductFilters from "@/components/product/ProductFilters";

import type { ProductCardProduct } from "@/types/product";

interface ProductListingProps {
  products: ProductCardProduct[];

  categories: {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
  }[];

  selectedCategory: string;
    
  selectedSubcategory: string;

  initialSearch?: string;

  selectedSort?: string;

  selectedSize?: string;

  selectedColor?: string;

  layout?: "collection" | "catalogue";
}
export default function ProductListing({
  products,

  categories,

  selectedCategory,

  selectedSubcategory,

  initialSearch = "",

  selectedSort = "",

  selectedSize = "",

  selectedColor = "",

  layout = "collection",
}: ProductListingProps) {
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);
 
  const router = useRouter();

  function navigateToProducts(
    overrides: {
      category?: string;
      subcategory?: string;
      query?: string;
      sort?: string;
      size?: string;
      color?: string;
    } = {},
  ) {
    const category = overrides.category ?? selectedCategory;
    const subcategory = overrides.subcategory ?? selectedSubcategory;
    const query = overrides.query ?? initialSearch;
    const sort = overrides.sort ?? selectedSort;
    const size = overrides.size ?? selectedSize;
    const color = overrides.color ?? selectedColor;

    const searchParams = new URLSearchParams();

    if (category) {
      searchParams.set("category", category);
    }

    if (subcategory) {
      searchParams.set("subcategory", subcategory);
    }

    if (query.trim()) {
      searchParams.set("query", query.trim());
    }

    if (sort) {
      searchParams.set("sort", sort);
    }

    if (size) {
      searchParams.set("size", size);
    }

    if (color) {
      searchParams.set("color", color);
    }

    const queryString = searchParams.toString();

    router.push(
      queryString
        ? `/products?${queryString}`
        : "/products",
    );
  }

  function changeCategory(value: string) {
    navigateToProducts({
      category: value,
      subcategory: "",
    });
  }
  function changeSize(value: string) {
    navigateToProducts({
      size: value,
    });
  }

  function changeColor(value: string) {
    navigateToProducts({
      color: value,
    });
  }
  function changeSubcategory(value: string) {
    navigateToProducts({
      subcategory: value,
    });
  }

  function submitSearch() {
    navigateToProducts({
      query: search,
    });
  }

  function changeSort(value: string) {
    navigateToProducts({
      sort: value,
    });
  }
  const [showFilters, setShowFilters] = useState(false);
  return (
    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-4
        gap-8
      "
    >
      <div
        className="
          hidden
          lg:block
          lg:col-span-1
        "
      >
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onCategoryChange={changeCategory}
          onSubcategoryChange={changeSubcategory}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          onSizeChange={changeSize}
          onColorChange={changeColor}
        />
      </div>

      <div
        className="
          lg:col-span-3
        "
      >
         <ProductToolbar
          search={search}
          sort={selectedSort}
          onSearchChange={setSearch}
          onSearchSubmit={submitSearch}
          onSortChange={changeSort}
          onFilterClick={() => setShowFilters(true)}
        />

          {products.length === 0 ? (
          <p
            className="
                text-gray-500
              "
          >
            No products found.
          </p>
        ) : (
          <div
            className={
              layout === "catalogue"
                ? `
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  lg:grid-cols-5
                  xl:grid-cols-6
                  gap-4
                `
                : `
                  grid
                  grid-cols-2
                  md:grid-cols-4
                  gap-6
                `
            }
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {showFilters && (
        <div
          className="
  fixed
  inset-0
  z-50
  lg:hidden
 "
        >
          <div
            className="
  absolute
  inset-0
  bg-black/30
 "
            onClick={() => setShowFilters(false)}
          />

          <div
            className="
  absolute
  right-0
  top-0
  h-full
  w-80
  bg-white
  p-6
  overflow-y-auto
 "
          >
            <div
              className="
 flex
 justify-between
 mb-6
 "
            >
              <h2
                className="
 font-semibold
 text-lg
 "
              >
                Filters
              </h2>

              <button onClick={() => setShowFilters(false)}>✕</button>
            </div>

            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onCategoryChange={changeCategory}
              onSubcategoryChange={changeSubcategory}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={changeSize}
              onColorChange={changeColor}
            />
          </div>
        </div>
      )}
    </div>
  );
}

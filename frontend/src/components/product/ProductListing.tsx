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

import { useState } from "react";
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

  layout?: "collection" | "catalogue";
}
export default function ProductListing({
  products,

  categories,

  selectedCategory,

  selectedSubcategory,

  layout = "collection",
}: ProductListingProps) {
  const [search, setSearch] = useState("");

  const [sortType, setSortType] = useState("");

  const [selectedSize, setSelectedSize] = useState("");

  const [selectedColor, setSelectedColor] = useState("");

  const router = useRouter();
  function changeCategory(value: string) {
    if (!value) {
      router.push("/products");

      return;
    }

    router.push(`/products?category=${value}`);
  }

  function changeSubcategory(value: string) {
    router.push(`/products?category=${selectedCategory}&subcategory=${value}`);
  }
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesSearch;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortType === "price-low") {
      return a.price - b.price;
    }

    if (sortType === "price-high") {
      return b.price - a.price;
    }

    return 0;
  });
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
          onSizeChange={setSelectedSize}
          onColorChange={setSelectedColor}
        />
      </div>

      <div
        className="
          lg:col-span-3
        "
      >
        <ProductToolbar
          search={search}
          onSearchChange={setSearch}
          onSortChange={setSortType}
          onFilterClick={() => setShowFilters(true)}
        />

        {sortedProducts.length === 0 ? (
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
            {sortedProducts.map((product) => (
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
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
            />
          </div>
        </div>
      )}
    </div>
  );
}

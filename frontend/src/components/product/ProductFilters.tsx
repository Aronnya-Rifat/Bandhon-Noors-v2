/**
 * Bandhon Noors Product Filters
 *
 * Handles:
 * - Category hierarchy
 * - Subcategory navigation
 * - Size
 * - Color
 */

"use client";

import { useEffect, useState } from "react";

interface Category {
  id: number;

  name: string;

  slug: string;

  parent_id: number | null;
}

interface ProductFiltersProps {
  categories: Category[];

  selectedCategory: string;

  selectedSubcategory: string;

  onCategoryChange: (value: string) => void;

  onSubcategoryChange: (value: string) => void;

  selectedSize: string;

  selectedColor: string;

  onSizeChange: (value: string) => void;

  onColorChange: (value: string) => void;
  sizes: string[];

  colors: string[];
}

export default function ProductFilters({
  categories,

  selectedCategory,

  selectedSubcategory,

  onCategoryChange,

  onSubcategoryChange,

  selectedSize,

  selectedColor,

  onSizeChange,

  onColorChange,
  sizes,

  colors,
}: ProductFiltersProps) {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  useEffect(() => {
    const activeMainCategory = categories.find(
      (category) =>
        category.parent_id === null && category.slug === selectedCategory,
    );

    setExpandedCategory(activeMainCategory?.id ?? null);
  }, [categories, selectedCategory]);

  const mainCategories = categories

    .filter((category) => category.parent_id === null)

    .sort((a, b) => a.id - b.id);

  function getSubCategories(parentId: number) {
    return categories

      .filter((category) => category.parent_id === parentId)

      .sort((a, b) => a.id - b.id);
  }

  function handleMainCategory(slug: string) {
    onCategoryChange(slug);
  }

  function handleSubCategory(subSlug: string) {
    onSubcategoryChange(subSlug);
  }

  return (
    <aside
      className="
        border
        border-pink-100
        rounded-2xl
        p-6
        space-y-8
      "
    >
      {/* CATEGORY TREE */}

      <div>
        <h3
          className="
            font-medium
            text-gray-800
          "
        >
          Category
        </h3>

        <div
          className="
            mt-4
            space-y-4
          "
        >
          <button
            onClick={() => onCategoryChange("")}
            className="
              text-left
              text-gray-600
            "
          >
            All Products
          </button>

          {mainCategories.map((main) => {
            const subCategories = getSubCategories(main.id);

            const isOpen = expandedCategory === main.id;

            return (
              <div
                key={main.id}
                className="
            space-y-2
          "
              >
                <button
                  onClick={() => {
                    setExpandedCategory(isOpen ? null : main.id);

                    handleMainCategory(main.slug);
                  }}
                  className={`
              flex
              items-center
              justify-between
              w-full
              text-left
              font-medium

              ${
                selectedCategory === main.slug
                  ? "text-pink-500"
                  : "text-gray-700"
              }
            `}
                >
                  <span>{main.name}</span>

                  <span>{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div
                    className="
                  ml-5
                  space-y-2
                "
                  >
                    {subCategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSubCategory(sub.slug)}
                        className={`
                          block
                          text-sm
                          text-left

                          ${
                            selectedSubcategory === sub.slug
                              ? "text-pink-500"
                              : "text-gray-500"
                          }
                        `}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SIZE */}

      {sizes.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-800">Size</h3>

          <div className="mt-4 space-y-3">
            <label className="flex gap-3 text-gray-600">
              <input
                type="radio"
                checked={selectedSize === ""}
                onChange={() => onSizeChange("")}
              />
              All sizes
            </label>

            {sizes.map((size) => (
              <label key={size} className="flex gap-3 text-gray-600">
                <input
                  type="radio"
                  checked={selectedSize === size}
                  onChange={() => onSizeChange(size)}
                />

                {size}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* COLOR */}

      <div>
        <h3
          className="
            font-medium
            text-gray-800
          "
        >
          Color
        </h3>

        <div
          className="
            mt-4
            space-y-3
          "
        >
          {" "}
          <label
            className="
              flex
              gap-3
              text-gray-600
            "
          >
            <input
              type="radio"
              checked={selectedColor === ""}
              onChange={() => onColorChange("")}
            />
            All colors
          </label>
          {colors.map((color) => (
            <label
              key={color}
              className="
                    flex
                    gap-3
                    text-gray-600
                  "
            >
              <input
                type="radio"
                checked={selectedColor === color}
                onChange={() => onColorChange(color)}
              />

              {color}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

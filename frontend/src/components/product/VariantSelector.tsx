/**
 * Bandhon Noors Variant Selector
 *
 * Handles product options:
 *
 * - Color
 * - Size
 *
 * Future:
 * - Stock validation
 * - Price changes
 * - Variant images
 */


"use client";



import type { ProductVariant } from "@/types/product";


interface VariantSelectorProps {

  variants: ProductVariant[];

  selectedVariant: ProductVariant;

  onSelect: (
    variant: ProductVariant
  ) => void;

}



export default function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  const colors = Array.from(
    new Set(
      variants
        .map((variant) => variant.color_theme)
        .filter(
          (color): color is string =>
            Boolean(color),
        ),
    ),
  );

  const sizes = Array.from(
    new Set(
      variants
        .filter(
          (variant) =>
            selectedVariant.color_theme === null ||
            variant.color_theme === selectedVariant.color_theme,
        )
        .map((variant) => variant.size)
        .filter(
          (size): size is string =>
            Boolean(size),
        ),
    ),
  );

  function selectColor(color: string) {
    const matchingVariant =
      variants.find(
        (variant) =>
          variant.color_theme === color &&
          variant.size === selectedVariant.size &&
          variant.stock_quantity > 0,
      ) ??
      variants.find(
        (variant) =>
          variant.color_theme === color &&
          variant.stock_quantity > 0,
      );

    if (matchingVariant) {
      onSelect(matchingVariant);
    }
  }

  function selectSize(size: string) {
    const matchingVariant =
      variants.find(
        (variant) =>
          variant.size === size &&
          variant.color_theme === selectedVariant.color_theme &&
          variant.stock_quantity > 0,
      ) ??
      variants.find(
        (variant) =>
          variant.size === size &&
          variant.stock_quantity > 0,
      );

    if (matchingVariant) {
      onSelect(matchingVariant);
    }
  }

  return (
    <div
      className="
        mt-8
        space-y-6
      "
    >
      {colors.length > 0 && (
        <div>
          <h3
            className="
              text-sm
              font-medium
              text-gray-800
            "
          >
            Color
          </h3>

          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-3
            "
          >
            {colors.map((color) => {
              const isAvailable = variants.some(
                (variant) =>
                  variant.color_theme === color &&
                  variant.stock_quantity > 0,
              );

              return (
                <button
                  key={color}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => selectColor(color)}
                  className={`
                    rounded-full
                    border
                    px-4
                    py-2
                    transition

                    ${
                      selectedVariant.color_theme === color
                        ? "border-pink-400 bg-pink-400 text-white"
                        : "border-pink-200 text-gray-700"
                    }

                    ${
                      isAvailable
                        ? ""
                        : "cursor-not-allowed opacity-40"
                    }
                  `}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <h3
            className="
              text-sm
              font-medium
              text-gray-800
            "
          >
            Size
          </h3>

          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-3
            "
          >
            {sizes.map((size) => {
              const isAvailable = variants.some(
                (variant) =>
                  variant.size === size &&
                  (
                    selectedVariant.color_theme === null ||
                    variant.color_theme === selectedVariant.color_theme
                  ) &&
                  variant.stock_quantity > 0,
              );

              return (
                <button
                  key={size}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => selectSize(size)}
                  className={`
                    rounded-full
                    border
                    px-4
                    py-2
                    transition

                    ${
                      selectedVariant.size === size
                        ? "border-pink-400 bg-pink-400 text-white"
                        : "border-pink-200 text-gray-700"
                    }

                    ${
                      isAvailable
                        ? ""
                        : "cursor-not-allowed opacity-40"
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">
        {selectedVariant.stock_quantity} available
      </p>
    </div>
  );
}

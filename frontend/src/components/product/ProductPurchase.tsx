/**
 * Bandhon Noors Product Purchase Section
 *
 * Handles:
 * - Variant selection
 * - Add to cart action
 */

"use client";

import { useState } from "react";

import VariantSelector from "@/components/product/VariantSelector";
import AddToCartButton from "@/components/cart/AddToCartButton";

import type { ProductDetail, ProductVariant } from "@/types/product";

interface ProductPurchaseProps {
  product: ProductDetail;

  variants: ProductVariant[];
}

export default function ProductPurchase({
  variants,
  product,
}: ProductPurchaseProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    () => variants.find((variant) => variant.stock_quantity > 0) ?? null,
  );
  if (selectedVariant === null) {
    return (
      <div
        className="
          mt-8
          rounded-xl
          bg-gray-50
          px-5
          py-4
          text-sm
          text-gray-600
        "
      >
        This product is currently unavailable.
      </div>
    );
  }
  return (
    <>
      {product.has_variants ? (
        <VariantSelector
          variants={variants}
          selectedVariant={selectedVariant}
          onSelect={setSelectedVariant}
        />
      ) : (
        <div className="mt-8">
          <p
            className={
              selectedVariant.stock_quantity <= 5
                ? "text-sm font-medium text-orange-600"
                : "text-sm text-gray-500"
            }
          >
            {selectedVariant.stock_quantity} available
          </p>
        </div>
      )}

      <AddToCartButton product={product} variant={selectedVariant} />
    </>
  );
}

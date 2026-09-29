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

import type {
  ProductDetail,
  ProductVariant,
} from "@/types/product";


interface ProductPurchaseProps {

  product: ProductDetail;

  variants: ProductVariant[];

}



export default function ProductPurchase({
  variants,
  product,
}: ProductPurchaseProps) {


  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant>(
      variants[0]
    );


  return (

    <>

      <VariantSelector
        variants={variants}
        selectedVariant={selectedVariant}
        onSelect={setSelectedVariant}
      />


      <AddToCartButton

        product={product}

        variant={selectedVariant}
      />

    </>

  );

}

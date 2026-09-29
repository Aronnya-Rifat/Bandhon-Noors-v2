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


import { useState } from "react";

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


  



  return (

    <div
      className="
        mt-8
        space-y-6
      "
    >


      {/* Colors */}

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
            flex
            gap-3
            mt-3
            flex-wrap
          "
        >

          {
            variants.map(
              (variant) => (

                <button

                  key={variant.id}

                  onClick={() =>
                    onSelect(variant)
                  }

                  className={`
                    px-4
                    py-2
                    rounded-full
                    border
                    transition

                    ${
                      selectedVariant.id === variant.id
                        ? "bg-pink-400 text-white border-pink-400"
                        : "border-pink-200 text-gray-700"
                    }
                  `}

                >

                  {variant.color_theme}

                </button>

              )
            )
          }

        </div>

      </div>



      {/* Size */}

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
            flex
            gap-3
            mt-3
            flex-wrap
          "
        >

          {
            variants.map(
              (variant) => (

                <button

                  key={variant.id}

                  className="
                    px-4
                    py-2
                    rounded-full
                    border
                    border-pink-200
                    text-gray-700
                  "

                >

                  {variant.size}

                </button>

              )
            )
          }

        </div>

      </div>



    </div>

  );

}

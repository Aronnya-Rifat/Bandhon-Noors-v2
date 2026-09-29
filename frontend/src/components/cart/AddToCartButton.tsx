/**
 * Bandhon Noors Add To Cart Button
 *
 * Handles:
 * - Selected variant
 * - Quantity
 * - Cart action
 *
 * Future:
 * Connect with backend:
 * POST /cart/items
 */


"use client";


import { useState } from "react";

import type {
  ProductDetail,
  ProductVariant,
} from "@/types/product";
import { useCartStore } from "@/store/cart-store";


interface AddToCartButtonProps {

  product: ProductDetail;

  variant: ProductVariant;

}



export default function AddToCartButton({ 
  product,
  variant,
}: AddToCartButtonProps) {


  const [quantity, setQuantity] =
    useState(1);
  
  const addItem =
  useCartStore(
    (state) => state.addItem
  );


  function handleAddToCart() {


    addItem({

    id: Date.now(),

    quantity,

    product: {

        id: product.id,

        product_code:
        product.product_code,

        name:
        product.name,

        price:
        product.price,

    },


    variant: {

        id:
        variant.id,

        variant_code:
        `VAR-${variant.id}`,

        color_theme:
        variant.color_theme,

        size:
        variant.size,

        stock_quantity:
        variant.stock_quantity,

    },

});


    /*
      Later:

      cartContext.addItem({
        variant_id: variant.id,
        quantity
      })

    */

  }



  return (

    <div
      className="
        mt-8
      "
    >


      {/* Quantity */}

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <button
          onClick={() =>
            setQuantity(
              Math.max(
                1,
                quantity - 1
              )
            )
          }
          className="
            w-10
            h-10
            rounded-full
            border
            border-pink-200
          "
        >
          -
        </button>


        <span>
          {quantity}
        </span>


        <button
          onClick={() =>
            setQuantity(
              quantity + 1
            )
          }
          className="
            w-10
            h-10
            rounded-full
            border
            border-pink-200
          "
        >
          +
        </button>


      </div>



      {/* Button */}

      <button
        onClick={handleAddToCart}
        className="
          mt-6
          w-full
          px-10
          py-3
          rounded-full
         bg-[#D88C9A]
          text-white
          hover:bg-[#C97B89]
          transition
        "
      >

        Add to Cart

      </button>


    </div>

  );

}

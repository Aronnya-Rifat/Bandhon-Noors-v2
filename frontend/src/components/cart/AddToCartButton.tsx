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

import { useEffect, useState } from "react";

import type {
  ProductDetail,
  ProductVariant,
} from "@/types/product";
import { useCartActions } from "@/hooks/use-cart-actions";
import { formatCurrency } from "@/lib/utils";


interface AddToCartButtonProps {

  product: ProductDetail;

  variant: ProductVariant;

}



export default function AddToCartButton({ 
  product,
  variant,
}: AddToCartButtonProps) {

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity((currentQuantity) =>
      Math.min(
        Math.max(currentQuantity, 1),
        variant.stock_quantity,
      ),
    );
  }, [variant.id, variant.stock_quantity]);

  const additionalPrice =
    variant.additional_price ?? 0;

  const unitPrice =
    product.price + additionalPrice;
  
  const {
    addItem,
    error,
    isWorking,
  } = useCartActions();

  async function handleAddToCart() {
    if (
      quantity < 1 ||
      quantity > variant.stock_quantity
    ) {
      return;
    }

    await addItem({
      id: Date.now(),
      quantity,
      product: {
        id: product.id,
        product_code: product.product_code,
        name: product.name,
        price: unitPrice,
      },
      variant: {
        id: variant.id,
        variant_code: variant.variant_code,
        color_theme: variant.color_theme,
        size: variant.size,
        stock_quantity: variant.stock_quantity,
        additional_price: additionalPrice,
      },
    });
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
          type="button"
          aria-label="Decrease quantity"
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
          type="button"
          disabled={quantity >= variant.stock_quantity}
          onClick={() =>
            setQuantity((currentQuantity) =>
              Math.min(
                currentQuantity + 1,
                variant.stock_quantity,
              ),
            )
          }
          className="
            w-10
            h-10
            rounded-full
            border
            border-pink-200
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          aria-label="Increase quantity"
        >
          +
        </button>


      </div>



      {/* Button */}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={
          isWorking ||
          variant.stock_quantity === 0 ||
          quantity > variant.stock_quantity
        }
        className="
          mt-6
          w-full
          rounded-full
          bg-[#D88C9A]
          px-10
          py-3
          text-white
          transition
          hover:bg-[#C97B89]
          disabled:cursor-not-allowed
          disabled:bg-gray-300
        "
      >
       {isWorking
        ? "Adding..."
        : `Add to Cart — ${formatCurrency(
            unitPrice * quantity,
          )}`}
      </button>
      {error && (
        <p
          role="alert"
          className="mt-3 text-sm text-red-600"
        >
          {error}
        </p>
      )}

    </div>

  );

}

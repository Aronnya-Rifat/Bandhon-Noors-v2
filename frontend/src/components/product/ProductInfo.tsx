/**
 * Bandhon Noors Product Information
 *
 * Displays:
 * - Product name
 * - Price
 * - Description
 * - Basic purchase action
 *
 * Future:
 * - Reviews
 * - Stock status
 * - Variant selector
 * - Wishlist
 */
"use client";

import { Heart } from "lucide-react";

import { useWishlistStore } from "@/store/wishlist-store";
import type { ProductDetail } from "@/types/product";


interface ProductInfoProps {

  product: ProductDetail;

}



export default function ProductInfo({
  product,
}: ProductInfoProps) {
  const addItem =
    useWishlistStore(
      (state) => state.addItem
    );


  const wishlistItems =
    useWishlistStore(
      (state) => state.items
    );


  const isSaved =
    wishlistItems.some(
      (item) =>
        item.product_id === product.id
    );

  return (

    <div>


      {/* Product Name */}

      <h1
        className="
          text-3xl
          md:text-4xl
          font-semibold
          text-[#3F312B]
        "
      >

        {product.name}

      </h1>



      {/* Price */}

      <p
        className="
          mt-4
          text-2xl
          font-semibold
          text-pink-500
        "
      >

        ৳{product.price}

      </p>



      {/* Description */}

      <p
        className="
          mt-6
          text-gray-600
          leading-7
        "
      >

        {product.description}

      </p>
      <div
        className="
            mt-6
            text-sm
            text-gray-600
        "
        >

        <p className="font-medium text-gray-800">
            Size:
        </p>

        <p>
            {product.size_chart}
        </p>
        <button

  onClick={() =>

    addItem({

      id: Date.now(),

      product_id: product.id,

      name: product.name,

      price: product.price,

      image: product.thumbnail_url,

    })

  }

  className="
    mt-8
    flex
    items-center
    gap-2
    text-sm
    text-rose-500
  "

>

  <Heart
    size={20}
    fill={
      isSaved
        ? "currentColor"
        : "none"
    }
  />

  {
    isSaved
      ? "Saved"
      : "Add to Wishlist"
  }

</button>
      </div>



    </div>

  );

}

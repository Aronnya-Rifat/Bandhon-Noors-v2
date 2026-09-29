/**
 * Bandhon Noors Product Card
 *
 * Reusable product display component.
 *
 * Used in:
 * - Homepage
 * - Category pages
 * - Search
 *
 * Handles:
 * - Product image
 * - Product name
 * - Price
 * - Wishlist action
 */

"use client";

import Link from "next/link";

import { Heart } from "lucide-react";

import StoreImage from "@/components/ui/StoreImage";

import type { ProductCardProduct } from "@/types/product";

import { useWishlistStore } from "@/store/wishlist-store";

interface ProductCardProps {
  product: ProductCardProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useWishlistStore((state) => state.addItem);

  const removeItem = useWishlistStore((state) => state.removeItem);

  const wishlistItems = useWishlistStore((state) => state.items);

  const isSaved = wishlistItems.some((item) => item.product_id === product.id);

  function handleWishlist(event: React.MouseEvent) {
    event.preventDefault();

    if (isSaved) {
      removeItem(product.id);

      return;
    }

    addItem({
      id: Date.now(),

      product_id: product.id,

      name: product.name,

      price: product.price,

      image: product.thumbnail_url ?? "/images/products/placeholder.jpg",
    });
  }

  return (
    <div
      className="
        relative
      "
    >
      {/* Wishlist Button */}

      <button
        onClick={handleWishlist}
        className="
          absolute
          top-3
          right-3
          z-10
          w-9
          h-9
          rounded-full
          bg-white
          flex
          items-center
          justify-center
          shadow-sm
          text-rose-500
        "
        aria-label="Add to wishlist"
      >
        <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
      </button>

      {/* Product Link */}

      <Link
        href={`/product/${product.id}`}
        className="
          group
        "
      >
        <div
          className="
            overflow-hidden
            rounded-2xl
            bg-pink-50
            aspect-square
          "
        >
          <StoreImage
            src={product.thumbnail_url ?? "/images/products/placeholder.jpg"}
            alt={product.name}
            width={500}
            height={500}
            className="
              w-full
              h-full
              group-hover:scale-105
              transition-transform
              duration-700
            "
          />
        </div>

        <div
          className="
            mt-4
          "
        >
          <h3
            className="
              text-gray-800
              font-medium
              group-hover:text-[#D88C9A]
              transition
            "
          >
            {product.name}
          </h3>

          <p
            className="
              text-pink-500
              mt-2
            "
          >
            ৳{product.price}
          </p>
        </div>
      </Link>
    </div>
  );
}

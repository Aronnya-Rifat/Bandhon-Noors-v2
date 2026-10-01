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
import { formatCurrency } from "@/lib/utils";
import type { ProductCardProduct } from "@/types/product";
import {
  addCustomerWishlistItem,
  removeCustomerWishlistItem,
} from "@/services/wishlist-service";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";

interface ProductCardProps {
  product: ProductCardProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useWishlistStore((state) => state.addItem);
  const token = useAuthStore((state) => state.token);

  const user = useAuthStore((state) => state.user);

  const setItems = useWishlistStore((state) => state.setItems);
  const removeItem = useWishlistStore((state) => state.removeItem);

  const wishlistItems = useWishlistStore((state) => state.items);

  const isSaved = wishlistItems.some((item) => item.product_id === product.id);
  const productImage = product.thumbnail_url ?? "/logo.png";
  async function handleWishlist(event: React.MouseEvent) {
    event.preventDefault();

    if (isSaved) {
      removeItem(product.id);
      if (token && user?.role === "CUSTOMER") {
        const result = await removeCustomerWishlistItem(token, product.id);

        setItems(result.items);
      }

      return;
    }

    addItem({
      id: Date.now(),

      product_id: product.id,

      name: product.name,

      price: product.price,

      image: productImage,
    });
    if (token && user?.role === "CUSTOMER") {
      const result = await addCustomerWishlistItem(token, product.id);

      setItems(result.items);
    }
  }

  return (
    <div
      className="
        relative
      "
    >
      {/* Wishlist Button */}

      <button
        type="button"
        onClick={(event) => {
          void handleWishlist(event);
        }}
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
        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
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
            aspect-[4/5]
          "
        >
          <StoreImage
            src={productImage}
            alt={product.name}
            width={400}
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
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
    </div>
  );
}

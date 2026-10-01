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
import {
  addCustomerWishlistItem,
  removeCustomerWishlistItem,
} from "@/services/wishlist-service";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { ProductDetail } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

interface ProductInfoProps {
  product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const addItem = useWishlistStore((state) => state.addItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const token = useAuthStore((state) => state.token);

  const user = useAuthStore((state) => state.user);

  const setItems = useWishlistStore((state) => state.setItems);
  const wishlistItems = useWishlistStore((state) => state.items);

  const isSaved = wishlistItems.some((item) => item.product_id === product.id);
  async function handleWishlist() {
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
      image: product.thumbnail_url ?? "/logo.png",
    });
    if (token && user?.role === "CUSTOMER") {
      const result = await addCustomerWishlistItem(token, product.id);

      setItems(result.items);
    }
  }
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
        {formatCurrency(product.price)}
      </p>

      {/* Description */}

      {product.description && (
        <p
          className="
      mt-6
      text-gray-600
      leading-7
    "
        >
          {product.description}
        </p>
      )}
      {product.size_chart && (
        <div
          className="
      mt-6
      text-sm
      text-gray-600
    "
        >
          <p className="font-medium text-gray-800">Size guide:</p>

          <p className="mt-1 whitespace-pre-line">{product.size_chart}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          void handleWishlist();
        }}
        className="
    mt-8
    flex
    items-center
    gap-2
    text-sm
    text-rose-500
  "
        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={20} fill={isSaved ? "currentColor" : "none"} />

        {isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
}

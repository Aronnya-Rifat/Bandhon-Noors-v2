/**
 * Bandhon Noors Wishlist Page
 *
 * Customer saved products.
 *
 * Future:
 * - Backend wishlist API
 * - User account sync
 */

"use client";

import Link from "next/link";

import StoreImage from "@/components/ui/StoreImage";

import { useWishlistStore } from "@/store/wishlist-store";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);

  const removeItem = useWishlistStore((state) => state.removeItem);

  return (
    <main
      className="
        container
        py-16
      "
    >
      <h1
        className="
          text-3xl
          font-semibold
          text-[#3F312B]
        "
      >
        Wishlist
      </h1>

      {items.length === 0 ? (
        <p
          className="
              mt-8
              text-gray-500
            "
        >
          Your wishlist is empty.
        </p>
      ) : (
        <div
          className="
              mt-10
              grid
              grid-cols-2
              md:grid-cols-4
              gap-6
            "
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="
                      relative
                    "
            >
              <Link
                href={`/products/${item.product_id}`}
                className="
                        group
                      "
              >
                <div
                  className="
                          aspect-square
                          overflow-hidden
                          rounded-2xl
                          bg-pink-50
                        "
                >
                  <StoreImage
                    src={item.image}
                    alt={item.name}
                    width={500}
                    height={500}
                    className="
                            w-full
                            h-full
                            object-cover
                            group-hover:scale-105
                            transition-transform
                            duration-700
                          "
                  />
                </div>

                <h2
                  className="
                          mt-4
                          font-medium
                          text-gray-800
                          group-hover:text-[#D88C9A]
                          transition
                        "
                >
                  {item.name}
                </h2>

                <p
                  className="
                          mt-2
                          text-pink-500
                        "
                >
                  ৳{item.price}
                </p>
              </Link>

              <button
                onClick={() => removeItem(item.id)}
                className="
                        mt-3
                        text-sm
                        text-rose-500
                      "
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

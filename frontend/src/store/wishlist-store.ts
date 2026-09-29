/**
 * Bandhon Noors Wishlist Store
 *
 * Handles:
 * - Add wishlist item
 * - Remove wishlist item
 * - Clear wishlist
 *
 * Future:
 * Backend synchronization
 */

import { create } from "zustand";

import { persist } from "zustand/middleware";

import type { WishlistItem } from "@/types/wishlist";

interface WishlistStore {
  items: WishlistItem[];

  addItem: (item: WishlistItem) => void;

  removeItem: (id: number) => void;

  clearWishlist: () => void;
}

export const useWishlistStore =
create<WishlistStore>()(
  persist(

    (set) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearWishlist: () =>
    set({
      items: [],
    }),
    }),

    {
      name: "bandhon-noors-wishlist",
    }

  )
);

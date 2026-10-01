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

  removeItem: (productId: number) => void;

  clearWishlist: () => void;

  resetWishlist: () => void;

  setItems: (
    items: WishlistItem[],
  ) => void;

  syncedCustomerId:
    number | null;

  setSyncedCustomerId: (
    customerId: number | null,
  ) => void;
}

export const useWishlistStore =
create<WishlistStore>()(
  persist(

    (set) => ({
  items: [],
  syncedCustomerId: null,

  setItems: (items) =>
    set({
      items,
    }),

  setSyncedCustomerId: (
    customerId,
  ) =>
    set({
      syncedCustomerId:
        customerId,
    }),
resetWishlist: () =>
  set({
    items: [],
    syncedCustomerId: null,
  }),   
addItem: (item) =>
  set((state) => {
    const alreadyExists = state.items.some(
      (wishlistItem) =>
        wishlistItem.product_id === item.product_id,
    );

    if (alreadyExists) {
      return {
        items: state.items.map((wishlistItem) =>
          wishlistItem.product_id === item.product_id
            ? {
                ...wishlistItem,
                ...item,
                id: wishlistItem.id,
              }
            : wishlistItem,
        ),
      };
    }

    return {
      items: [...state.items, item],
    };
  }),

removeItem: (productId) =>
  set((state) => ({
    items: state.items.filter(
      (item) => item.product_id !== productId,
    ),
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

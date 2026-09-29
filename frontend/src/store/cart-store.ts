/**
 * Bandhon Noors Cart Store
 *
 * Global cart state management.
 *
 * Handles:
 * - Cart drawer open/close
 * - Cart items
 *
 * Backend synchronization
 * will be added later.
 */

import { create } from "zustand";

import { persist } from "zustand/middleware";

import type { CartItem } from "@/types/cart";

interface CartStore {
  /*
    Drawer state
  */

  isOpen: boolean;

  openCart: () => void;

  closeCart: () => void;

  /*
    Cart data
  */

  items: CartItem[];

  setItems: (items: CartItem[]) => void;

  addItem: (item: CartItem) => void;

  removeItem: (id: number) => void;

  updateQuantity: (id: number, quantity: number) => void;

  clearCart: () => void;
}

export const useCartStore =
create<CartStore>()(
  persist(
    (set) => ({
  isOpen: false,

  openCart: () =>
    set({
      isOpen: true,
    }),

  closeCart: () =>
    set({
      isOpen: false,
    }),

  items: [],

  setItems: (items) =>
    set({
      items,
    }),
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find(
        (cartItem) => cartItem.variant.id === item.variant.id,
      );

      if (existingItem) {
        return {
          items: state.items.map((cartItem) =>
            cartItem.variant.id === item.variant.id
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity + item.quantity,
                }
              : cartItem,
          ),

          isOpen: true,
        };
      }

      return {
        items: [...state.items, item],

        isOpen: true,
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    })),

  clearCart: () =>
    set({
      items: [],
    }),
    }),

    {
      name: "bandhon-noors-cart",
    }

  )

);

"use client";

import { useState } from "react";

import { ApiError } from "@/lib/api";
import {
  addCustomerCartItem,
  clearCustomerCart,
  removeCustomerCartItem,
  updateCustomerCartItem,
} from "@/services/cart-service";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/types/cart";

export function useCartActions() {
  const [error, setError] =
    useState<string | null>(null);

  const [isWorking, setIsWorking] =
    useState(false);

  const token =
    useAuthStore(
      (state) => state.token,
    );

  const clearSession =
    useAuthStore(
      (state) => state.clearSession,
    );

  const addLocalItem =
    useCartStore(
      (state) => state.addItem,
    );

  const removeLocalItem =
    useCartStore(
      (state) => state.removeItem,
    );

  const updateLocalQuantity =
    useCartStore(
      (state) => state.updateQuantity,
    );

  const clearLocalCart =
    useCartStore(
      (state) => state.clearCart,
    );

  const resetCart =
    useCartStore(
      (state) => state.resetCart,
    );

  const setItems =
    useCartStore(
      (state) => state.setItems,
    );

  const openCart =
    useCartStore(
      (state) => state.openCart,
    );

  async function runAction(
    action: () => Promise<void>,
  ) {
    setError(null);
    setIsWorking(true);

    try {
      await action();
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        requestError.status === 401
      ) {
        clearSession();
        resetCart();

        setError(
          "Your session expired. Please log in again.",
        );

        return;
      }

      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to update the cart.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function addItem(
    item: CartItem,
  ) {
    if (!token) {
      addLocalItem(item);
      return;
    }

    await runAction(async () => {
      const cart =
        await addCustomerCartItem(
          token,
          item.variant.id,
          item.quantity,
        );

      setItems(cart.items);
      openCart();
    });
  }

  async function updateQuantity(
    itemId: number,
    quantity: number,
  ) {
    if (!token) {
      updateLocalQuantity(
        itemId,
        quantity,
      );

      return;
    }

    await runAction(async () => {
      const cart =
        await updateCustomerCartItem(
          token,
          itemId,
          quantity,
        );

      setItems(cart.items);
    });
  }

  async function removeItem(
    itemId: number,
  ) {
    if (!token) {
      removeLocalItem(itemId);
      return;
    }

    await runAction(async () => {
      const cart =
        await removeCustomerCartItem(
          token,
          itemId,
        );

      setItems(cart.items);
    });
  }

  async function clearCart() {
    if (!token) {
      clearLocalCart();
      return;
    }

    await runAction(async () => {
      const cart =
        await clearCustomerCart(token);

      setItems(cart.items);
    });
  }

  return {
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    error,
    isWorking,
  };
}

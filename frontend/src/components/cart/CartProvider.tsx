"use client";

import { useEffect } from "react";

import CartDrawer from "./CartDrawer";

import { ApiError } from "@/lib/api";
import {
  addCustomerCartItem,
  getCustomerCart,
} from "@/services/cart-service";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export default function CartProvider() {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const clearSession =
    useAuthStore(
      (state) => state.clearSession,
    );

  const isOpen =
    useCartStore(
      (state) => state.isOpen,
    );

  const closeCart =
    useCartStore(
      (state) => state.closeCart,
    );

  const setItems =
    useCartStore(
      (state) => state.setItems,
    );

  const resetCart =
    useCartStore(
      (state) => state.resetCart,
    );

  const syncedCustomerId =
    useCartStore(
      (state) =>
        state.syncedCustomerId,
    );

  const setSyncedCustomerId =
    useCartStore(
      (state) =>
        state.setSyncedCustomerId,
    );

  useEffect(() => {
    if (
      !token ||
      !user ||
      user.role !== "CUSTOMER"
    ) {
      return;
    }
    const accessToken = token;
    const customerId = user.id;
    let cancelled = false;

    async function synchronizeCart() {
      try {
        const localItems =
          useCartStore.getState().items;

        let serverCart;

        if (
          syncedCustomerId !== customerId
        ) {
          serverCart =
            await getCustomerCart(accessToken);

          for (
            const localItem
            of localItems
          ) {
            serverCart =
            await addCustomerCartItem(
              accessToken,
              localItem.variant.id,
              Math.min(
                localItem.quantity,
                localItem.variant.stock_quantity,
              ),
          );
          }
        } else {
          serverCart =
            await getCustomerCart(accessToken);
        }

        if (cancelled) {
          return;
        }

        setItems(serverCart.items);

        setSyncedCustomerId(customerId);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        if (
          requestError instanceof ApiError &&
          requestError.status === 401
        ) {
          clearSession();
          resetCart();
        }
      }
    }

    void synchronizeCart();

    return () => {
      cancelled = true;
    };
  }, [
    token,
    user,
    syncedCustomerId,
    setItems,
    setSyncedCustomerId,
    clearSession,
    resetCart,
  ]);

  return (
    <CartDrawer
      open={isOpen}
      onClose={closeCart}
    />
  );
}

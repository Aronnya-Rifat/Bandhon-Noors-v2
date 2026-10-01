"use client";

import { useEffect } from "react";

import { ApiError } from "@/lib/api";
import {
  addCustomerWishlistItem,
  getCustomerWishlist,
} from "@/services/wishlist-service";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";


export default function WishlistProvider() {
  const token = useAuthStore(
    (state) => state.token,
  );

  const user = useAuthStore(
    (state) => state.user,
  );

  const clearSession = useAuthStore(
    (state) => state.clearSession,
  );

  const syncedCustomerId =
    useWishlistStore(
      (state) =>
        state.syncedCustomerId,
    );

  const setItems = useWishlistStore(
    (state) => state.setItems,
  );

  const setSyncedCustomerId =
    useWishlistStore(
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

    async function synchronizeWishlist() {
      try {
        const localItems =
          useWishlistStore.getState().items;

        let serverWishlist =
          await getCustomerWishlist(
            accessToken,
          );

        if (
          syncedCustomerId !== customerId
        ) {
          for (
            const localItem
            of localItems
          ) {
            serverWishlist =
              await addCustomerWishlistItem(
                accessToken,
                localItem.product_id,
              );
          }
        }

        if (cancelled) {
          return;
        }

        setItems(
          serverWishlist.items,
        );

        setSyncedCustomerId(
          customerId,
        );
      } catch (requestError) {
        if (
          !cancelled &&
          requestError instanceof ApiError &&
          requestError.status === 401
        ) {
          clearSession();
        }
      }
    }

    void synchronizeWishlist();

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
  ]);

  return null;
}

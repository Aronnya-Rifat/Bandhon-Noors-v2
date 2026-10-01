"use client";

import { useEffect } from "react";

import { ApiError } from "@/lib/api";
import {
  getCurrentUser,
} from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";


const SESSION_CHECK_INTERVAL =
  5 * 60 * 1000;


export default function AuthProvider() {
  const token = useAuthStore(
    (state) => state.token,
  );

  const setSession = useAuthStore(
    (state) => state.setSession,
  );

  const clearSession = useAuthStore(
    (state) => state.clearSession,
  );

  const resetCart = useCartStore(
    (state) => state.resetCart,
  );

  const resetWishlist =
    useWishlistStore(
      (state) =>
        state.resetWishlist,
    );

  useEffect(() => {
    function clearCustomerSession() {
      clearSession();
      resetCart();
      resetWishlist();
    }

    function handleUnauthorized() {
      clearCustomerSession();
    }

    window.addEventListener(
      "bandhon-auth-unauthorized",
      handleUnauthorized,
    );

    return () => {
      window.removeEventListener(
        "bandhon-auth-unauthorized",
        handleUnauthorized,
      );
    };
  }, [
    clearSession,
    resetCart,
    resetWishlist,
  ]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const accessToken = token;
    let cancelled = false;

    async function validateSession() {
      try {
        const currentUser =
          await getCurrentUser(
            accessToken,
          );

        if (!cancelled) {
          setSession(
            accessToken,
            currentUser,
          );
        }
      } catch (requestError) {
        if (
          !cancelled &&
          requestError instanceof ApiError &&
          requestError.status === 401
        ) {
          clearSession();
          resetCart();
          resetWishlist();
        }
      }
    }

    function handleWindowFocus() {
      void validateSession();
    }

    void validateSession();

    window.addEventListener(
      "focus",
      handleWindowFocus,
    );

    const intervalId =
      window.setInterval(
        () => {
          void validateSession();
        },
        SESSION_CHECK_INTERVAL,
      );

    return () => {
      cancelled = true;

      window.removeEventListener(
        "focus",
        handleWindowFocus,
      );

      window.clearInterval(
        intervalId,
      );
    };
  }, [
    token,
    setSession,
    clearSession,
    resetCart,
    resetWishlist,
  ]);

  return null;
}

"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export default function AccountPage() {
  const [mounted, setMounted] =
    useState(false);

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const token =
    useAuthStore(
      (state) => state.token,
    );

  const clearSession =
    useAuthStore(
      (state) => state.clearSession,
    );

  const resetCart =
    useCartStore(
      (state) => state.resetCart,
    );

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleLogout() {
    clearSession();
    resetCart();
  }

  if (!mounted) {
    return (
      <main className="container py-20">
        <div className="mx-auto max-w-md">
          <p className="text-center text-gray-500">
            Loading account...
          </p>
        </div>
      </main>
    );
  }

  const isLoggedIn =
    Boolean(token && user);

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-3xl font-semibold text-[#3F312B]">
          My Account
        </h1>

        {isLoggedIn && user ? (
          <>
            <p className="mt-4 text-gray-600">
              Welcome, {user.name}.
            </p>

            <div className="mt-8 rounded-2xl border border-pink-100 p-6 text-left">
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {user.name}
              </p>

              <p className="mt-5 text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {user.email}
              </p>

              {user.phone && (
                <>
                  <p className="mt-5 text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
                    {user.phone}
                  </p>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="/account/orders"
                className="
                  rounded-full
                  bg-[#D88C9A]
                  py-3
                  text-white
                  transition
                  hover:bg-[#C97B89]
                "
              >
                My Orders
              </Link>
              <Link
                href="/account/addresses"
                className="
                  rounded-full
                  border
                  border-pink-200
                  py-3
                  text-gray-700
                "
              >
                Saved Addresses
              </Link>
              <Link
                href="/wishlist"
                className="
                  rounded-full
                  border
                  border-pink-200
                  py-3
                  text-gray-700
                "
              >
                My Wishlist
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  rounded-full
                  border
                  border-red-200
                  py-3
                  text-red-500
                  transition
                  hover:bg-red-50
                "
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-gray-600">
              Login or create an account to manage
              your orders and saved information.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="/account/login"
                className="
                  rounded-full
                  bg-[#D88C9A]
                  py-3
                  text-white
                  transition
                  hover:bg-[#C97B89]
                "
              >
                Login
              </Link>

              <Link
                href="/account/register"
                className="
                  rounded-full
                  border
                  border-[#E7B8C1]
                  py-3
                  text-pink-500
                "
              >
                Create Account
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

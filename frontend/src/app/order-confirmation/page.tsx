"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import { ApiError } from "@/lib/api";
import { getCustomerOrder } from "@/services/order-service";
import { useAuthStore } from "@/store/auth-store";
import type { Order } from "@/types/order";

export default function OrderConfirmationPage() {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const [order, setOrder] =
    useState<Order | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError(
        "Please log in to view your order.",
      );

      setIsLoading(false);
      return;
    }

    const orderValue =
      new URLSearchParams(
        window.location.search,
      ).get("order");

    const orderId =
      Number(orderValue);

    if (
      !Number.isInteger(orderId) ||
      orderId < 1
    ) {
      setError(
        "The order number is missing.",
      );

      setIsLoading(false);
      return;
    }

    const accessToken = token;

    let cancelled = false;

    async function loadOrder() {
      try {
        const customerOrder =
          await getCustomerOrder(
            accessToken,
            orderId,
          );

        if (!cancelled) {
          setOrder(customerOrder);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load the order.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadOrder();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-[#3F312B]">
            Thank You For Your Order
          </h1>

          <p className="mt-5 text-gray-600">
            Your order has been placed successfully.
          </p>
        </div>

        {isLoading && (
          <p className="mt-10 text-center text-gray-500">
            Loading order...
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-10 text-center text-red-600"
          >
            {error}
          </p>
        )}

        {order && (
          <OrderSummaryCard
            order={order}
            showAddress
            defaultExpanded
            detailsHref={
              `/account/orders/${order.id}`
            }
          />
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/account/orders"
            className="
              rounded-full
              border
              border-pink-200
              px-8
              py-3
              text-gray-700
            "
          >
            View My Orders
          </Link>

          <Link
            href="/"
            className="
              rounded-full
              bg-[#D88C9A]
              px-8
              py-3
              text-white
              transition
              hover:bg-[#C97B89]
            "
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

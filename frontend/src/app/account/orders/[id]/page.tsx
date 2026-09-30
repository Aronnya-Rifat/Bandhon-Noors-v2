"use client";

import {
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
} from "next/navigation";

import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import { ApiError } from "@/lib/api";
import {
  getCustomerOrder,
} from "@/services/order-service";
import { useAuthStore } from "@/store/auth-store";
import type {
  Order,
} from "@/types/order";

export default function CustomerOrderPage() {
  const params = useParams<{
    id: string;
  }>();

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

  const orderId =
    Number(params.id);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    if (
      !Number.isInteger(orderId) ||
      orderId < 1
    ) {
      setError(
        "Invalid order number.",
      );
      setIsLoading(false);
      return;
    }

    const accessToken = token;
    let cancelled = false;

    async function loadOrder() {
      setIsLoading(true);
      setError(null);

      try {
        const data =
          await getCustomerOrder(
            accessToken,
            orderId,
          );

        if (!cancelled) {
          setOrder(data);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load this order.",
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
  }, [
    token,
    orderId,
  ]);

  if (!token) {
    return (
      <main className="container py-20">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-3xl font-semibold text-[#3F312B]">
            Login Required
          </h1>

          <p className="mt-4 text-gray-600">
            Log in to view this order.
          </p>

          <Link
            href="/account/login"
            className="mt-7 inline-block rounded-full bg-[#D88C9A] px-7 py-3 text-white"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm text-pink-600 hover:underline"
        >
          <ArrowLeft size={17} />

          My Orders
        </Link>

        <h1 className="mt-5 text-3xl font-semibold text-[#3F312B]">
          {order
            ? `Order #${order.id}`
            : "Order Details"}
        </h1>

        {isLoading && (
          <p className="mt-8 text-gray-500">
            Loading order...
          </p>
        )}

        {error && (
          <div className="mt-8 border border-red-200 bg-red-50 p-5">
            <p
              role="alert"
              className="text-red-700"
            >
              {error}
            </p>

            <Link
              href="/account/orders"
              className="mt-4 inline-block text-sm text-pink-600 hover:underline"
            >
              Return to order history
            </Link>
          </div>
        )}

        {order && (
          <div className="mt-8">
            <OrderSummaryCard
              order={order}
              showAddress
              defaultExpanded
            />

            <div className="mt-6 rounded-xl border border-pink-100 bg-pink-50 p-5">
              <h2 className="font-semibold text-[#3F312B]">
                Need help with this order?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Open the support chat and include
                order number #{order.id}. An
                administrator can reply directly
                in the chat.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

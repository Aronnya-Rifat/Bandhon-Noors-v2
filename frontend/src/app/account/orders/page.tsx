"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import { ApiError } from "@/lib/api";
import { getCustomerOrders } from "@/services/order-service";
import { useAuthStore } from "@/store/auth-store";
import type { Order } from "@/types/order";

export default function OrdersPage() {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const accessToken = token;

    let cancelled = false;

    async function loadOrders() {
      try {
        const customerOrders =
          await getCustomerOrders(
            accessToken,
          );

        if (!cancelled) {
          setOrders(customerOrders);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load your orders.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-semibold text-[#3F312B]">
          My Orders
        </h1>

        {!token ? (
          <div className="mt-10 rounded-2xl border border-pink-100 p-10 text-center">
            <p className="text-gray-500">
              Please log in to view your orders.
            </p>

            <Link
              href="/account/login"
              className="
                mt-6
                inline-block
                rounded-full
                bg-[#D88C9A]
                px-8
                py-3
                text-white
              "
            >
              Login
            </Link>
          </div>
        ) : isLoading ? (
          <p className="mt-10 text-gray-500">
            Loading orders...
          </p>
        ) : error ? (
          <p
            role="alert"
            className="mt-10 text-red-600"
          >
            {error}
          </p>
        ) : orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-pink-100 p-10 text-center">
            <p className="text-gray-500">
              You have no orders yet.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block text-pink-500 hover:underline"
            >
              Browse products
            </Link>
          </div>
        ) : (
            <div
              className="
                mt-10
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              "
            >   {orders.map((order) => (
              <OrderSummaryCard
                key={order.id}
                order={order}
                showAddress
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

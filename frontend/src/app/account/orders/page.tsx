"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import { ApiError } from "@/lib/api";
import { getCustomerOrders } from "@/services/order-service";
import { useAuthStore } from "@/store/auth-store";
import type { Order } from "@/types/order";

export default function OrdersPage() {
  const token = useAuthStore((state) => state.token);

  const [orders, setOrders] = useState<Order[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [totalOrders, setTotalOrders] = useState(0);

  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const accessToken = token;

    let cancelled = false;

    async function loadOrders() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getCustomerOrders(accessToken, page);

        if (!cancelled) {
          setOrders(result.items);
          setTotalOrders(result.total);
          setTotalPages(result.total_pages);

          if (page !== result.page) {
            setPage(result.page);
          }
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
  }, [token, page]);

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-semibold text-[#3F312B]">My Orders</h1>
        {token && !isLoading && (
          <p className="mt-2 text-sm text-gray-500">
            {totalOrders} {totalOrders === 1 ? "order" : "orders"}
          </p>
        )}
        {!token ? (
          <div className="mt-10 rounded-2xl border border-pink-100 p-10 text-center">
            <p className="text-gray-500">Please log in to view your orders.</p>

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
          <p className="mt-10 text-gray-500">Loading orders...</p>
        ) : error ? (
          <p role="alert" className="mt-10 text-red-600">
            {error}
          </p>
        ) : orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-pink-100 p-10 text-center">
            <p className="text-gray-500">You have no orders yet.</p>

            <Link
              href="/products"
              className="mt-6 inline-block text-pink-500 hover:underline"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {orders.map((order) => (
                <OrderSummaryCard
                  key={order.id}
                  order={order}
                  showAddress
                  detailsHref={`/account/orders/${order.id}`}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-pink-100 pt-5">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((current) => Math.max(1, current - 1));

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className="border border-pink-200 bg-white px-5 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage((current) => Math.min(totalPages, current + 1));

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className="border border-pink-200 bg-white px-5 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

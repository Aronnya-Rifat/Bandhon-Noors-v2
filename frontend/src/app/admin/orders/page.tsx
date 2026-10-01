"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShipmentEditor from "@/components/admin/AdminShipmentEditor";
import AdminPaymentVerifier from "@/components/admin/AdminPaymentVerifier";
import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import { ApiError } from "@/lib/api";
import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "@/services/admin-service";
import { useAuthStore } from "@/store/auth-store";

import type { AdminOrder, OrderStatus } from "@/types/order";

const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const actionLabels: Record<OrderStatus, string> = {
  PENDING: "Move to Pending",
  CONFIRMED: "Confirm Order",
  PROCESSING: "Start Processing",
  SHIPPED: "Mark as Shipped",
  DELIVERED: "Mark as Delivered",
  CANCELLED: "Cancel Order",
};

export default function AdminOrdersPage() {
  const token = useAuthStore((state) => state.token);

  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const [query, setQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  const [workingOrderId, setWorkingOrderId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const accessToken = token;
    let cancelled = false;

    async function loadOrders() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getAdminOrders(accessToken, {
          page,
          query,
          status: statusFilter,
        });

        if (!cancelled) {
          setOrders(result.items);

          setTotal(result.total);

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
              : "Unable to load orders.",
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
  }, [token, page, query, statusFilter]);

  async function handleStatusChange(order: AdminOrder, status: OrderStatus) {
    if (!token) {
      return;
    }

    if (
      status === "CANCELLED" &&
      !window.confirm(`Cancel order #${order.id}? Its stock will be returned.`)
    ) {
      return;
    }

    setError(null);
    setWorkingOrderId(order.id);

    try {
      const updated = await updateAdminOrderStatus(token, order.id, status);

      setOrders((current) =>
        current.map((item) =>
          item.id === updated.id
            ? {
                ...item,
                ...updated,
              }
            : item,
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to update the order.",
      );
    } finally {
      setWorkingOrderId(null);
    }
  }

  return (
    <main className="w-full px-4 py-8 md:px-8">
      <div
        className="
          flex
          flex-wrap
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>

          <p className="mt-1 text-sm text-gray-500">{total} orders</p>
        </div>

        <div className="flex w-full flex-wrap gap-3 md:w-auto">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Order ID, customer, email"
            className="min-w-64 flex-1 border bg-white px-4 py-2 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as OrderStatus | "");
              setPage(1);
            }}
            className="border bg-white px-4 py-2 text-sm"
          >
            <option value="">All statuses</option>

            {Object.keys(nextStatuses).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="mt-6 text-sm text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 border bg-white p-6 text-sm text-gray-500">
          No orders found.
        </p>
      ) : (
        <>
          <div
            className="
              mt-6
              grid
              grid-cols-1
              items-start
              gap-5
              xl:grid-cols-2
              2xl:grid-cols-3
            "
          >
            {orders.map((order) => {
              const available = nextStatuses[order.status];

              return (
                <section
                  key={order.id}
                  className="min-w-0 rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="mb-3">
                    <p className="font-medium text-gray-900">
                      {order.customer_name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {order.customer_email}
                    </p>
                  </div>
                  <OrderSummaryCard order={order} showAddress />

                  {token && (
                    <AdminPaymentVerifier
                      token={token}
                      order={order}
                      onUpdated={(updated) => {
                        setOrders((current) =>
                          current.map((item) =>
                            item.id === updated.id
                              ? {
                                  ...item,
                                  ...updated,
                                }
                              : item,
                          ),
                        );
                      }}
                    />
                  )}
                  <div className="mt-3">
                    <Link
                      href={`/admin/orders/${order.id}/print`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Print invoice
                    </Link>
                  </div>
                  {token && (
                    <AdminShipmentEditor
                      token={token}
                      order={order}
                      onUpdated={(updated) => {
                        setOrders((current) =>
                          current.map((item) =>
                            item.id === updated.id
                              ? {
                                  ...item,
                                  ...updated,
                                }
                              : item,
                          ),
                        );
                      }}
                    />
                  )}
                  {available.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {available.map((nextStatus) => (
                        <button
                          key={nextStatus}
                          type="button"
                          disabled={workingOrderId === order.id}
                          onClick={() => {
                            void handleStatusChange(order, nextStatus);
                          }}
                          className={
                            nextStatus === "CANCELLED"
                              ? "border border-red-200 px-3 py-2 text-xs text-red-600 disabled:opacity-50"
                              : "bg-[#D88C9A] px-3 py-2 text-xs text-white disabled:opacity-50"
                          }
                        >
                          {actionLabels[nextStatus]}
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="border bg-white px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                className="border bg-white px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

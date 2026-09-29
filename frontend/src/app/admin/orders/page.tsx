"use client";

import { useEffect, useState } from "react";

import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import { ApiError } from "@/lib/api";
import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "@/services/admin-service";
import { useAuthStore } from "@/store/auth-store";
import type { Order, OrderStatus } from "@/types/order";

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

  const [orders, setOrders] = useState<Order[]>([]);

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
      try {
        const data = await getAdminOrders(accessToken);

        if (!cancelled) {
          setOrders(data);
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
  }, [token]);

  async function handleStatusChange(order: Order, status: OrderStatus) {
    if (!token) {
      return;
    }

    if (
      status === "CANCELLED" &&
      !window.confirm(`Cancel order #${order.id}? Its stock will be returned.`)
    ) {
      return;
    }

    const accessToken = token;

    setError(null);
    setWorkingOrderId(order.id);

    try {
      const updatedOrder = await updateAdminOrderStatus(
        accessToken,
        order.id,
        status,
      );

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === updatedOrder.id ? updatedOrder : currentOrder,
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
    <main className="container py-12">
      <h1 className="text-3xl font-semibold text-[#3F312B]">Orders</h1>

      {error && (
        <p role="alert" className="mt-6 text-red-600">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="mt-8 text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-gray-500">No orders have been placed.</p>
      ) : (
        <div
          className="
    mt-8
    grid
    grid-cols-1
    items-start
    gap-6
    lg:grid-cols-2
    2xl:grid-cols-3
  "
        >
          {orders.map((order) => {
            const availableStatuses = nextStatuses[order.status];

            return (
              <section
                key={order.id}
                className="
    min-w-0
    space-y-3
    rounded-2xl
    bg-white
    p-3
  "
              >
                <p className="text-sm text-gray-500">
                  Customer ID: {order.customer_id}
                </p>

                <OrderSummaryCard order={order} showAddress />

                {availableStatuses.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {availableStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={workingOrderId === order.id}
                        onClick={() => void handleStatusChange(order, status)}
                        className={
                          status === "CANCELLED"
                            ? "rounded-full border border-red-200 px-5 py-2 text-sm text-red-500 disabled:opacity-50"
                            : "rounded-full bg-[#D88C9A] px-5 py-2 text-sm text-white disabled:opacity-50"
                        }
                      >
                        {workingOrderId === order.id
                          ? "Updating..."
                          : actionLabels[status]}
                      </button>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

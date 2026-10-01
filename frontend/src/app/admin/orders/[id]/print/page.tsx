"use client";

import Link from "next/link";
import {
  useParams,
} from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  getAdminOrder,
} from "@/services/admin-service";
import { useAuthStore } from "@/store/auth-store";
import type {
  Order,
} from "@/types/order";

const statusLabels: Record<
  Order["status"],
  string
> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const paymentMethodLabels = {
  COD: "Cash on Delivery",
  CARD: "Card",
  MOBILE_BANKING: "Mobile Banking",
} as const;

const paymentStatusLabels = {
  PENDING: "Pending",
  SUCCESS: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
} as const;

export default function AdminOrderPrintPage() {
  const params =
    useParams<{
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

  useEffect(() => {
    if (!token) {
      return;
    }

    const orderId =
      Number(params.id);

    if (
      !Number.isInteger(orderId) ||
      orderId <= 0
    ) {
      setError("Invalid order number.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    getAdminOrder(
      token,
      orderId,
    )
      .then((result) => {
        if (!cancelled) {
          setOrder(result);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load the order.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    token,
    params.id,
  ]);

  if (isLoading) {
    return (
      <main className="p-10 text-center text-gray-500">
        Loading order...
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="p-10">
        <div className="mx-auto max-w-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error ??
            "Order not found."}
        </div>
      </main>
    );
  }

  const createdAt =
    new Date(
      order.created_at,
    ).toLocaleString(
      "en-BD",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      },
    );

  return (
    <main className="min-h-screen w-full bg-gray-100 px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto mb-5 flex max-w-4xl items-center justify-between gap-4 print:hidden">
        <Link
          href="/admin/orders"
          className="border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"
        >
          ← Back to orders
        </Link>

        <button
          type="button"
          onClick={() =>
            window.print()
          }
          className="bg-gray-900 px-5 py-2 text-sm font-medium text-white"
        >
          Print Invoice
        </button>
      </div>

      <article className="mx-auto max-w-4xl bg-white p-8 shadow-sm print:max-w-none print:p-0 print:shadow-none">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-gray-900 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-wide text-gray-900">
              BANDHON NOORS
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Ecommerce Invoice
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-semibold text-gray-900">
              Invoice
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Order #{order.id}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              {createdAt}
            </p>
          </div>
        </header>

        <section className="grid gap-8 border-b border-gray-200 py-6 md:grid-cols-2 print:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Deliver to
            </h3>

            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-800">
              {order.shipping_address}
            </p>
          </div>

          <div className="md:text-right print:text-right">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Order information
            </h3>

            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-6 md:justify-end print:justify-end">
                <dt className="text-gray-500">
                  Status
                </dt>

                <dd className="font-medium text-gray-900">
                  {statusLabels[
                    order.status
                  ]}
                </dd>
              </div>

              <div className="flex justify-between gap-6 md:justify-end print:justify-end">
                <dt className="text-gray-500">
                  Delivery area
                </dt>

                <dd className="font-medium text-gray-900">
                  {order.delivery_area ===
                  "DHAKA"
                    ? "Inside Dhaka"
                    : "Outside Dhaka"}
                </dd>
              </div>

              {order.payment && (
                <>
                  <div className="flex justify-between gap-6 md:justify-end print:justify-end">
                    <dt className="text-gray-500">
                      Payment
                    </dt>

                    <dd className="font-medium text-gray-900">
                      {
                        paymentMethodLabels[
                          order.payment
                            .payment_method
                        ]
                      }
                    </dd>
                  </div>

                  <div className="flex justify-between gap-6 md:justify-end print:justify-end">
                    <dt className="text-gray-500">
                      Payment status
                    </dt>

                    <dd className="font-medium text-gray-900">
                      {
                        paymentStatusLabels[
                          order.payment
                            .payment_status
                        ]
                      }
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </section>

        <section className="py-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="py-3 pr-4">
                    Product
                  </th>

                  <th className="px-4 py-3 text-center">
                    Quantity
                  </th>

                  <th className="px-4 py-3 text-right">
                    Unit Price
                  </th>

                  <th className="py-3 pl-4 text-right">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {order.items.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200"
                    >
                      <td className="py-4 pr-4">
                        <p className="font-medium text-gray-900">
                          {
                            item.product_name
                          }
                        </p>

                        {item.variant_info !==
                          "Standard" &&
                          item.variant_info !==
                            "Standard option" && (
                            <p className="mt-1 text-xs text-gray-500">
                              {
                                item.variant_info
                              }
                            </p>
                          )}
                      </td>

                      <td className="px-4 py-4 text-center">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-4 text-right">
                        {formatCurrency(
                          item.unit_price,
                        )}
                      </td>

                      <td className="py-4 pl-4 text-right font-medium">
                        {formatCurrency(
                          item.unit_price *
                            item.quantity,
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          <div className="ml-auto mt-6 max-w-sm space-y-3 text-sm">
            <div className="flex justify-between gap-6 text-gray-600">
              <span>Subtotal</span>

              <span>
                {formatCurrency(
                  order.subtotal,
                )}
              </span>
            </div>

            <div className="flex justify-between gap-6 text-gray-600">
              <span>Delivery</span>

              <span>
                {formatCurrency(
                  order.delivery_charge,
                )}
              </span>
            </div>

            <div className="flex justify-between gap-6 border-t-2 border-gray-900 pt-3 text-lg font-bold text-gray-900">
              <span>Total</span>

              <span>
                {formatCurrency(
                  order.total_amount,
                )}
              </span>
            </div>
          </div>
        </section>

        {(order.courier_name ||
          order.tracking_number) && (
          <section className="border-t border-gray-200 py-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Shipment
            </h3>

            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 print:grid-cols-2">
              <p>
                <span className="text-gray-500">
                  Courier:
                </span>{" "}
                <span className="font-medium">
                  {order.courier_name ??
                    "Not assigned"}
                </span>
              </p>

              <p>
                <span className="text-gray-500">
                  Tracking:
                </span>{" "}
                <span className="font-medium">
                  {order.tracking_number ??
                    "Not assigned"}
                </span>
              </p>
            </div>
          </section>
        )}

        <footer className="border-t border-gray-200 pt-5 text-center text-xs text-gray-500">
          Thank you for shopping with Bandhon Noors.
        </footer>
      </article>
    </main>
  );
}

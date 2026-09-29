"use client";

import {
  useEffect,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  getAdminCustomers,
} from "@/services/admin-service";
import { useAuthStore } from "@/store/auth-store";
import type {
  AdminCustomer,
} from "@/types/admin";

export default function AdminCustomersPage() {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const [customers, setCustomers] =
    useState<AdminCustomer[]>([]);

  const [query, setQuery] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const accessToken = token;
    let cancelled = false;

    async function loadCustomers() {
      setIsLoading(true);
      setError(null);

      try {
        const data =
          await getAdminCustomers(
            accessToken,
            {
              page,
              query,
            },
          );

        if (!cancelled) {
          setCustomers(data.items);
          setTotal(data.total);
          setTotalPages(
            data.total_pages,
          );

          if (page !== data.page) {
            setPage(data.page);
          }
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load customers.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCustomers();

    return () => {
      cancelled = true;
    };
  }, [
    token,
    page,
    query,
  ]);

  return (
    <main className="w-full px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Customers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {total} registered customers
          </p>
        </div>

        <input
          value={query}
          onChange={(event) => {
            setQuery(
              event.target.value,
            );
            setPage(1);
          }}
          placeholder="Search name, email, or phone"
          className="w-full border bg-white px-4 py-2 md:w-80"
        />
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
        <p className="mt-6 text-sm text-gray-500">
          Loading customers...
        </p>
      ) : customers.length === 0 ? (
        <div className="mt-6 border border-gray-200 bg-white p-6 text-sm text-gray-500">
          No customers found.
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto border border-gray-200 bg-white">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3">
                    Customer
                  </th>

                  <th className="px-4 py-3">
                    Email
                  </th>

                  <th className="px-4 py-3">
                    Phone
                  </th>

                  <th className="px-4 py-3">
                    Orders
                  </th>

                  <th className="px-4 py-3">
                    Delivered sales
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody>
                {customers.map(
                  (customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {customer.name}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {customer.email}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {customer.phone ??
                          "—"}
                      </td>

                      <td className="px-4 py-3">
                        {
                          customer.order_count
                        }
                      </td>

                      <td className="px-4 py-3">
                        {formatCurrency(
                          customer.total_spent,
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            customer.is_active
                              ? "text-green-700"
                              : "text-red-600"
                          }
                        >
                          {customer.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {new Date(
                          customer.created_at,
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(
                        1,
                        current - 1,
                      ),
                  )
                }
                className="border bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={
                  page >= totalPages
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.min(
                        totalPages,
                        current + 1,
                      ),
                  )
                }
                className="border bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
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

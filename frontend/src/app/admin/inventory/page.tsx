"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  createInventoryTransaction,
  getInventoryHistory,
  getInventoryVariants,
} from "@/services/admin-service";
import { useAuthStore } from "@/store/auth-store";
import type {
  InventoryTransaction,
  InventoryTransactionType,
  InventoryVariant,
} from "@/types/admin";

export default function AdminInventoryPage() {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const [variants, setVariants] =
    useState<InventoryVariant[]>([]);

  const [query, setQuery] =
    useState("");

  const [lowStockOnly, setLowStockOnly] =
    useState(false);

  const [adjustments, setAdjustments] =
    useState<Record<number, string>>({});

  const [notes, setNotes] =
    useState<Record<number, string>>({});

  const [history, setHistory] =
    useState<
      Record<
        number,
        InventoryTransaction[]
      >
    >({});

  const [openHistoryId, setOpenHistoryId] =
    useState<number | null>(null);

  const [workingVariantId, setWorkingVariantId] =
    useState<number | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function refreshVariants(
    accessToken: string,
  ) {
    const data =
      await getInventoryVariants(
        accessToken,
      );

    setVariants(data);
  }

  useEffect(() => {
    if (!token) {
      return;
    }

    const accessToken = token;

    let cancelled = false;

    getInventoryVariants(accessToken)
      .then((data) => {
        if (!cancelled) {
          setVariants(data);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load inventory.",
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
  }, [token]);

  const filteredVariants =
    useMemo(() => {
      const normalized =
        query.trim().toLowerCase();

      return variants.filter(
        (variant) => {
          const matchesSearch =
            !normalized ||
            variant.product_name
              .toLowerCase()
              .includes(normalized) ||
            variant.variant_code
              .toLowerCase()
              .includes(normalized);

          const matchesStock =
            !lowStockOnly ||
            variant.stock_quantity <=
              variant.low_stock_threshold;

          return (
            matchesSearch &&
            matchesStock
          );
        },
      );
    }, [
      variants,
      query,
      lowStockOnly,
    ]);

  async function adjustStock(
    variant: InventoryVariant,
  ) {
    if (!token) {
      return;
    }

    const amount =
      Number(
        adjustments[
          variant.variant_id
        ],
      );

    if (
      !Number.isInteger(amount) ||
      amount === 0
    ) {
      setError(
        "Enter a non-zero whole-number adjustment.",
      );
      return;
    }

    const transactionType:
      InventoryTransactionType =
        amount > 0
          ? "STOCK_IN"
          : "STOCK_OUT";

    setError(null);
    setWorkingVariantId(
      variant.variant_id,
    );

    try {
      await createInventoryTransaction(
        token,
        {
          variant_id:
            variant.variant_id,
          change_amount: amount,
          transaction_type:
            transactionType,
          note:
            notes[
              variant.variant_id
            ]?.trim() ||
            undefined,
        },
      );

      await refreshVariants(token);

      setAdjustments((values) => ({
        ...values,
        [variant.variant_id]: "",
      }));

      setNotes((values) => ({
        ...values,
        [variant.variant_id]: "",
      }));

      setHistory((values) => {
        const copy = {
          ...values,
        };

        delete copy[
          variant.variant_id
        ];

        return copy;
      });
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to adjust stock.",
      );
    } finally {
      setWorkingVariantId(null);
    }
  }

  async function toggleHistory(
    variantId: number,
  ) {
    if (!token) {
      return;
    }

    if (
      openHistoryId === variantId
    ) {
      setOpenHistoryId(null);
      return;
    }

    setOpenHistoryId(variantId);

    if (history[variantId]) {
      return;
    }

    try {
      const transactions =
        await getInventoryHistory(
          token,
          variantId,
        );

      setHistory((values) => ({
        ...values,
        [variantId]:
          transactions,
      }));
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to load stock history.",
      );
    }
  }

  return (
    <main className="container py-10">
      <div className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Inventory
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Positive adjustments add stock.
          Negative adjustments remove stock.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-5">
        <input
          value={query}
          onChange={(event) =>
            setQuery(
              event.target.value,
            )
          }
          placeholder="Search product or variant"
          className="w-full border bg-white px-4 py-2 md:w-96"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(event) =>
              setLowStockOnly(
                event.target.checked,
              )
            }
          />

          Low stock only
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="mt-8 text-gray-500">
          Loading inventory...
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {filteredVariants.map(
            (variant) => {
              const isLowStock =
                variant.stock_quantity <=
                variant.low_stock_threshold;

              const isWorking =
                workingVariantId ===
                variant.variant_id;

              return (
                <section
                  key={variant.variant_id}
                  className="border border-gray-200 bg-white"
                >
                  <div className="grid gap-4 p-4 lg:grid-cols-[2fr_1fr_1fr_1fr_2fr_auto] lg:items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        {variant.product_name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {variant.variant_code}
                        {" · "}
                        {[
                          variant.color_theme,
                          variant.size,
                        ]
                          .filter(Boolean)
                          .join(" / ") ||
                          "Standard option"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Current Stock
                      </p>

                      <p
                        className={
                          isLowStock
                            ? "font-semibold text-red-600"
                            : "font-semibold text-green-600"
                        }
                      >
                        {variant.stock_quantity}
                      </p>
                    </div>

                    <input
                      type="number"
                      step="1"
                      value={
                        adjustments[
                          variant.variant_id
                        ] ?? ""
                      }
                      onChange={(event) =>
                        setAdjustments(
                          (values) => ({
                            ...values,
                            [variant.variant_id]:
                              event.target.value,
                          }),
                        )
                      }
                      placeholder="+10 or -5"
                      className="border px-3 py-2"
                    />

                    <input
                      value={
                        notes[
                          variant.variant_id
                        ] ?? ""
                      }
                      onChange={(event) =>
                        setNotes(
                          (values) => ({
                            ...values,
                            [variant.variant_id]:
                              event.target.value,
                          }),
                        )
                      }
                      placeholder="Reason"
                      className="border px-3 py-2 lg:col-span-2"
                    />

                    <button
                      type="button"
                      disabled={isWorking}
                      onClick={() =>
                        void adjustStock(
                          variant,
                        )
                      }
                      className="bg-gray-800 px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                      {isWorking
                        ? "Saving..."
                        : "Apply"}
                    </button>
                  </div>

                  <div className="border-t border-gray-100 px-4 py-2">
                    <button
                      type="button"
                      onClick={() =>
                        void toggleHistory(
                          variant.variant_id,
                        )
                      }
                      className="text-sm text-blue-600"
                    >
                      {openHistoryId ===
                      variant.variant_id
                        ? "Hide history"
                        : "View history"}
                    </button>
                  </div>

                  {openHistoryId ===
                    variant.variant_id && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                      {!history[
                        variant.variant_id
                      ] ? (
                        <p className="text-sm text-gray-500">
                          Loading history...
                        </p>
                      ) : history[
                          variant.variant_id
                        ].length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No stock transactions.
                        </p>
                      ) : (
                        <div className="space-y-2 text-sm">
                          {history[
                            variant.variant_id
                          ].map(
                            (transaction) => (
                              <div
                                key={
                                  transaction.id
                                }
                                className="flex flex-wrap justify-between gap-3 border-b border-gray-200 pb-2"
                              >
                                <span>
                                  {
                                    transaction.transaction_type
                                  }
                                  :{" "}
                                  {transaction.change_amount >
                                  0
                                    ? "+"
                                    : ""}
                                  {
                                    transaction.change_amount
                                  }
                                </span>

                                <span className="text-gray-500">
                                  {transaction.note ??
                                    "No note"}
                                </span>

                                <span className="text-gray-500">
                                  {new Date(
                                    transaction.created_at,
                                  ).toLocaleString(
                                    "en-BD",
                                  )}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            },
          )}
        </div>
      )}
    </main>
  );
}

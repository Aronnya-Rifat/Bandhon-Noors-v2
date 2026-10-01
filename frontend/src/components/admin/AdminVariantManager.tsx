"use client";

import { SubmitEvent, useEffect, useState } from "react";

import { ApiError } from "@/lib/api";
import {
  createAdminProductVariant,
  createInventoryTransaction,
  getAdminProductVariants,
  updateAdminProductVariant,
} from "@/services/admin-service";
import { useAuthStore } from "@/store/auth-store";
import type { AdminVariant } from "@/types/admin";

interface AdminVariantManagerProps {
  productId: number;
}

export default function AdminVariantManager({
  productId,
}: AdminVariantManagerProps) {
  const token = useAuthStore((state) => state.token);
  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);

  const [editValues, setEditValues] = useState({
    variantCode: "",
    color: "",
    size: "",
    stock: "0",
    threshold: "5",
    additionalPrice: "",
  });
  const [variants, setVariants] = useState<AdminVariant[]>([]);

  const [variantCode, setVariantCode] = useState("");

  const [color, setColor] = useState("");

  const [size, setSize] = useState("");

  const [stock, setStock] = useState("0");

  const [threshold, setThreshold] = useState("5");

  const [additionalPrice, setAdditionalPrice] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVariants() {
      try {
        const data = await getAdminProductVariants(productId);

        if (!cancelled) {
          setVariants(data);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load variants.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadVariants();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handleCreate(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const createdVariant = await createAdminProductVariant(token, productId, {
        variant_code: variantCode.trim(),
        color_theme: color.trim() || undefined,
        size: size.trim() || undefined,
        stock_quantity: Number(stock),
        low_stock_threshold: Number(threshold),
        additional_price: additionalPrice ? Number(additionalPrice) : undefined,
      });

      setVariants((currentVariants) => [...currentVariants, createdVariant]);

      setVariantCode("");
      setColor("");
      setSize("");
      setStock("0");
      setThreshold("5");
      setAdditionalPrice("");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to create the variant.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  function beginEditing(variant: AdminVariant) {
    setEditingVariantId(variant.id);

    setEditValues({
      variantCode: variant.variant_code,
      color: variant.color_theme ?? "",
      size: variant.size ?? "",
      stock: String(variant.stock_quantity),
      threshold: String(variant.low_stock_threshold),
      additionalPrice: variant.additional_price?.toString() ?? "",
    });

    setError(null);
  }

  async function saveVariant(variant: AdminVariant) {
    if (!token) {
      return;
    }

    const desiredStock = Number(editValues.stock);

    if (!Number.isInteger(desiredStock) || desiredStock < 0) {
      setError("Stock must be a whole number of zero or more.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let updated = await updateAdminProductVariant(token, variant.id, {
        variant_code: editValues.variantCode.trim(),
        color_theme: editValues.color.trim() || undefined,
        size: editValues.size.trim() || undefined,
        low_stock_threshold: Number(editValues.threshold),
        additional_price: editValues.additionalPrice
          ? Number(editValues.additionalPrice)
          : undefined,
      });

      const stockDifference = desiredStock - variant.stock_quantity;

      if (stockDifference !== 0) {
        await createInventoryTransaction(token, {
          variant_id: variant.id,
          change_amount: stockDifference,
          transaction_type: "ADJUSTMENT",
          note: "Stock set from product editor",
        });

        const refreshed = await getAdminProductVariants(productId);

        updated = refreshed.find((item) => item.id === variant.id) ?? updated;
      }

      setVariants((items) =>
        items.map((item) => (item.id === updated.id ? updated : item)),
      );

      setEditingVariantId(null);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to update the variant.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <section className="rounded-2xl border border-pink-100 bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-800">Product Variants</h2>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="mt-5 text-gray-500">Loading variants...</p>
      ) : variants.length === 0 ? (
        <p className="mt-5 text-gray-500">No variants have been added.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-pink-100 text-gray-500">
              <tr>
                <th className="py-3">Code</th>

                <th className="py-3">Color</th>

                <th className="py-3">Size</th>

                <th className="py-3">Stock</th>

                <th className="py-3">Low-stock Level</th>

                <th className="py-3">Extra Price</th>
                <th className="py-3 pl-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {variants.map((variant) => {
                const isEditing = editingVariantId === variant.id;

                return (
                  <tr
                    key={variant.id}
                    className="border-b border-pink-50 align-top"
                  >
                    <td className="py-3 pr-3">
                      {isEditing ? (
                        <input
                          value={editValues.variantCode}
                          onChange={(event) =>
                            setEditValues((values) => ({
                              ...values,
                              variantCode: event.target.value,
                            }))
                          }
                          minLength={2}
                          required
                          aria-label="Variant code"
                          className="w-32 border px-2 py-2"
                        />
                      ) : (
                        variant.variant_code
                      )}
                    </td>

                    <td className="py-3 pr-3">
                      {isEditing ? (
                        <input
                          value={editValues.color}
                          onChange={(event) =>
                            setEditValues((values) => ({
                              ...values,
                              color: event.target.value,
                            }))
                          }
                          placeholder="Color"
                          aria-label="Variant color"
                          className="w-28 border px-2 py-2"
                        />
                      ) : (
                        (variant.color_theme ?? "—")
                      )}
                    </td>

                    <td className="py-3 pr-3">
                      {isEditing ? (
                        <input
                          value={editValues.size}
                          onChange={(event) =>
                            setEditValues((values) => ({
                              ...values,
                              size: event.target.value,
                            }))
                          }
                          placeholder="Size"
                          aria-label="Variant size"
                          className="w-24 border px-2 py-2"
                        />
                      ) : (
                        (variant.size ?? "—")
                      )}
                    </td>

                    <td className="py-3 pr-3">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={editValues.stock}
                          onChange={(event) =>
                            setEditValues((values) => ({
                              ...values,
                              stock: event.target.value,
                            }))
                          }
                          required
                          aria-label="Stock quantity"
                          className="w-24 border px-2 py-2"
                        />
                      ) : (
                        <span
                          className={
                            variant.stock_quantity <=
                            variant.low_stock_threshold
                              ? "font-semibold text-red-600"
                              : "font-semibold text-green-600"
                          }
                        >
                          {variant.stock_quantity}
                        </span>
                      )}
                    </td>

                    <td className="py-3 pr-3">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={editValues.threshold}
                          onChange={(event) =>
                            setEditValues((values) => ({
                              ...values,
                              threshold: event.target.value,
                            }))
                          }
                          required
                          aria-label="Low-stock level"
                          className="w-24 border px-2 py-2"
                        />
                      ) : (
                        variant.low_stock_threshold
                      )}
                    </td>

                    <td className="py-3 pr-3">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editValues.additionalPrice}
                          onChange={(event) =>
                            setEditValues((values) => ({
                              ...values,
                              additionalPrice: event.target.value,
                            }))
                          }
                          placeholder="0.00"
                          aria-label="Additional price"
                          className="w-28 border px-2 py-2"
                        />
                      ) : (
                        (variant.additional_price ?? 0)
                      )}
                    </td>

                    <td className="py-3 pl-4">
                      {isEditing ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => void saveVariant(variant)}
                            className="bg-gray-800 px-4 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSubmitting ? "Saving..." : "Save"}
                          </button>

                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => {
                              setEditingVariantId(null);
                              setError(null);
                            }}
                            className="border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isSubmitting || editingVariantId !== null}
                          onClick={() => beginEditing(variant)}
                          className="border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleCreate} className="mt-8 grid gap-4 md:grid-cols-2">
        <input
          value={variantCode}
          onChange={(event) => setVariantCode(event.target.value)}
          required
          minLength={2}
          placeholder="Variant code"
          className="rounded-lg border px-4 py-3"
        />

        <input
          value={color}
          onChange={(event) => setColor(event.target.value)}
          placeholder="Color (optional)"
          className="rounded-lg border px-4 py-3"
        />

        <input
          value={size}
          onChange={(event) => setSize(event.target.value)}
          placeholder="Size (optional)"
          className="rounded-lg border px-4 py-3"
        />

        <input
          type="number"
          min="0"
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          required
          placeholder="Initial stock"
          className="rounded-lg border px-4 py-3"
        />

        <input
          type="number"
          min="0"
          value={threshold}
          onChange={(event) => setThreshold(event.target.value)}
          required
          placeholder="Low-stock level"
          className="rounded-lg border px-4 py-3"
        />

        <input
          type="number"
          step="0.01"
          value={additionalPrice}
          onChange={(event) => setAdditionalPrice(event.target.value)}
          placeholder="Additional price"
          className="rounded-lg border px-4 py-3"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            rounded-full
            bg-[#D88C9A]
            px-8
            py-3
            text-white
            disabled:opacity-50
            md:col-span-2
            md:w-fit
          "
        >
          {isSubmitting ? "Adding..." : "Add Variant"}
        </button>
      </form>
    </section>
  );
}

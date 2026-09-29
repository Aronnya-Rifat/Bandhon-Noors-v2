"use client";

import {
  SubmitEvent,
  useEffect,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  createAdminProductVariant,
  getAdminProductVariants,
} from "@/services/admin-service";
import { useAuthStore } from "@/store/auth-store";
import type { AdminVariant } from "@/types/admin";

interface AdminVariantManagerProps {
  productId: number;
}

export default function AdminVariantManager({
  productId,
}: AdminVariantManagerProps) {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const [variants, setVariants] =
    useState<AdminVariant[]>([]);

  const [variantCode, setVariantCode] =
    useState("");

  const [color, setColor] =
    useState("");

  const [size, setSize] =
    useState("");

  const [stock, setStock] =
    useState("0");

  const [threshold, setThreshold] =
    useState("5");

  const [additionalPrice, setAdditionalPrice] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVariants() {
      try {
        const data =
          await getAdminProductVariants(
            productId,
          );

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

  async function handleCreate(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const createdVariant =
        await createAdminProductVariant(
          token,
          productId,
          {
            variant_code:
              variantCode.trim(),
            color_theme:
              color.trim() ||
              undefined,
            size:
              size.trim() ||
              undefined,
            stock_quantity:
              Number(stock),
            low_stock_threshold:
              Number(threshold),
            additional_price:
              additionalPrice
                ? Number(
                    additionalPrice,
                  )
                : undefined,
          },
        );

      setVariants(
        (currentVariants) => [
          ...currentVariants,
          createdVariant,
        ],
      );

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

  return (
    <section className="rounded-2xl border border-pink-100 bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Product Variants
      </h2>

      {error && (
        <p
          role="alert"
          className="mt-4 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="mt-5 text-gray-500">
          Loading variants...
        </p>
      ) : variants.length === 0 ? (
        <p className="mt-5 text-gray-500">
          No variants have been added.
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-b border-pink-100 text-gray-500">
              <tr>
                <th className="py-3">
                  Code
                </th>

                <th className="py-3">
                  Color
                </th>

                <th className="py-3">
                  Size
                </th>

                <th className="py-3">
                  Stock
                </th>

                <th className="py-3">
                  Low-stock Level
                </th>

                <th className="py-3">
                  Extra Price
                </th>
              </tr>
            </thead>

            <tbody>
              {variants.map(
                (variant) => (
                  <tr
                    key={variant.id}
                    className="border-b border-pink-50"
                  >
                    <td className="py-3">
                      {variant.variant_code}
                    </td>

                    <td className="py-3">
                      {variant.color_theme ??
                        "—"}
                    </td>

                    <td className="py-3">
                      {variant.size ??
                        "—"}
                    </td>

                    <td className="py-3">
                      {variant.stock_quantity}
                    </td>

                    <td className="py-3">
                      {variant.low_stock_threshold}
                    </td>

                    <td className="py-3">
                      {variant.additional_price ??
                        0}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="mt-8 grid gap-4 md:grid-cols-2"
      >
        <input
          value={variantCode}
          onChange={(event) =>
            setVariantCode(
              event.target.value,
            )
          }
          required
          minLength={2}
          placeholder="Variant code"
          className="rounded-lg border px-4 py-3"
        />

        <input
          value={color}
          onChange={(event) =>
            setColor(
              event.target.value,
            )
          }
          placeholder="Color (optional)"
          className="rounded-lg border px-4 py-3"
        />

        <input
          value={size}
          onChange={(event) =>
            setSize(
              event.target.value,
            )
          }
          placeholder="Size (optional)"
          className="rounded-lg border px-4 py-3"
        />

        <input
          type="number"
          min="0"
          value={stock}
          onChange={(event) =>
            setStock(
              event.target.value,
            )
          }
          required
          placeholder="Initial stock"
          className="rounded-lg border px-4 py-3"
        />

        <input
          type="number"
          min="0"
          value={threshold}
          onChange={(event) =>
            setThreshold(
              event.target.value,
            )
          }
          required
          placeholder="Low-stock level"
          className="rounded-lg border px-4 py-3"
        />

        <input
          type="number"
          step="0.01"
          value={additionalPrice}
          onChange={(event) =>
            setAdditionalPrice(
              event.target.value,
            )
          }
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
          {isSubmitting
            ? "Adding..."
            : "Add Variant"}
        </button>
      </form>
    </section>
  );
}

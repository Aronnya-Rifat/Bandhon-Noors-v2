"use client";

import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
} from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import { ApiError } from "@/lib/api";
import { searchProducts } from "@/services/search-service";
import type { ProductCardProduct } from "@/types/product";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({
  open,
  onClose,
}: SearchOverlayProps) {
  const router = useRouter();

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState<ProductCardProduct[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const normalizedQuery =
      query.trim();

    if (
      !open ||
      !normalizedQuery
    ) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const timeoutId =
      window.setTimeout(
        async () => {
          setIsLoading(true);
          setError(null);

          try {
            const products =
              await searchProducts(
                normalizedQuery,
              );

            if (!cancelled) {
              setResults(
                products.slice(0, 4),
              );
            }
          } catch (requestError) {
            if (!cancelled) {
              setResults([]);

              setError(
                requestError instanceof ApiError
                  ? requestError.message
                  : "Unable to search products.",
              );
            }
          } finally {
            if (!cancelled) {
              setIsLoading(false);
            }
          }
        },
        300,
      );

    return () => {
      cancelled = true;

      window.clearTimeout(
        timeoutId,
      );
    };
  }, [query, open]);

  function handleClose() {
    setQuery("");
    setResults([]);
    setError(null);
    onClose();
  }

  function viewAllResults() {
    const normalizedQuery =
      query.trim();

    if (!normalizedQuery) {
      return;
    }

    router.push(
      `/products?query=${encodeURIComponent(
        normalizedQuery,
      )}`,
    );

    handleClose();
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Search
          </h2>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="text-gray-600 hover:text-pink-500"
          >
            <X size={28} />
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-pink-200 px-5 py-3">
          <Search size={20} />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                viewAllResults();
              }
            }}
            placeholder="Search products..."
            className="w-full outline-none"
          />
        </div>

        {isLoading && (
          <p className="mt-8 text-center text-gray-500">
            Searching...
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-8 text-center text-red-600"
          >
            {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          query.trim() &&
          results.length === 0 && (
            <p className="mt-8 text-center text-gray-500">
              No products found.
            </p>
          )}

        {results.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
              {results.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ),
              )}
            </div>

            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={viewAllResults}
                className="
                  rounded-full
                  bg-[#D88C9A]
                  px-8
                  py-3
                  text-white
                  transition
                  hover:bg-[#C97B89]
                "
              >
                View All Results
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

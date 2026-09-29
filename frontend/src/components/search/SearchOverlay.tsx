/**
 * Bandhon Noors Search Overlay
 *
 * Global product search UI.
 *
 * Handles:
 * - Search input
 * - Search results display
 *
 * Future:
 * - Backend search API
 * - Filters
 * - Suggestions
 */

"use client";

import { useState } from "react";
import type { ProductCardProduct } from "@/types/product";
import Link from "next/link";
import { useEffect } from "react";
import { Search, X } from "lucide-react";

import { searchProducts } from "@/services/search-service";

interface SearchOverlayProps {
  open: boolean;

  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState<ProductCardProduct[]>([]);
  useEffect(() => {
    async function search() {
      if (!query.trim()) {
        setResults([]);

        return;
      }

      const data = await searchProducts(query);

      setResults(data);
    }

    search();
  }, [query]);

  return (
    <div
      className={`
        fixed
        inset-0
        z-50
        bg-white
        transition-opacity
        duration-300

        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <div
        className="
          container
          py-8
        "
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-8
          "
        >
          <h2
            className="
              text-2xl
              font-semibold
              text-gray-800
            "
          >
            Search
          </h2>

          <button onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        {/* Search Input */}

        <div
          className="
            flex
            items-center
            gap-3
            border
            border-pink-200
            rounded-full
            px-5
            py-3
          "
        >
          <Search size={20} />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && query.trim()) {
                window.location.href = `/products?query=${encodeURIComponent(query)}`;

                onClose();
              }
            }}
            placeholder="Search products..."
            className="
              w-full
              outline-none
            "
          />
        </div>

        {/* Results */}

        {/* Results */}

        {query &&
          (results.length === 0 ? (
            <p
              className="
          mt-8
          text-center
          text-gray-500
        "
            >
              No products found.
            </p>
          ) : (
            <div
              className="
          mt-8
          grid
          grid-cols-2
          md:grid-cols-4
          gap-6
        "
            >
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="
                  border
                  border-pink-100
                  rounded-xl
                  p-4
                "
                >
                  <h3
                    className="
                    text-gray-800
                    font-medium
                  "
                  >
                    {product.name}
                  </h3>

                  <p
                    className="
                    mt-2
                    text-pink-500
                  "
                  >
                    ৳{product.price}
                  </p>
                </Link>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

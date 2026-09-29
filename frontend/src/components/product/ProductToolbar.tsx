/**
 * Bandhon Noors Product Toolbar
 *
 * Product listing controls.
 *
 * Handles:
 * - Search
 * - Sorting
 *
 * Future:
 * - View modes
 * - Advanced filters
 */

"use client";

interface ProductToolbarProps {
  search: string;
  sort?: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  onSortChange?: (value: string) => void;
  onFilterClick?: () => void;
}

export default function ProductToolbar({
  search,
  sort,
  onSearchChange,
  onSearchSubmit,
  onSortChange,
  onFilterClick,
}: ProductToolbarProps) { 
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        mb-8
      "
    >
      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit?.();
          }}
          className="flex w-full gap-2 md:w-auto"
        >
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="
              min-w-0
              flex-1
              border
              border-pink-200
              rounded-full
              px-5
              py-2
              md:w-80
              outline-none
              text-gray-700
            "
          />

          <button
            type="submit"
            className="
              rounded-full
              bg-[#D88C9A]
              px-5
              py-2
              text-white
              hover:bg-[#C97B89]
            "
          >
            Search
          </button>
        </form>
        <div
          className="
            flex
            justify-end
            gap-3
          "
        >
          <button
            onClick={onFilterClick}
            className="
              lg:hidden
              border
              border-pink-200
              rounded-full
              px-5
              py-2
              text-sm
              text-gray-700
            "
          >
            Filters
          </button>

          <select
            value={sort}
            aria-label="Sort products"
            onChange={(event) => onSortChange?.(event.target.value)}
            className="
        border
        border-pink-200
        rounded-full
        px-5
        py-2
        text-sm
        text-gray-700
        outline-none
      "
          >
            <option value="">Sort By</option>

            <option value="newest">Newest</option>

            <option value="price-low">Price: Low to High</option>

            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}

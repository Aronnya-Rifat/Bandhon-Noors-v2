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

  onSearchChange: (value: string) => void;

  onSortChange?: (value: string) => void;

  onFilterClick?: () => void;
}

export default function ProductToolbar({
  search,

  onSearchChange,

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
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products..."
          className="
            border
            border-pink-200
            rounded-full
            px-5
            py-2
            w-full
            md:w-80
            outline-none
            text-gray-700
          "
        />

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

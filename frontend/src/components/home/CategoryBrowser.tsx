"use client";

import Link from "next/link";
import StoreImage from "@/components/ui/StoreImage";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
  parent_id?: number | null;
}

interface Props {
  categories: Category[];
}

export default function CategoryBrowser({ categories }: Props) {
  const mainCategories = categories
  .filter(
    (category) =>
      category.parent_id === null
  )
  .sort(
    (a, b) =>
      a.id - b.id
  );

  const [selectedCategory, setSelectedCategory] =
    useState<number | undefined>();

  const selectedMain = mainCategories.find(
    (category) => category.id === selectedCategory,
  );

  const subCategories = categories
  .filter(
    (category) =>
      category.parent_id === selectedCategory
  )
  .sort(
    (a, b) =>
      a.id - b.id
  );

  const [page, setPage] = useState(0);

  const pageSize = 10;

  const visibleSubCategories = subCategories.slice(
    page * pageSize,
    page * pageSize + pageSize,
  );

  useEffect(() => {

    if (mainCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(mainCategories[0].id);
    }

    }, [mainCategories, selectedCategory]);

  return (
    <>
      {/* Main Categories */}

      <div
        className="
          grid
          grid-cols-3
          md:grid-cols-6
          gap-4
        "
      >
        {mainCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setPage(0);
            }}
            className="
                group
              "
          >
            <div
              className="
                  aspect-square
                  rounded-xl
                  overflow-hidden
                  bg-pink-50
                "
            >
              <StoreImage
                src={category.image_url ?? "/images/categories/placeholder.jpg"}
                alt={category.name}
                width={300}
                height={300}
                className="
                    w-full
                    h-full
                    object-cover
                    group-hover:scale-105
                    transition
                  "
              />
            </div>

            <p
              className="
                  text-center
                  mt-2
                  text-sm
                  font-medium
                  text-[#4A3B36]
                "
            >
              {category.name}
            </p>
          </button>
        ))}
      </div>

      {/* Sub Categories */}

      <div
        className="
          mt-10
        "
      >
        <div
          className="
            flex
            justify-between
            items-center
            mb-5
          "
        >
          <h3
            className="
              text-xl
              font-semibold
              text-[#3F312B]
            "
          >
            {selectedMain?.name} Collection
          </h3>

          <Link
            href={`/products?category=${selectedMain?.slug}`}
            className="
              text-sm
              text-rose-500
            "
          >
            View All
          </Link>
        </div>

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-5
            gap-4
          "
        >
          {visibleSubCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${selectedMain?.slug}&subcategory=${category.slug}`}
              className="
                  border
                  border-pink-100
                  rounded-xl
                  py-4
                  text-center
                  text-sm
                  hover:bg-pink-50
                  transition
                "
            >
              {category.name}
            </Link>
          ))}
        </div>

        {subCategories.length > pageSize && (
          <div
            className="
                flex
                justify-center
                gap-4
                mt-6
              "
          >
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="
                  text-sm
                  disabled:opacity-40
                "
            >
              ← Previous
            </button>

            <button
              disabled={(page + 1) * pageSize >= subCategories.length}
              onClick={() => setPage(page + 1)}
              className="
                  text-sm
                  disabled:opacity-40
                "
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

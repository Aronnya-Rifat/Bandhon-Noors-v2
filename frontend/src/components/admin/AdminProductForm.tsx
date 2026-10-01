"use client";

import { Fragment, SubmitEvent, useState } from "react";

import type { AdminProductCreate, AdminProductUpdate } from "@/types/admin";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

interface AdminProductFormProps {
  categories: Category[];
  product?: Product;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (product: AdminProductCreate | AdminProductUpdate) => Promise<void>;
  hasVariants: boolean;
  onHasVariantsChange: (value: boolean) => void;
}

export default function AdminProductForm({
  categories,
  product,
  isSubmitting,
  error,
  onSubmit,
  hasVariants,
  onHasVariantsChange,
}: AdminProductFormProps) {
  const [categoryId, setCategoryId] = useState(
    product?.category_id.toString() ?? "",
  );
  const [initialStock, setInitialStock] = useState("0");

  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [name, setName] = useState(product?.name ?? "");

  const [description, setDescription] = useState(product?.description ?? "");

  const [price, setPrice] = useState(product?.price.toString() ?? "");

  const [weight, setWeight] = useState(product?.weight?.toString() ?? "");

  const [sizeChart, setSizeChart] = useState(product?.size_chart ?? "");

  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const commonData = {
      category_id: Number(categoryId),
      name: name.trim(),
      description: description.trim() || undefined,
      price: Number(price),
      weight: weight ? Number(weight) : undefined,
      size_chart: sizeChart.trim() || undefined,
      is_featured: isFeatured,
      has_variants: hasVariants,
    };

    if (product) {
      await onSubmit(commonData);
      return;
    }

    await onSubmit({
      ...commonData,
      initial_stock: hasVariants ? 0 : Number(initialStock),
      low_stock_threshold: Number(lowStockThreshold),
    });
  }

  const activeCategories = categories
    .filter((category) => category.is_active)
    .sort((first, second) => first.id - second.id);

  const mainCategories = activeCategories.filter(
    (category) => category.parent_id === null,
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="
  grid
  gap-4
  border
  border-gray-200
  bg-white
  p-5
  md:grid-cols-2
"
    >
      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Category
        </label>

        <select
          id="category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          required
          className="w-full rounded-lg border px-4 py-3"
        >
          {mainCategories.map((mainCategory) => {
            const subcategories = activeCategories.filter(
              (category) => category.parent_id === mainCategory.id,
            );

            return (
              <Fragment key={mainCategory.id}>
                <option value={mainCategory.id}>
                  {mainCategory.id}. {mainCategory.name}
                </option>

                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    &nbsp;&nbsp;↳ {subcategory.id}. {subcategory.name}
                  </option>
                ))}
              </Fragment>
            );
          })}
        </select>
      </div>

      <div>
        

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Product Code
          </label>

          <div className="rounded-lg border bg-gray-50 px-4 py-3 text-gray-600">
            {product?.product_code ?? "Generated automatically after saving"}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="product-name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Product Name
        </label>

        <input
          id="product-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          minLength={2}
          maxLength={200}
          required
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div className="md:col-span-2">
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="h-32 w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="price"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Base Price
          </label>

          <input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="weight"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Weight
          </label>

          <input
            id="weight"
            type="number"
            min="0"
            step="0.01"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <label
          htmlFor="size-chart"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Size Guide
        </label>

        <textarea
          id="size-chart"
          value={sizeChart}
          onChange={(event) => setSizeChart(event.target.value)}
          className="h-28 w-full rounded-lg border px-4 py-3"
        />
      </div>

      <label className="flex items-center gap-3 md:col-span-2">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(event) => setIsFeatured(event.target.checked)}
        />
        Feature this product
      </label>
      <label className="flex items-start gap-3 border border-gray-200 bg-gray-50 p-4 md:col-span-2">
        <input
          type="checkbox"
          checked={hasVariants}
          onChange={(event) => onHasVariantsChange(event.target.checked)}
          className="mt-1"
        />

        <span>
          <span className="block text-sm font-medium text-gray-800">
            This product has variants
          </span>

          <span className="mt-1 block text-xs text-gray-500">
            Enable this for products with separate colors, sizes, or stock
            options.
          </span>
        </span>
      </label>
      {!hasVariants && !product && (
        <div className="grid gap-4 border border-gray-200 bg-gray-50 p-4 md:col-span-2 md:grid-cols-2">
          <div>
            <label
              htmlFor="initial-stock"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Initial Stock
            </label>

            <input
              id="initial-stock"
              type="number"
              min="0"
              step="1"
              value={initialStock}
              onChange={(event) => setInitialStock(event.target.value)}
              required
              className="w-full rounded-lg border bg-white px-4 py-3"
            />
          </div>

          <div>
            <label
              htmlFor="low-stock-threshold"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Low-stock Warning Level
            </label>

            <input
              id="low-stock-threshold"
              type="number"
              min="0"
              step="1"
              value={lowStockThreshold}
              onChange={(event) => setLowStockThreshold(event.target.value)}
              required
              className="w-full rounded-lg border bg-white px-4 py-3"
            />
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-600 md:col-span-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="
        
          md:col-span-2 md:w-fit
          rounded-full
          bg-[#D88C9A]
          px-8
          py-3
          text-white
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {isSubmitting
          ? "Saving..."
          : product
            ? "Save Changes"
            : "Create Product"}
      </button>
    </form>
  );
}

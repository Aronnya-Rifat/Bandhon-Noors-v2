"use client";

import { SubmitEvent, useState } from "react";

import type { AdminProductCreate, AdminProductUpdate } from "@/types/admin";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

interface AdminProductFormProps {
  categories: Category[];
  product?: Product;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (product: AdminProductCreate | AdminProductUpdate) => Promise<void>;
}

export default function AdminProductForm({
  categories,
  product,
  isSubmitting,
  error,
  onSubmit,
}: AdminProductFormProps) {
  const [categoryId, setCategoryId] = useState(
    product?.category_id.toString() ?? "",
  );

  const [productCode, setProductCode] = useState(product?.product_code ?? "");

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
    };

    if (product) {
      await onSubmit(commonData);
      return;
    }

    await onSubmit({
      ...commonData,
      product_code: productCode.trim(),
    });
  }

  const activeCategories = categories.filter((category) => category.is_active);

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
          <option value="">Select category</option>

          {activeCategories.map((category) => {
            const parent = categories.find(
              (candidate) => candidate.id === category.parent_id,
            );

            return (
              <option key={category.id} value={category.id}>
                {parent ? `${parent.name} — ${category.name}` : category.name}
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <label
          htmlFor="product-code"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Product Code
        </label>

        <input
          id="product-code"
          value={productCode}
          onChange={(event) => setProductCode(event.target.value)}
          disabled={Boolean(product)}
          minLength={2}
          maxLength={50}
          required
          className="w-full rounded-lg border px-4 py-3 disabled:bg-gray-100"
        />
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

"use client";

import { useEffect, useRef, useState } from "react";

import AdminMediaManager from "@/components/admin/AdminMediaManager";
import AdminProductForm from "@/components/admin/AdminProductForm";
import AdminVariantManager from "@/components/admin/AdminVariantManager";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  createAdminProduct,
  getAdminProducts,
  getAdminProductVariants,
  updateAdminProduct,
} from "@/services/admin-service";
import { getCategories } from "@/services/category-service";
import { useAuthStore } from "@/store/auth-store";
import type { AdminProductCreate, AdminProductUpdate } from "@/types/admin";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export default function AdminProductsPage() {
  const editorRef = useRef<HTMLDivElement>(null);

  const token = useAuthStore((state) => state.token);

  const [products, setProducts] = useState<Product[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [hasVariants, setHasVariants] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const [query, setQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const [page, setPage] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);

  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [workingProductId, setWorkingProductId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const accessToken = token;

    let cancelled = false;

    async function loadData() {
      try {
        const [productData, categoryData] = await Promise.all([
          getAdminProducts(accessToken, {
            page,
            query,
            categoryId: selectedCategoryId ?? undefined,
          }),
          getCategories(),
        ]);

        if (!cancelled) {
          setProducts(productData.items);

          setTotalProducts(productData.total);

          setTotalPages(productData.total_pages);

          if (page !== productData.page) {
            setPage(productData.page);
          }
          setCategories(categoryData);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load products.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [token, page, query, selectedCategoryId]);

  function scrollToEditor() {
    window.setTimeout(() => {
      editorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function startNewProduct() {
    setEditingProduct(null);
    setEditorKey((current) => current + 1);
    setError(null);
    setMessage(null);
    scrollToEditor();
    setHasVariants(false);
  }

  async function startEditing(product: Product) {
    setEditingProduct(product);
    setHasVariants(product.has_variants);
    setEditorKey((current) => current + 1);
    setError(null);
    setMessage(null);
    scrollToEditor();

    try {
      const variants = await getAdminProductVariants(product.id);

      setHasVariants(variants.length > 0);
    } catch {
      setError("Unable to check this product's variants.");
    }
  }

  async function saveProduct(data: AdminProductCreate | AdminProductUpdate) {
    if (!token) {
      return;
    }

    setError(null);
    setMessage(null);
    setIsSaving(true);

    try {
      if (editingProduct) {
        const updated = await updateAdminProduct(
          token,
          editingProduct.id,
          data as AdminProductUpdate,
        );

        setEditingProduct(updated);

        setProducts((items) =>
          items.map((item) => (item.id === updated.id ? updated : item)),
        );

        setMessage("Product updated.");
      } else {
        const created = await createAdminProduct(
          token,
          data as AdminProductCreate,
        );

        setProducts((items) => [created, ...items]);
        setEditingProduct(created);
        setHasVariants(created.has_variants);
        setEditorKey((current) => current + 1);

        setMessage(
          created.has_variants
            ? "Product created. Add its variants and images."
            : "Product created with its initial stock. Add product images.",
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to save the product.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleProduct(product: Product, update: AdminProductUpdate) {
    if (!token) {
      return;
    }

    setWorkingProductId(product.id);

    try {
      const updated = await updateAdminProduct(token, product.id, update);

      setProducts((items) =>
        items.map((item) => (item.id === updated.id ? updated : item)),
      );

      if (editingProduct?.id === updated.id) {
        setEditingProduct(updated);
      }
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to update the product.",
      );
    } finally {
      setWorkingProductId(null);
    }
  }
  function getProductCategory(product: Product) {
    const assignedCategory = categories.find(
      (category) => category.id === product.category_id,
    );

    if (!assignedCategory) {
      return {
        categoryName: "Unknown",
        subcategoryName: "—",
      };
    }

    if (assignedCategory.parent_id === null) {
      return {
        categoryName: assignedCategory.name,
        subcategoryName: "—",
      };
    }

    const parentCategory = categories.find(
      (category) => category.id === assignedCategory.parent_id,
    );

    return {
      categoryName: parentCategory?.name ?? "Unknown",
      subcategoryName: assignedCategory.name,
    };
  }
  return (
    <main className="container py-10">
      <div ref={editorRef} className="scroll-mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-300 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Product Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {editingProduct
                ? `Editing ${editingProduct.product_code}`
                : "Create a new product"}
            </p>
          </div>

          <button
            type="button"
            onClick={startNewProduct}
            className="bg-gray-800 px-5 py-2 text-sm text-white"
          >
            New Product
          </button>
        </div>

        {message && (
          <p className="mt-4 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </p>
        )}

        <div className="mt-5 grid items-stretch gap-5 xl:grid-cols-2">
          <AdminProductForm
            key={`${editorKey}-${editingProduct?.id ?? "new"}`}
            product={editingProduct ?? undefined}
            categories={categories}
            isSubmitting={isSaving}
            error={error}
            hasVariants={hasVariants}
            onHasVariantsChange={setHasVariants}
            onSubmit={saveProduct}
          />

          {editingProduct ? (
            <AdminMediaManager
              key={`media-${editingProduct.id}`}
              productId={editingProduct.id}
            />
          ) : (
            <div className="flex min-h-[500px] items-center justify-center border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <div>
                <p className="font-medium text-gray-700">Product images</p>

                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  Create the product first. The image selector will open here
                  immediately after the product receives its ID.
                </p>
              </div>
            </div>
          )}
        </div>

        {editingProduct && hasVariants && (
          <div className="mt-5">
            <AdminVariantManager
              key={`variants-${editingProduct.id}`}
              productId={editingProduct.id}
            />
          </div>
        )}
      </div>

      <section className="mt-12 border-t border-gray-300 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Existing Products
          </h2>

          <div className="flex w-full flex-wrap gap-3 md:w-auto">
            <select
              value={selectedCategoryId ?? ""}
              onChange={(event) => {
                setSelectedCategoryId(
                  event.target.value ? Number(event.target.value) : null,
                );

                setPage(1);
              }}
              className="w-full border bg-white px-4 py-2 md:w-56"
            >
              <option value="">All categories</option>

              {categories
                .filter((category) => category.parent_id === null)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>

            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);

                setPage(1);
              }}
              placeholder="Search name or code"
              className="w-full border bg-white px-4 py-2 md:w-80"
            />
          </div>
        </div>

        {isLoading ? (
          <p className="mt-6 text-gray-500">Loading products...</p>
        ) : (
          <div className="mt-5 overflow-x-auto border border-gray-200 bg-white">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="border-b bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Category</th>

                  <th className="px-4 py-3">Subcategory</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium">{product.name}</td>

                    <td className="px-4 py-3">{product.product_code}</td>
                    <td className="px-4 py-3">
                      {getProductCategory(product).categoryName}
                    </td>

                    <td className="px-4 py-3">
                      {getProductCategory(product).subcategoryName}
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(product.price)}
                    </td>

                    <td className="px-4 py-3">
                      {product.is_active ? "Active" : "Inactive"}
                    </td>

                    <td className="px-4 py-3">
                      {product.is_featured ? "Yes" : "No"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => void startEditing(product)}
                          className="text-blue-600"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={workingProductId === product.id}
                          onClick={() =>
                            void toggleProduct(product, {
                              is_featured: !product.is_featured,
                            })
                          }
                          className="text-pink-600"
                        >
                          {product.is_featured ? "Unfeature" : "Feature"}
                        </button>

                        <button
                          type="button"
                          disabled={workingProductId === product.id}
                          onClick={() =>
                            void toggleProduct(product, {
                              is_active: !product.is_active,
                            })
                          }
                          className="text-red-600"
                        >
                          {product.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                {totalProducts === 0
                  ? "No products found"
                  : `${totalProducts} products · Page ${page} of ${totalPages}`}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  className="border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

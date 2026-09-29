"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { getAdminDashboard, getAdminProducts } from "@/services/admin-service";
import { getCategories } from "@/services/category-service";
import { useAuthStore } from "@/store/auth-store";
import type { AdminDashboard } from "@/types/admin";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export default function AdminDashboardPage() {
  const token = useAuthStore((state) => state.token);

  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [productPage, setProductPage] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);

  const [totalProductPages, setTotalProductPages] = useState(1);

  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const accessToken = token;

    let cancelled = false;

    async function loadDashboard() {
      try {
        const [dashboardData, productData, categoryData] = await Promise.all([
          getAdminDashboard(accessToken),
          getAdminProducts(accessToken, {
            page: productPage,
          }),
          getCategories(),
        ]);

        if (!cancelled) {
          setDashboard(dashboardData);

          setProducts(productData.items);

          setTotalProducts(productData.total);

          setTotalProductPages(productData.total_pages);

          setCategories(categoryData);

          setProductsLoading(false);
        }
      } catch (requestError) {
        setProductsLoading(false);
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load the dashboard.",
          );
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [token, productPage]);
  function getProductCategory(product: Product) {
    const assignedCategory = categories.find(
      (category) => category.id === product.category_id,
    );

    if (!assignedCategory) {
      return {
        category: "Unknown",
        subcategory: "—",
      };
    }

    if (assignedCategory.parent_id === null) {
      return {
        category: assignedCategory.name,
        subcategory: "—",
      };
    }

    const parentCategory = categories.find(
      (category) => category.id === assignedCategory.parent_id,
    );

    return {
      category: parentCategory?.name ?? "Unknown",
      subcategory: assignedCategory.name,
    };
  }
  return (
    <main className="w-full px-4 py-8 md:px-8">
      <h1 className="text-3xl font-semibold text-[#3F312B]">Dashboard</h1>

      {error && (
        <p role="alert" className="mt-6 text-red-600">
          {error}
        </p>
      )}

      {!dashboard && !error ? (
        <p className="mt-8 text-gray-500">Loading dashboard...</p>
      ) : dashboard ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard label="Customers" value={dashboard.total_customers} />

          <DashboardCard label="Products" value={dashboard.total_products} />

          <DashboardCard label="Orders" value={dashboard.total_orders} />

          <DashboardCard
            label="Pending Orders"
            value={dashboard.pending_orders}
          />

          <DashboardCard
            label="Total Sales"
            value={formatCurrency(dashboard.total_sales)}
          />

          <DashboardCard
            label="Low Stock Variants"
            value={dashboard.low_stock_count}
          />
        </div>
      ) : null}
      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Current Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {totalProducts} products
            </p>
          </div>
        </div>

        {productsLoading ? (
          <p className="mt-5 text-sm text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="mt-5 border border-gray-200 bg-white p-6 text-sm text-gray-500">
            No products found.
          </div>
        ) : (
          <>
            <div className="mt-5 overflow-x-auto border border-gray-200 bg-white">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Product</th>

                    <th className="px-4 py-3">Code</th>

                    <th className="px-4 py-3">Category</th>

                    <th className="px-4 py-3">Subcategory</th>

                    <th className="px-4 py-3">Price</th>

                    <th className="px-4 py-3">Status</th>

                    <th className="px-4 py-3">Featured</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const category = getProductCategory(product);

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {product.name}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {product.product_code}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {category.category}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {category.subcategory}
                        </td>

                        <td className="px-4 py-3">
                          {formatCurrency(product.price)}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={
                              product.is_active
                                ? "text-green-700"
                                : "text-gray-500"
                            }
                          >
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {product.is_featured ? "Yes" : "No"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Page {productPage} of {totalProductPages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={productPage <= 1}
                  onClick={() =>
                    setProductPage((current) => Math.max(1, current - 1))
                  }
                  className="border bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={productPage >= totalProductPages}
                  onClick={() =>
                    setProductPage((current) =>
                      Math.min(totalProductPages, current + 1),
                    )
                  }
                  className="border bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function DashboardCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <section className="rounded-2xl border border-pink-100 bg-white p-6">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-3 text-3xl font-semibold text-gray-800">{value}</p>
    </section>
  );
}

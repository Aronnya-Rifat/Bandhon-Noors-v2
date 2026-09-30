"use client";

import {
  ChangeEvent,
  SubmitEvent,
  useEffect,
  useState,
} from "react";

import {
  ApiError,
  getApiAssetUrl,
} from "@/lib/api";
import { createSlug } from "@/lib/utils";
import {
  createAdminCategory,
  updateAdminCategory,
  uploadAdminCategoryImage,
} from "@/services/admin-service";
import { getCategories } from "@/services/category-service";
import { useAuthStore } from "@/store/auth-store";
import type { Category } from "@/types/category";

export default function AdminCategoriesPage() {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [editing, setEditing] =
    useState<Category | null>(null);

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [parentId, setParentId] =
    useState("");

  const [isWorking, setIsWorking] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Unable to load categories.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function resetForm() {
    setEditing(null);
    setName("");
    setSlug("");
    setDescription("");
    setParentId("");
    setError(null);
    setMessage(null);
  }

  function editCategory(
    category: Category,
  ) {
    setEditing(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(
      category.description ?? "",
    );
    setParentId(
      category.parent_id?.toString() ??
        "",
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token) {
      return;
    }

    setIsWorking(true);
    setError(null);
    setMessage(null);

    try {
      if (editing) {
        const updated =
          await updateAdminCategory(
            token,
            editing.id,
            {
              name: name.trim(),
              slug: slug.trim(),
              description:
                description.trim(),
              parent_id:
                parentId
                  ? Number(parentId)
                  : 0,
            },
          );

        setCategories((items) =>
          items.map((item) =>
            item.id === updated.id
              ? updated
              : item,
          ),
        );

        setEditing(updated);
        setMessage(
          "Category updated.",
        );
      } else {
        const created =
          await createAdminCategory(
            token,
            {
              name: name.trim(),
              slug:
                slug.trim() ||
                createSlug(name),
              description:
                description.trim() ||
                undefined,
              parent_id:
                parentId
                  ? Number(parentId)
                  : undefined,
            },
          );

        setCategories((items) => [
          ...items,
          created,
        ]);

        setEditing(created);
        setMessage(
          "Category created. You can now upload its image.",
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to save the category.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleImage(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (
      !file ||
      !token ||
      !editing
    ) {
      return;
    }

    setIsWorking(true);
    setError(null);

    try {
      const updated =
        await uploadAdminCategoryImage(
          token,
          editing.id,
          file,
        );

      setEditing(updated);

      setCategories((items) =>
        items.map((item) =>
          item.id === updated.id
            ? updated
            : item,
        ),
      );

      setMessage(
        "Category image uploaded.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to upload the image.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function toggleCategory(
    category: Category,
  ) {
    if (!token) {
      return;
    }

    setIsWorking(true);
    setError(null);

    try {
      const updated =
        await updateAdminCategory(
          token,
          category.id,
          {
            is_active:
              !category.is_active,
          },
        );

      setCategories((items) =>
        items.map((item) =>
          item.id === updated.id
            ? updated
            : item,
        ),
      );

      if (
        editing?.id === updated.id
      ) {
        setEditing(updated);
      }
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to update the category.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  const mainCategories =
    categories.filter(
      (category) =>
        category.parent_id === null,
    );

  return (
    <main className="container py-10">
      <div className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Category Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Maintain main categories and one level
          of subcategories.
        </p>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 border border-gray-200 bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">
              {editing
                ? "Edit Category"
                : "New Category"}
            </h2>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-blue-600"
              >
                New Category
              </button>
            )}
          </div>

          <input
            value={name}
            onChange={(event) => {
              const value =
                event.target.value;

              setName(value);

              if (!editing) {
                setSlug(
                  createSlug(value),
                );
              }
            }}
            required
            minLength={2}
            placeholder="Category name"
            className="border px-4 py-3"
          />

          <input
            value={slug}
            onChange={(event) =>
              setSlug(
                createSlug(
                  event.target.value,
                ),
              )
            }
            required
            placeholder="category-slug"
            className="border px-4 py-3"
          />

          <select
            value={parentId}
            onChange={(event) =>
              setParentId(
                event.target.value,
              )
            }
            className="border px-4 py-3"
          >
            <option value="">
              Main category
            </option>

            {mainCategories
              .filter(
                (category) =>
                  category.id !==
                  editing?.id,
              )
              .map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  Subcategory of{" "}
                  {category.name}
                </option>
              ))}
          </select>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            maxLength={500}
            placeholder="Description"
            className="h-28 border px-4 py-3"
          />

          {error && (
            <p
              role="alert"
              className="text-sm text-red-600"
            >
              {error}
            </p>
          )}

          {message && (
            <p className="text-sm text-green-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isWorking}
            className="w-fit bg-gray-800 px-6 py-2 text-sm text-white disabled:opacity-50"
          >
            {isWorking
              ? "Saving..."
              : editing
                ? "Save Changes"
                : "Create Category"}
          </button>
        </form>

        <section className="border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-800">
            Category Image
          </h2>

          {!editing ? (
            <p className="mt-4 text-sm text-gray-500">
              Create or select a category before
              uploading an image.
            </p>
          ) : (
            <>
              {editing.image_url ? (
                <img
                  src={getApiAssetUrl(
                    editing.image_url,
                  )}
                  alt={editing.name}
                  className="mt-4 aspect-square w-52 object-cover"
                />
              ) : (
                <div className="mt-4 flex aspect-square w-52 items-center justify-center bg-gray-100 text-sm text-gray-500">
                  No image
                </div>
              )}

              <label className="mt-4 inline-block cursor-pointer bg-gray-800 px-5 py-2 text-sm text-white">
                Upload Image

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isWorking}
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
            </>
          )}
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">
          Existing Categories
        </h2>

        {isLoading ? (
          <p className="mt-5 text-gray-500">
            Loading categories...
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto border border-gray-200 bg-white">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3">
                    Category
                  </th>
                  <th className="px-4 py-3">
                    Slug
                  </th>
                  <th className="px-4 py-3">
                    Parent
                  </th>
                  <th className="px-4 py-3">
                    Status
                  </th>
                  <th className="px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map(
                  (category) => {
                    const parent =
                      categories.find(
                        (candidate) =>
                          candidate.id ===
                          category.parent_id,
                      );

                    return (
                      <tr
                        key={category.id}
                        className="border-b border-gray-100"
                      >
                        <td className="px-4 py-3 font-medium">
                          {category.name}
                        </td>

                        <td className="px-4 py-3">
                          {category.slug}
                        </td>

                        <td className="px-4 py-3">
                          {parent?.name ??
                            "Main"}
                        </td>

                        <td className="px-4 py-3">
                          {category.is_active
                            ? "Active"
                            : "Inactive"}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                editCategory(
                                  category,
                                )
                              }
                              className="text-blue-600"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              disabled={isWorking}
                              onClick={() =>
                                void toggleCategory(
                                  category,
                                )
                              }
                              className="text-red-600"
                            >
                              {category.is_active
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

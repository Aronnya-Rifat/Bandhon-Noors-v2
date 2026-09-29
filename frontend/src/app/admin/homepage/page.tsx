"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Trash2,
} from "lucide-react";

import {
  ApiError,
  getApiAssetUrl,
} from "@/lib/api";
import {
  deleteAdminHomepageContent,
  getAdminHomepageContent,
  reorderAdminHomepageContent,
  updateAdminHomepageContent,
  uploadAdminHeroImage,
} from "@/services/homepage-service";
import { useAuthStore } from "@/store/auth-store";
import type {
  HomepageContent,
} from "@/types/homepage";

export default function AdminHomepagePage() {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const [items, setItems] =
    useState<HomepageContent[]>([]);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isWorking, setIsWorking] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const accessToken = token;
    let cancelled = false;

    async function loadContent() {
      try {
        const data =
          await getAdminHomepageContent(
            accessToken,
          );

        if (!cancelled) {
          setItems(data);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load homepage content.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadContent();

    return () => {
      cancelled = true;
    };
  }, [token]);

  function clearSelection() {
    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl,
      );
    }

    setSelectedFile(null);
    setPreviewUrl(null);
  }

  function handleFileSelection(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setError(
        "Choose a JPG, PNG, or WebP image.",
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "The image must be 5 MB or smaller.",
      );
      return;
    }

    clearSelection();
    setError(null);
    setMessage(null);
    setSelectedFile(file);
    setPreviewUrl(
      URL.createObjectURL(file),
    );
  }

  async function handleUpload() {
    if (
      !token ||
      !selectedFile
    ) {
      return;
    }

    setIsWorking(true);
    setError(null);
    setMessage(null);

    try {
      const created =
        await uploadAdminHeroImage(
          token,
          selectedFile,
        );

      const refreshed =
        await getAdminHomepageContent(
          token,
        );

      setItems(refreshed);
      clearSelection();

      setMessage(
        `Hero image ${created.id} uploaded.`,
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

  async function handleStatusChange(
    item: HomepageContent,
  ) {
    if (!token) {
      return;
    }

    setIsWorking(true);
    setError(null);

    try {
      const updated =
        await updateAdminHomepageContent(
          token,
          item.id,
          {
            is_active:
              !item.is_active,
          },
        );

      setItems((current) =>
        current.map(
          (existing) =>
            existing.id ===
            updated.id
              ? updated
              : existing,
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to update the image.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function moveItem(
    index: number,
    direction: -1 | 1,
  ) {
    if (!token) {
      return;
    }

    const nextIndex =
      index + direction;

    if (
      nextIndex < 0 ||
      nextIndex >= items.length
    ) {
      return;
    }

    const reordered = [
      ...items,
    ];

    [
      reordered[index],
      reordered[nextIndex],
    ] = [
      reordered[nextIndex],
      reordered[index],
    ];

    setItems(reordered);
    setIsWorking(true);
    setError(null);

    try {
      const updated =
        await reorderAdminHomepageContent(
          token,
          reordered.map(
            (item) => item.id,
          ),
        );

      setItems(updated);
    } catch (requestError) {
      setItems(items);

      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to reorder the images.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleDelete(
    item: HomepageContent,
  ) {
    if (
      !token ||
      !window.confirm(
        "Delete this homepage image?",
      )
    ) {
      return;
    }

    setIsWorking(true);
    setError(null);
    setMessage(null);

    try {
      await deleteAdminHomepageContent(
        token,
        item.id,
      );

      setItems((current) =>
        current.filter(
          (existing) =>
            existing.id !==
            item.id,
        ),
      );

      setMessage(
        "Homepage image deleted.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to delete the image.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  const heroItems =
    items.filter(
      (item) =>
        item.section_name ===
        "hero",
    );

  return (
    <main className="w-full px-4 py-8 md:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Homepage
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the homepage hero slider.
          A maximum of five images is kept.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {message && (
        <p className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      )}

      <section className="mt-6 border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Upload hero image
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Images are saved at
            1600 × 1000 pixels.
          </p>
        </div>

        <div className="p-5">
          <label className="inline-flex cursor-pointer items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <ImagePlus size={18} />

            Choose image

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleFileSelection
              }
              className="hidden"
            />
          </label>

          {previewUrl && (
            <div className="mt-5 max-w-2xl">
              <div className="aspect-[8/5] overflow-hidden border bg-gray-100">
                <img
                  src={previewUrl}
                  alt="Selected hero preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={isWorking}
                  onClick={() =>
                    void handleUpload()
                  }
                  className="bg-gray-900 px-5 py-2 text-sm text-white disabled:opacity-50"
                >
                  {isWorking
                    ? "Uploading..."
                    : "Upload image"}
                </button>

                <button
                  type="button"
                  disabled={isWorking}
                  onClick={
                    clearSelection
                  }
                  className="border px-5 py-2 text-sm text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Hero slider images
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {heroItems.length} of 5 images
            </p>
          </div>
        </div>

        {isLoading ? (
          <p className="mt-5 text-sm text-gray-500">
            Loading homepage content...
          </p>
        ) : heroItems.length === 0 ? (
          <div className="mt-5 border border-gray-200 bg-white p-6 text-sm text-gray-500">
            No hero images have been uploaded.
          </div>
        ) : (
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            {heroItems.map(
              (item, index) => (
                <article
                  key={item.id}
                  className="border border-gray-200 bg-white"
                >
                  <div className="aspect-[8/5] overflow-hidden bg-gray-100">
                    {item.image_url ? (
                      <img
                        src={getApiAssetUrl(
                          item.image_url,
                        )}
                        alt={
                          item.title ??
                          "Homepage hero image"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Position {index + 1}
                      </p>

                      <p
                        className={`mt-1 text-xs ${
                          item.is_active
                            ? "text-green-700"
                            : "text-gray-500"
                        }`}
                      >
                        {item.is_active
                          ? "Visible"
                          : "Hidden"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Move image up"
                        disabled={
                          isWorking ||
                          index === 0
                        }
                        onClick={() =>
                          void moveItem(
                            index,
                            -1,
                          )
                        }
                        className="border p-2 disabled:opacity-30"
                      >
                        <ArrowUp size={17} />
                      </button>

                      <button
                        type="button"
                        aria-label="Move image down"
                        disabled={
                          isWorking ||
                          index ===
                            heroItems.length -
                              1
                        }
                        onClick={() =>
                          void moveItem(
                            index,
                            1,
                          )
                        }
                        className="border p-2 disabled:opacity-30"
                      >
                        <ArrowDown size={17} />
                      </button>

                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() =>
                          void handleStatusChange(
                            item,
                          )
                        }
                        className="border px-3 py-2 text-xs text-gray-700 disabled:opacity-50"
                      >
                        {item.is_active
                          ? "Hide"
                          : "Show"}
                      </button>

                      <button
                        type="button"
                        aria-label="Delete image"
                        disabled={isWorking}
                        onClick={() =>
                          void handleDelete(
                            item,
                          )
                        }
                        className="border border-red-200 p-2 text-red-600 disabled:opacity-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </main>
  );
}

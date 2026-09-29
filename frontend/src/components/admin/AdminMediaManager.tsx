"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import Cropper, {
  type Area,
} from "react-easy-crop";

import {
  ApiError,
  getApiAssetUrl,
} from "@/lib/api";
import { createCroppedImage } from "@/lib/crop-image";
import {
  deleteAdminProductMedia,
  getAdminProductMedia,
  uploadAdminProductImage,
} from "@/services/admin-service";
import { useAuthStore } from "@/store/auth-store";
import type {
  AdminProductMedia,
} from "@/types/admin";

interface AdminMediaManagerProps {
  productId: number;
}

export default function AdminMediaManager({
  productId,
}: AdminMediaManagerProps) {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const [media, setMedia] =
    useState<AdminProductMedia[]>([]);

  const [altText, setAltText] =
    useState("");

  const [isPrimary, setIsPrimary] =
    useState(false);

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [selectedName, setSelectedName] =
    useState("");

  const [crop, setCrop] =
    useState({
      x: 0,
      y: 0,
    });

  const [zoom, setZoom] =
    useState(1);

  const [
    croppedArea,
    setCroppedArea,
  ] = useState<Area | null>(null);

  const [isWorking, setIsWorking] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getAdminProductMedia(
      productId,
    )
      .then((items) => {
        if (!cancelled) {
          setMedia(items);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load media.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  function closeCropper() {
    if (selectedImage) {
      URL.revokeObjectURL(
        selectedImage,
      );
    }

    setSelectedImage(null);
    setSelectedName("");
    setCroppedArea(null);
    setCrop({
      x: 0,
      y: 0,
    });
    setZoom(1);
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

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "The image must be 5 MB or smaller.",
      );
      return;
    }

    setError(null);
    setSelectedName(file.name);

    setSelectedImage(
      URL.createObjectURL(file),
    );
  }

  async function handleUpload() {
    if (
      !token ||
      !selectedImage ||
      !croppedArea
    ) {
      return;
    }

    setError(null);
    setIsWorking(true);

    try {
      const croppedFile =
        await createCroppedImage(
          selectedImage,
          croppedArea,
          selectedName,
        );

      await uploadAdminProductImage(
        token,
        productId,
        croppedFile,
        {
          altText:
            altText.trim() ||
            undefined,
          displayOrder:
            media.length,
          isPrimary:
            isPrimary ||
            media.length === 0,
        },
      );

      const refreshed =
        await getAdminProductMedia(
          productId,
        );

      setMedia(refreshed);
      setAltText("");
      setIsPrimary(false);
      closeCropper();
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : requestError instanceof Error
            ? requestError.message
            : "Unable to upload the image.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleDelete(
    mediaId: number,
  ) {
    if (
      !token ||
      !window.confirm(
        "Remove this product image?",
      )
    ) {
      return;
    }

    setIsWorking(true);
    setError(null);

    try {
      await deleteAdminProductMedia(
        token,
        mediaId,
      );

      setMedia((items) =>
        items.filter(
          (item) =>
            item.id !== mediaId,
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to remove the image.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <section className="border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="font-semibold text-gray-800">
          Product Media
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Images are cropped to 4:5 and saved
          at 1200 × 1500.
        </p>
      </div>

      <div className="p-5">
        {error && (
          <p
            role="alert"
            className="mb-4 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={altText}
            onChange={(event) =>
              setAltText(
                event.target.value,
              )
            }
            placeholder="Image description"
            className="border px-3 py-2"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(event) =>
                setIsPrimary(
                  event.target.checked,
                )
              }
            />

            Set as primary image
          </label>
        </div>

        <label className="mt-4 inline-block cursor-pointer bg-gray-800 px-5 py-2 text-sm text-white">
          Select and Crop Image

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelection}
            className="hidden"
          />
        </label>

        {media.length === 0 ? (
          <p className="mt-5 text-sm text-gray-500">
            No product images uploaded.
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 p-2"
              >
                <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                  <img
                    src={getApiAssetUrl(
                      item.thumbnail_url ??
                        item.file_url,
                    )}
                    alt={
                      item.alt_text ??
                      "Product image"
                    }
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500">
                    {item.is_primary
                      ? "Primary"
                      : `Order ${item.display_order}`}
                  </span>

                  <button
                    type="button"
                    disabled={isWorking}
                    onClick={() =>
                      void handleDelete(
                        item.id,
                      )
                    }
                    className="text-xs text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl bg-white">
            <div className="border-b px-5 py-4">
              <h3 className="font-semibold text-gray-800">
                Crop Product Image
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Move and zoom the image inside
                the 4:5 frame.
              </p>
            </div>

            <div className="relative h-[60vh] min-h-96 bg-black">
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={4 / 5}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(
                  _,
                  pixels,
                ) =>
                  setCroppedArea(
                    pixels,
                  )
                }
              />
            </div>

            <div className="space-y-4 p-5">
              <label className="block text-sm text-gray-700">
                Zoom

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(event) =>
                    setZoom(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  className="mt-2 w-full"
                />
              </label>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isWorking}
                  onClick={closeCropper}
                  className="border border-gray-300 px-5 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    isWorking ||
                    !croppedArea
                  }
                  onClick={() =>
                    void handleUpload()
                  }
                  className="bg-gray-800 px-5 py-2 text-sm text-white disabled:opacity-50"
                >
                  {isWorking
                    ? "Uploading..."
                    : "Crop and Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

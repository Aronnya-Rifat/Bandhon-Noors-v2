/**
 * Bandhon Noors Product Gallery
 *
 * Displays:
 * - Main product image
 * - Thumbnail images
 *
 * Future:
 * - Zoom
 * - Video preview
 * - Variant image switching
 */

"use client";

import { type MouseEvent, useState } from "react";

import { Search } from "lucide-react";

import StoreImage from "@/components/ui/StoreImage";

import type { ProductMedia } from "@/types/product";

interface ProductGalleryProps {
  images: ProductMedia[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ProductMedia | null>(
    images[0] ?? null,
  );
  const [showZoom, setShowZoom] = useState(false);

  const [zoomPosition, setZoomPosition] = useState({
    left: 0,
    top: 0,
    backgroundLeft: 0,
    backgroundTop: 0,
    backgroundWidth: 0,
    backgroundHeight: 0,
  });

  function handleZoomMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();

    const zoomLevel = 2.5;
    const lensSize = 280;

    const pointerX = event.clientX - bounds.left;

    const pointerY = event.clientY - bounds.top;

    const x = Math.min(Math.max(pointerX, 0), bounds.width);

    const y = Math.min(Math.max(pointerY, 0), bounds.height);

    setZoomPosition({
      left: x,
      top: y,

      backgroundWidth: bounds.width * zoomLevel,

      backgroundHeight: bounds.height * zoomLevel,

      backgroundLeft: lensSize / 2 - x * zoomLevel,

      backgroundTop: lensSize / 2 - y * zoomLevel,
    });
  }
  if (!images.length || !selectedImage) {
    return (
      <div
        className="
          aspect-[4/5]
          rounded-2xl
          bg-pink-50
          flex
          items-center
          justify-center
          text-gray-400
        "
      >
        No image available
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}

      <div
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleZoomMove}
        className="
    relative
    aspect-[4/5]
    cursor-zoom-in
    overflow-hidden
    rounded-2xl
    bg-pink-50
  "
      >
        <StoreImage
          src={selectedImage.file_url}
          alt={selectedImage.alt_text ?? "Product image"}
          width={800}
          height={1000}
          className="
            w-full
            h-full
            object-cover
          "
        />
        <div className="pointer-events-none absolute right-4 top-4 hidden items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs text-gray-700 shadow-sm md:flex">
          <Search size={15} />
          Hover to zoom
        </div>

        {showZoom && (
          <div
            aria-hidden="true"
            className="
      pointer-events-none
      absolute
      hidden
      h-[280px]
w-[280px]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      border-4
      border-white
      bg-no-repeat
      shadow-2xl
      md:block
    "
            style={{
              left: zoomPosition.left,
              top: zoomPosition.top,
              backgroundImage: `url("${selectedImage.file_url}")`,
              backgroundSize: `${zoomPosition.backgroundWidth}px ${zoomPosition.backgroundHeight}px`,

              backgroundPosition: `${zoomPosition.backgroundLeft}px ${zoomPosition.backgroundTop}px`,
            }}
          />
        )}
      </div>

      {/* Thumbnails */}

      <div
        className="
          mt-5
          flex
          gap-4
          overflow-x-auto
        "
      >
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => {
              setSelectedImage(image);

              setShowZoom(false);
            }}
            className="
                  shrink-0
                  rounded-xl
                  overflow-hidden
                  border
                  border-pink-100
                "
          >
            <StoreImage
              src={image.thumbnail_url ?? image.file_url}
              alt={image.alt_text ?? "Thumbnail"}
              width={80}
              height={100}
              className="
                    h-24
                    w-[77px]
                    object-cover
                  "
            />
          </button>
        ))}
      </div>
    </div>
  );
}

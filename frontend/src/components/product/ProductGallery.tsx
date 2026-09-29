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


import { useState } from "react";

import StoreImage from "@/components/ui/StoreImage";

import type { ProductMedia } from "@/types/product";



interface ProductGalleryProps {

  images: ProductMedia[];

}



export default function ProductGallery({
  images,
}: ProductGalleryProps) {


  const [selectedImage, setSelectedImage] =
    useState(
      images[0]
    );



  if (!images.length) {

    return (

      <div
        className="
          aspect-square
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
        className="
          aspect-square
          overflow-hidden
          rounded-2xl
          bg-pink-50
        "
      >

        <StoreImage

          src={
            selectedImage.file_url
          }

          alt={
            selectedImage.alt_text ??
            "Product image"
          }

          width={800}

          height={800}

          className="
            w-full
            h-full
            object-cover
          "

        />

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

        {
          images.map(
            (image) => (

              <button

                key={image.id}

                onClick={() =>
                  setSelectedImage(image)
                }

                className="
                  shrink-0
                  rounded-xl
                  overflow-hidden
                  border
                  border-pink-100
                "

              >

                <StoreImage

                  src={
                    image.thumbnail_url ??
                    image.file_url
                  }

                  alt={
                    image.alt_text ??
                    "Thumbnail"
                  }

                  width={100}

                  height={100}

                  className="
                    w-20
                    h-20
                    object-cover
                  "

                />

              </button>

            )
          )
        }

      </div>


    </div>

  );

}

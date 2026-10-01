/**
 * Bandhon Noors Product Detail Page
 *
 * Dynamic product page.
 *
 * Handles:
 * - Product image
 * - Product information
 * - Price
 * - Variants
 * - Add to cart
 *
 * Future:
 * Data source:
 * GET /products/{id}
 */

import type {
  Metadata,
} from "next";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api";
import ProductPurchase from "@/components/product/ProductPurchase";
import ProductInfo from "@/components/product/ProductInfo";
import ProductGallery from "@/components/product/ProductGallery";
import ProductReviews from "@/components/review/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import {
  getProductById,
  getProductsByCategory,
} from "@/services/product-service";
import { getProductReviews } from "@/services/review-service";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  const productId = Number(id);

  if (
    !Number.isInteger(productId) ||
    productId <= 0
  ) {
    return {
      title: "Product not found",
    };
  }

  try {
    const product =
      await getProductById(
        productId,
      );

    const description =
      product.description?.slice(
        0,
        160,
      ) ||
      `Shop ${product.name} from Bandhon Noors.`;

    const image =
      product.images[0]?.file_url ||
      product.thumbnail_url ||
      "/logo.png";

    return {
      title: product.name,
      description,

      openGraph: {
        title: product.name,
        description,
        type: "website",
        images: [
          {
            url: image,
            alt: product.name,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: product.name,
        description,
        images: [
          image,
        ],
      },
    };
  } catch {
    return {
      title: "Product",
    };
  }
}
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const product = await getProductById(productId).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  });
  const reviews = await getProductReviews(product.id);
  const categoryProducts = await getProductsByCategory(product.category_id);

  const relatedProducts = categoryProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <main
      className="
        container
        py-16
      "
    >
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-12
        "
      >
        {/* Product Image */}

        <ProductGallery images={product.images} />

        {/* Product Information */}

        <div>
          <ProductInfo product={product} />
          <ProductPurchase product={product} variants={product.variants} />
        </div>
      </div>
      <ProductReviews productId={product.id} initialReviews={reviews} />

      <RelatedProducts products={relatedProducts} />
    </main>
  );
}

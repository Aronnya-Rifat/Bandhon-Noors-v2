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

import { notFound } from "next/navigation";

import { getProductById } from "@/services/product-service";
import ProductPurchase from "@/components/product/ProductPurchase";
import ProductInfo from "@/components/product/ProductInfo";
import ProductGallery from "@/components/product/ProductGallery";
import ProductReviews from "@/components/review/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";

import { getProducts } from "@/services/product-service";
import { productReviews } from "@/data/product-reviews";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await getProductById(Number(id));
  const allProducts = await getProducts();

  const relatedProducts = allProducts
    .filter((item) => item.id !== Number(id))
    .slice(0, 4);

  if (!product) {
    notFound();
  }

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
      <ProductReviews reviews={productReviews} />

      <RelatedProducts products={relatedProducts} />
    </main>
  );
}

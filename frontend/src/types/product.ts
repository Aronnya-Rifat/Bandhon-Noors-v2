/**
 * Product related TypeScript definitions.
 *
 * These types match the FastAPI backend
 * product responses.
 */


/**
 * Product media.
 *
 * Images and videos connected
 * to a product.
 */
export interface ProductMedia {

  id: number;

  file_url: string;

  thumbnail_url: string | null;

  alt_text: string | null;

  media_type:
    | "IMAGE"
    | "VIDEO";

  display_order: number;
}


/**
 * Product card response.
 *
 * Used for:
 *
 * - Homepage
 * - Collection pages
 * - Search results
 */
export interface ProductCardProduct {

  id: number;

  name: string;

  price: number;

  thumbnail_url: string | null;

  category_name: string | null;

  category_id: number;

}
/**
 * Product listing response.
 *
 * Used for:
 *
 * - /products page
 * - collection pages
 * - filtering
 */
export interface ProductListingProduct
  extends ProductCardProduct {

  product_code: string;

  category_id: number;

  is_featured: boolean;

  variants: ProductVariant[];


}
/**
 * Product variant.
 *
 * Example:
 *
 * Pink / Medium
 * Blue / Large
 */
export interface ProductVariant {

  id: number;

  color_theme: string | null;

  size: string | null;

  stock_quantity: number;

  additional_price: number;
}


/**
 * Basic product response.
 *
 * Used for:
 *
 * - product cards
 * - listings
 * - search results
 */
export interface Product {

  id: number;

  category_id: number;

  product_code: string;

  name: string;

  description: string | null;

  price: number;

  weight: number | null;

  size_chart: string | null;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}


/**
 * Product details page response.
 *
 * Includes:
 *
 * - images
 * - variants
 */
export interface ProductDetail
  extends Omit<Product,
    "category_id"
    | "is_active"
    | "created_at"
    | "updated_at"
  > {

  images: ProductMedia[];

  variants: ProductVariant[];
}

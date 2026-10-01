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
  product_code: string;
  name: string;
  price: number;
  category_id: number;
  category_name: string | null;
  subcategory_id: number | null;
  subcategory_name: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  is_featured: boolean;
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
export type ProductListingProduct = ProductCardProduct;
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
  variant_code: string;
  color_theme: string | null;
  size: string | null;
  stock_quantity: number;
  additional_price: number | null;
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

  has_variants: boolean;

  name: string;

  description: string | null;

  price: number;

  weight: number | null;

  size_chart: string | null;

  is_active: boolean;

  is_featured: boolean;

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
export interface ProductDetailResponse extends ProductCardProduct {
  has_variants: boolean;
  description: string | null;
  weight: number | null;
  size_chart: string | null;
  media: ProductMedia[];
  variants: ProductVariant[];
}

export interface ProductDetail
  extends Omit<ProductDetailResponse, "media"> {
  images: ProductMedia[];
}


export interface ProductPage {
  items: ProductCardProduct[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProductFilterOptions {
  sizes: string[];
  colors: string[];
}

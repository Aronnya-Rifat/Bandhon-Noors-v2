/**
 * Category related TypeScript definitions.
 *
 * Matches the backend CategoryResponse schema.
 */


/**
 * Basic category response.
 *
 * Example:
 *
 * Women
 * Saree
 * Panjabi
 */
export interface Category {

  id: number;

  name: string;

  slug: string;

  description: string | null;

  image_url: string | null;

  parent_id: number | null;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}


/**
 * Category used for storefront display.
 *
 * Used later for:
 *
 * - Homepage category cards
 * - Navigation menus
 */
export interface CategoryCard {

  id: number;

  name: string;

  slug: string;

  description: string | null;

  image_url: string | null;
}

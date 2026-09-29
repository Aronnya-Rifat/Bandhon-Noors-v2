/**
 * Shared frontend utility functions.
 *
 * This file contains reusable helpers
 * used across the Bandhon Noors website.
 */


/**
 * Format currency for Bangladesh market.
 *
 * Example:
 *
 * 5500
 *
 * becomes:
 *
 * ৳5,500
 */
export function formatCurrency(
  amount: number,
): string {
  return new Intl.NumberFormat(
    "en-BD",
    {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    },
  ).format(amount);
}


/**
 * Combine conditional CSS classes.
 *
 * Example:
 *
 * cn(
 *   "button",
 *   isActive && "active"
 * )
 */
export function cn(
  ...classes: Array<
    string | false | null | undefined
  >
): string {
  return classes
    .filter(Boolean)
    .join(" ");
}


/**
 * Create a URL-friendly slug.
 *
 * Example:
 *
 * Pink Embroidered Saree
 *
 * becomes:
 *
 * pink-embroidered-saree
 */
export function createSlug(
  text: string,
): string {
  return text
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /(^-|-$)/g,
      "",
    );
}
/**
 * Bandhon Noors Product Detail Mock Data
 *
 * Temporary data for product pages.
 *
 * Later replaced by:
 *
 * GET /products/{id}
 */


import type {
  ProductDetail,
} from "@/types/product";



export const productDetails: ProductDetail[] = [

  {
    id: 1,

    product_code: "BN-W-SAREE-001",

    name: "Hand Embroidered Saree",

    description:
      "A premium traditional saree featuring elegant handcrafted details inspired by Bengali heritage.",

    price: 5500,

    weight: 800,

    size_chart:
      "Free Size",

    images: [

      {
        id: 1,
        file_url: "/images/products/saree.jpg",
        thumbnail_url: "/images/products/saree.jpg",
        alt_text: "Hand Embroidered Saree",
        media_type: "IMAGE",
        display_order: 1,
      },

    ],

    variants: [

      {
        id: 1,
        color_theme: "Pink",
        size: "Free Size",
        stock_quantity: 5,
        additional_price: 0,
      },

    ],

  },

];

/**
 * Bandhon Noors Product Mock Data
 *
 * Temporary frontend data.
 *
 * Later replaced by:
 * GET /products
 */


import type { ProductCardProduct } from "@/types/product";


export const featuredProducts: ProductCardProduct[] = [

  {
    id: 1,

    name: "Hand Embroidered Saree",

    price: 5500,

    thumbnail_url:
      "/images/products/saree.jpg",

    category_name:
      "Women",
  },


  {
    id: 2,

    name: "Elegant Cotton Kurti",

    price: 2500,

    thumbnail_url:
      "/images/products/kurti.jpg",

    category_name:
      "Women",
  },


  {
    id: 3,

    name: "Traditional Punjabi",

    price: 3200,

    thumbnail_url:
      "/images/products/punjabi.jpg",

    category_name:
      "Men",
  },


  {
    id: 4,

    name: "Handmade Jute Bag",

    price: 1200,

    thumbnail_url:
      "/images/products/jute-bag.jpg",

    category_name:
      "Jute Products",
  },

];

/**
 * Bandhon Noors Categories
 *
 * Temporary frontend data.
 *
 * Later replaced by:
 * GET /categories
 */


export interface Category {

  id: number;

  name: string;

  image: string;

  href: string;

}


export const categories: Category[] = [

  {
    id: 1,
    name: "Women",
    image: "/images/categories/women.jpg",
    href: "/collections/women",
  },


  {
    id: 2,
    name: "Men",
    image: "/images/categories/men.jpg",
    href: "/collections/men",
  },


  {
    id: 3,
    name: "Baby",
    image: "/images/categories/baby.jpg",
    href: "/collections/baby",
  },


  {
    id: 4,
    name: "Jute Products",
    image: "/images/categories/jute.jpg",
    href: "/collections/jute",
  },


  {
    id: 5,
    name: "Pearl Ornaments",
    image: "/images/categories/pearls.jpg",
    href: "/collections/pearls",
  },

];

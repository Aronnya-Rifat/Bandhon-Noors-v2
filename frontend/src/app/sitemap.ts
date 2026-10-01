import type {
  MetadataRoute,
} from "next";

import {
  getCategories,
} from "@/services/category-service";
import {
  getProducts,
} from "@/services/product-service";


const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");


export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  const staticPages:
    MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/collections`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/faq`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/shipping`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/returns`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const categories =
      await getCategories();

    const categoryPages:
      MetadataRoute.Sitemap =
      categories.map(
        (category) => ({
          url:
            `${SITE_URL}/collections/` +
            encodeURIComponent(
              category.slug,
            ),

          changeFrequency:
            "weekly",

          priority:
            category.parent_id === null
              ? 0.8
              : 0.7,
        }),
      );

    const firstPage =
      await getProducts({
        page: 1,
        pageSize: 48,
      });

    const products = [
      ...firstPage.items,
    ];

    for (
      let page = 2;
      page <= firstPage.total_pages;
      page += 1
    ) {
      const result =
        await getProducts({
          page,
          pageSize: 48,
        });

      products.push(
        ...result.items,
      );
    }

    const productPages:
      MetadataRoute.Sitemap =
      products.map(
        (product) => ({
          url:
            `${SITE_URL}/product/` +
            product.id,

          changeFrequency:
            "weekly",

          priority: 0.7,
        }),
      );

    return [
      ...staticPages,
      ...categoryPages,
      ...productPages,
    ];
  } catch {
    return staticPages;
  }
}

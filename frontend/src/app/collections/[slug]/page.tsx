/**
 * Bandhon Noors Collection Page
 *
 * Dynamic collection page.
 *
 * Examples:
 * /collections/women
 * /collections/men
 * /collections/baby
 *
 * Displays:
 * - Collection title
 * - Products from category
 * - Products from subcategories
 */


import { notFound } from "next/navigation";


import ProductListing from "@/components/product/ProductListing";


import {
  getCategories,
} from "@/services/category-service";


import {
  getProductsByCategory,
} from "@/services/product-service";



interface CollectionPageProps {

  params: Promise<{
    slug: string;
  }>;

}



export default async function CollectionPage({
  params,
}: CollectionPageProps) {


  const {
    slug,
  } = await params;



  const categories = await getCategories();

  const category = categories.find(
    (item) => item.slug === slug,
  );


  if (!category) {

    notFound();

  }



  const products =
    await getProductsByCategory(
      category.id
    );

  const parentCategory = category.parent_id !== null
    ? categories.find((item) => item.id === category.parent_id)
    : undefined;

  const selectedCategory = category.parent_id === null
    ? category.slug
    : parentCategory?.slug ?? "";

  const selectedSubcategory = category.parent_id !== null
    ? category.slug
    : "";

  return (

    <main
      className="
        container
        py-16
      "
    >


      <div
        className="
          mb-12
        "
      >

        <p
          className="
            text-sm
            uppercase
            tracking-[0.3em]
            text-rose-500
          "
        >
          Collection
        </p>


        <h1
          className="
            mt-3
            text-4xl
            md:text-5xl
            font-semibold
            text-[#3F312B]
          "
        >

          {category.name}

        </h1>


        {
          category.description && (

            <p
              className="
                mt-4
                text-gray-600
                max-w-xl
              "
            >
              {category.description}
            </p>

          )
        }


      </div>



        <ProductListing
        products={products}
        categories={categories}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        layout="collection"
      />


    </main>

  );

}

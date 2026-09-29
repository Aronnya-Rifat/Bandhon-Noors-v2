/**
 * Bandhon Noors Search Page
 *
 * Dedicated product search page.
 *
 * Future:
 * - Backend search API
 * - Filters
 * - Sorting
 */


import ProductCard from "@/components/product/ProductCard";

import { featuredProducts } from "@/data/products";



interface SearchPageProps {

  searchParams: Promise<{
    q?: string;
  }>;

}



export default async function SearchPage({
  searchParams,
}: SearchPageProps) {


  const {
    q = "",
  } = await searchParams;



  const query =
    q.toLowerCase();



  const products =
    featuredProducts.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(query)
    );



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

          Search

        </p>


        <h1
          className="
            mt-3
            text-4xl
            font-semibold
            text-[#3F312B]
          "
        >

          Results for "{q}"

        </h1>


      </div>



      {
        products.length === 0 ? (

          <p
            className="
              text-gray-500
            "
          >

            No products found.

          </p>


        ) : (


          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-6
            "
          >

            {
              products.map(
                (product) => (

                  <ProductCard

                    key={
                      product.id
                    }

                    product={
                      product
                    }

                  />

                )
              )
            }

          </div>


        )
      }


    </main>

  );

}

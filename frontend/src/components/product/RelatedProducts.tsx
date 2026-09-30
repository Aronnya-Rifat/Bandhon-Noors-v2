/**
 * Bandhon Noors Related Products
 *
 * Shows similar products.
 *
 * Used in:
 * - Product detail page
 *
 * Future:
 * - Backend recommendations
 * - Category matching
 * - User behavior based suggestions
 */



import ProductCard from "@/components/product/ProductCard";

import type { ProductCardProduct } from "@/types/product";



interface RelatedProductsProps {

  products: ProductCardProduct[];

}



export default function RelatedProducts({
  products,
}: RelatedProductsProps) {


  return (

    <section
      className="
        mt-20
      "
    >


      <h2
        className="
          text-2xl
          font-semibold
          text-gray-800
        "
      >

        You May Also Like

      </h2>



      {
        products.length === 0 ? (

          <p
            className="
              mt-6
              text-gray-500
            "
          >

            More products coming soon.

          </p>


        ) : (


          <div
            className="
              mt-8
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


    </section>

  );

}

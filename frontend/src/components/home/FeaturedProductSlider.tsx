"use client";

import ProductCard from "@/components/product/ProductCard";


interface FeaturedProductsSliderProps {
  products: any[];
}


export default function FeaturedProductsSlider({
  products,
}: FeaturedProductsSliderProps) {

  return (
    <div
      className="
        flex
        gap-6
        overflow-x-auto
        scroll-smooth
        snap-x
        snap-mandatory
        scrollbar-hide
      "
    >

      {products.map((product) => (

        <div
          key={product.id}
          className="
            min-w-[75%]
            sm:min-w-[45%]
            lg:min-w-[23%]
            snap-start
          "
        >

          <ProductCard
            product={product}
          />

        </div>

      ))}

    </div>
  );
}

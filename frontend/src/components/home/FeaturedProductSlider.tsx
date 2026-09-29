"use client";

import {
  Autoplay,
  Navigation,
} from "swiper/modules";
import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import ProductCard from "@/components/product/ProductCard";
import type {
  ProductCardProduct,
} from "@/types/product";

import "swiper/css";
import "swiper/css/navigation";

interface FeaturedProductSliderProps {
  products: ProductCardProduct[];
}

export default function FeaturedProductSlider({
  products,
}: FeaturedProductSliderProps) {
  return (
    <Swiper
      modules={[
        Navigation,
        Autoplay,
      ]}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      navigation
      spaceBetween={24}
      slidesPerView={2}
      breakpoints={{
        768: {
          slidesPerView: 3,
        },

        1024: {
          slidesPerView: 4,
        },

        1280: {
          slidesPerView: 5,
        },
      }}
    >
      {products.map(
        (product) => (
          <SwiperSlide
            key={product.id}
          >
            <ProductCard
              product={product}
            />
          </SwiperSlide>
        ),
      )}
    </Swiper>
  );
}

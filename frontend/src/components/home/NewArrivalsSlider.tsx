/**
 * Bandhon Noors New Arrivals Slider
 *
 * Client-side product carousel.
 *
 * Handles:
 * - Swipe interaction
 * - Desktop navigation
 * - Responsive slides
 */

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

import ProductCard from "@/components/product/ProductCard";

import type { ProductCardProduct } from "@/types/product";

import "swiper/css";
import "swiper/css/navigation";

interface NewArrivalsSliderProps {
  products: ProductCardProduct[];
}

export default function NewArrivalsSlider({
  products,
}: NewArrivalsSliderProps) {
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
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

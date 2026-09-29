/**
 * Bandhon Noors Homepage
 *
 * Main customer landing page.
 *
 * Contains:
 * - Hero
 * - Featured categories
 * - Product highlights
 * - Brand storytelling
 * - Customer trust sections
 */

import HeroSection from "./HeroSection";
import FeaturedCategories from "./FeaturedCategories";
import NewArrivals from "./NewArrivals";
import FeaturedProducts from "./FeaturedProducts";
import BrandStory from "./BrandStory";
import CraftsmanshipSection from "./CraftsmanshipSection";
import ReviewSlider from "@/components/review/ReviewSlider";

import { featuredReviews } from "@/data/reviews";

export default function HomePage() {
  return (
    <main>
      {/* Main visual introduction */}

      <HeroSection />

      {/* Product discovery */}

      <FeaturedCategories />

      {/* Latest collections */}

      <NewArrivals />

      {/* Highlighted products */}

      <FeaturedProducts />

      {/* Brand identity */}

      <BrandStory />

      {/* Craftsmanship / trust */}

      <CraftsmanshipSection />

      <ReviewSlider reviews={featuredReviews} />
      {/* 
        Future sections:

        <HomepageTestimonials />

        <NewsletterSection />

      */}
    </main>
  );
}

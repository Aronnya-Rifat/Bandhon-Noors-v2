/**
 * Bandhon Noors Featured Categories
 *
 * Displays main shopping categories.
 *
 * Data source:
 * - Currently: src/data/categories.ts
 * - Future: FastAPI category endpoint
 */




import { getCategories } from "@/services/category-service";
import CategoryBrowser from "./CategoryBrowser";

export default async function FeaturedCategories() {

  const categories = await getCategories();

  return (

    <section
      className="
        bg-white
        py-16
      "
    >

      <div
        className="
          container
        "
      >

        <div
          className="
            text-center
            mb-10
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
            Explore
          </p>


          <h2
            className="
              text-3xl
              md:text-4xl
              font-semibold
              text-[#3F312B]
              mt-3
            "
          >
            Shop By Category
          </h2>


        </div>


        <CategoryBrowser
          categories={categories}
        />


      </div>


    </section>

  );
}

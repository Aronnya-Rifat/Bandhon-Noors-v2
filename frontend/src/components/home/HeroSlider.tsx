/**
 * Bandhon Noors Hero Slider
 *
 * Premium stacked image carousel.
 *
 * Handles:
 * - Automatic rotation
 * - 3 second interval
 * - Layered images
 */

"use client";

import { useEffect, useState } from "react";

interface HeroSliderProps {
  images: string[];
}

export default function HeroSlider({ images }: HeroSliderProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [images.length]);

  return (
    <div
      className="
        relative
        w-full
        h-[500px]
      "
    >
      {images.map((image, index) => {
        const position = (index - active + images.length) % images.length;

        let imageClass = "";

        if (position === 0) {
          imageClass = `
              translate-x-0
              scale-100
              opacity-100
              z-30
              `;
        } else if (position === 1) {
          imageClass = `
              translate-x-10
              scale-95
              opacity-80
              blur-[1px]
              z-20
              `;
        } else {
          imageClass = `
              translate-x-20
              scale-90
              opacity-40
              blur-sm
              z-10
              `;
        }

        return (
          <img
            key={image}
            src={image}
            alt="Bandhon Noors collection"
            className={`
                absolute
                top-0
                left-0
                w-[85%]
                h-full
                object-cover
                rounded-3xl
                shadow-lg
                transition-all
                duration-1500
                ease-[cubic-bezier(0.22,1,0.36,1)]
                ${imageClass}
              `}
          />
        );
      })}
    </div>
  );
}

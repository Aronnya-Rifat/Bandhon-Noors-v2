/**
 * Bandhon Noors Store Image
 *
 * Reusable optimized image component.
 *
 * Supports:
 * - Fixed size images
 * - Container controlled images
 */


import Image from "next/image";


interface StoreImageProps {

  src: string;

  alt: string;

  width?: number;

  height?: number;

  className?: string;

  priority?: boolean;

  fill?: boolean;

  sizes?: string;

}


export default function StoreImage({

  src,

  alt,

  width = 800,

  height = 800,

  className = "",

  priority = false,

  fill = false,

  sizes,

}: StoreImageProps) {


  if (fill) {

    return (

      <Image

        src={src}

        alt={alt}

        fill

        priority={priority}

        sizes={sizes}

        className={`
          object-cover
          ${className}
        `}

      />

    );

  }


  return (

    <Image

      src={src}

      alt={alt}

      width={width}

      height={height}

      priority={priority}

      className={`
        object-cover
        ${className}
      `}

    />

  );

}

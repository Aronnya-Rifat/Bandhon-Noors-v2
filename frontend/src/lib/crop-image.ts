import type { Area } from "react-easy-crop";

const OUTPUT_WIDTH = 1200;
const OUTPUT_HEIGHT = 1500;

function loadImage(
  source: string,
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const image = new Image();

      image.onload = () =>
        resolve(image);

      image.onerror = reject;

      image.src = source;
    },
  );
}

export async function createCroppedImage(
  imageSource: string,
  crop: Area,
  originalName: string,
): Promise<File> {
  const image =
    await loadImage(imageSource);

  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Image cropping is unavailable.",
    );
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality =
    "high";

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    OUTPUT_WIDTH,
    OUTPUT_HEIGHT,
  );

  const blob =
    await new Promise<Blob>(
      (resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(
                new Error(
                  "Unable to create cropped image.",
                ),
              );
            }
          },
          "image/webp",
          0.9,
        );
      },
    );

  const baseName =
    originalName.replace(
      /\.[^.]+$/,
      "",
    );

  return new File(
    [blob],
    `${baseName}.webp`,
    {
      type: "image/webp",
    },
  );
}

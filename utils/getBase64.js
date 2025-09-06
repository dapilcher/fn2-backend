// import { getPlaiceholder } from "plaiceholder";

// 1x1 pixel of red-500 generated at https://png-pixel.com/
const defaultImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8qKlXDwAEZAGZAlz5pAAAAABJRU5ErkJggg==";

export default async function getBase64(imgSrc) {
  const {getPlaiceholder} = await import("plaiceholder");

  try {
    const buffer = await fetch(imgSrc).then(async (res) =>
      Buffer.from(await res.arrayBuffer())
    );
    const { base64 } = await getPlaiceholder(buffer);
    console.log({ base64 });
    return base64;
  } catch (err) {
    console.error("Error fetching plaiceholder", err);
    return defaultImage;
  }
}

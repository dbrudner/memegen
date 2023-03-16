import { createCanvas, loadImage } from "canvas";

type Input = {
  src: string;
  text: string;
};

async function generateMeme(input: Input) {
  console.log({ input });
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext("2d");
  ctx.font = "72px Impact";

  const image = await loadImage(input.src);

  ctx.drawImage(image, 0, 0, 400, 400);

  ctx.fillText(input.text, 30, 75);

  return canvas
    .toDataURL()
    .replace("image/png", "image/octet-stream");
}

export default generateMeme;

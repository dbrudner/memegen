import {
  CanvasRenderingContext2D,
  createCanvas,
  loadImage,
} from "canvas";

type Input = {
  src: string;
  text: string;
};

/**
 *
 * @param ctx canvas context
 * @param text text to be wrapped
 * @param imageWidth width of the image
 * @returns a string with new line characters to wrap the text
 */
function getLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  imageWidth: number
) {
  let words = text.split(" ");

  let lines = [];

  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    let word = words[i];

    const { width } = ctx.measureText(
      currentLine + " " + word
    );

    if (width < imageWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);

      currentLine = word;
    }
  }

  lines.push(currentLine);

  return lines.join("\n");
}

async function generateMemeFromUrl(input: {
  src: string;
  text: string;
}) {
  const image = await loadImage(input.src);

  const canvas = createCanvas(image.width, image.height);

  const ctx = canvas.getContext("2d");

  ctx.font = "72px Impact";

  ctx.drawImage(image, 0, 0, image.width, image.height);

  const lines = getLines(ctx, input.text, image.width - 60);

  ctx.fillStyle = "white";

  ctx.fillText(lines, 30, 75);

  console.log("HE?");

  return canvas
    .toDataURL()
    .replace("image/png", "image/octet-stream");
}

async function generateMemeFromImg(input: Input) {
  const image = await loadImage(input.src);

  const canvas = createCanvas(image.width, image.height);

  const ctx = canvas.getContext("2d");

  ctx.font = "72px Impact";

  ctx.drawImage(image, 0, 0, image.width, image.height);

  const lines = getLines(ctx, input.text, image.width - 60);

  ctx.fillStyle = "white";

  ctx.fillText(lines, 30, 75);

  return canvas
    .toDataURL()
    .replace("image/png", "image/octet-stream");
}

export default generateMemeFromUrl;

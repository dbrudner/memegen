// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import generateMeme from "@/lib/generate-meme";
import { createCanvas, loadImage } from "canvas";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  imgBase64: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = JSON.parse(req.body);

  const imgBase64 = await generateMeme({
    src: body.src,
    text: body.text,
  });

  res.status(200).json({ imgBase64 });
}

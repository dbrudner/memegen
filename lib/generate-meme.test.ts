import generateMeme from "./generate-meme";

describe("generateMeme", () => {
  test("generateMeme", async () => {
    const result = await generateMeme({
      src: "https://i.imgflip.com/1bij.jpg",
      text: "Hello World",
    });

    expect(result.startsWith("data:image/png;base64")).toBe(
      true
    );
  });
});

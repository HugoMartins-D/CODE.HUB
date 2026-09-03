import { describe, expect, it } from "vitest";
import { register } from "@/lib/auth";
import { createPost, deletePost, getPost, listFeedPage } from "@/lib/posts";

describe("publicações", () => {
  it("cria, lista e exclui uma publicação do autor", async () => {
    await register({ name: "Ana", email: "ana@example.com", password: "12345678" });
    const image = new File(["imagem"], "projeto.png", { type: "image/png" });
    const post = await createPost({ text: "Meu novo projeto", images: [image] });
    expect((await listFeedPage()).items).toHaveLength(1);
    expect(await getPost(post.id)).toMatchObject({ text: "Meu novo projeto", authorName: "Ana" });
    await deletePost(post.id);
    expect(await getPost(post.id)).toBeNull();
  });

  it("rejeita publicação vazia", async () => {
    await register({ name: "Ana", email: "ana@example.com", password: "12345678" });
    await expect(createPost({ text: "   ", images: [] })).rejects.toThrow("Escreva algo");
  });
});

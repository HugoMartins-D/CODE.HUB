import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import PostCard from "@/components/PostCard";

describe("PostCard", () => {
  it("apresenta autor, conteúdo e link da publicação", () => {
    render(
      <MemoryRouter>
        <PostCard
          post={{
            id: "post-1",
            authorId: "person-1",
            authorName: "Ana Silva",
            authorHeadline: "Frontend Developer",
            text: "Construindo a CODE.HUB",
            media: [],
            createdAt: "2026-09-03T12:00:00.000Z",
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("Construindo a CODE.HUB")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir publicação" })).toHaveAttribute(
      "href",
      "/publicacao/post-1",
    );
  });

  it("exibe e posiciona a foto de perfil do autor quando disponível", () => {
    render(
      <MemoryRouter>
        <PostCard
          post={{
            id: "post-avatar",
            authorId: "person-1",
            authorName: "Ana Silva",
            authorHeadline: "Frontend Developer",
            authorAvatarUrl: "https://files.test/avatar.jpg",
            authorAvatarPosition: "35% 70%",
            text: "Com avatar",
            media: [],
            createdAt: "2026-09-03T12:00:00.000Z",
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("img", { name: "Foto de Ana Silva" })).toHaveAttribute(
      "src",
      "https://files.test/avatar.jpg",
    );
    expect(screen.getByRole("img", { name: "Foto de Ana Silva" })).toHaveStyle({
      objectPosition: "35% 70%",
    });
  });
});

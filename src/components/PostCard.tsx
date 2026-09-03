import { useState } from "react";
import { Link } from "react-router-dom";
import { getSession } from "@/lib/auth";
import { initialsOf } from "@/lib/profile";
import type { Post } from "@/lib/posts";

export default function PostCard({
  post,
  onDelete,
}: {
  post: Post;
  onDelete?: (id: string) => void;
}) {
  const imageUrls = post.media.map((media) => media.url);
  const own = getSession()?.id === post.authorId;
  const [shared, setShared] = useState(false);
  const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(post.createdAt),
  );

  return (
    <article className="rounded-[16px] border border-[#313135] bg-[#141416] p-[20px]">
      <header className="flex items-start gap-[12px]">
        <span className="flex size-[42px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#474797] font-semibold text-white">
          {post.authorAvatarUrl ? (
            <img
              src={post.authorAvatarUrl}
              alt={`Foto de ${post.authorName}`}
              className="size-full object-cover"
              style={{ objectPosition: post.authorAvatarPosition ?? "50% 50%" }}
            />
          ) : (
            initialsOf(post.authorName)
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#f7f7f8]">{post.authorName}</p>
          {post.authorHeadline ? (
            <p className="text-[12px] text-[#c4c4c9]">{post.authorHeadline}</p>
          ) : null}
          <time dateTime={post.createdAt} className="text-[12px] text-[#7f7f8a]">
            {date}
          </time>
        </div>
        {own && onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            className="text-[12px] text-[#7f7f8a] hover:text-[#e0716e]"
          >
            Excluir
          </button>
        ) : null}
      </header>
      {post.text ? (
        <p className="mt-[16px] whitespace-pre-wrap text-[15px] leading-[1.6] text-[#e4e4e7]">
          {post.text}
        </p>
      ) : null}
      {imageUrls.length ? (
        <div
          className={
            "mt-[16px] grid gap-[8px] " + (imageUrls.length === 1 ? "grid-cols-1" : "grid-cols-2")
          }
        >
          {imageUrls.map((url, index) => (
            <img
              key={post.media[index].id}
              src={url}
              alt={"Imagem " + (index + 1) + " da publicação"}
              className="max-h-[420px] h-full w-full rounded-[12px] object-cover"
            />
          ))}
        </div>
      ) : null}
      <footer className="mt-[16px] flex items-center gap-[18px] border-t border-[#26262a] pt-[12px]">
        <Link
          to={"/publicacao/" + post.id}
          className="text-[13px] font-medium text-[#9a9ad0] hover:underline"
        >
          Abrir publicação
        </Link>
        <button
          type="button"
          onClick={() => {
            const url = window.location.origin + "/publicacao/" + post.id;
            const action = navigator.share
              ? navigator.share({ title: "Publicação de " + post.authorName + " na CODE.HUB", url })
              : navigator.clipboard.writeText(url);
            void action
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 1600);
              })
              .catch(() => undefined);
          }}
          className="text-[13px] text-[#7f7f8a] hover:text-[#c4c4c9]"
        >
          {shared ? "Link copiado" : "Compartilhar"}
        </button>
      </footer>
    </article>
  );
}

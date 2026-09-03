import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PostCard from "@/components/PostCard";
import { deletePost, getPost, type Post } from "@/lib/posts";
import { PageShell, PageHeader } from "@/imports/_shared/ui";

export default function PublicationScreen() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>();
  const [error, setError] = useState("");
  useEffect(() => {
    void getPost(id)
      .then(setPost)
      .catch(() => setError("Não foi possível carregar a publicação."));
  }, [id]);
  return (
    <PageShell active="feed" maxWidth={640}>
      <div className="flex items-center justify-between">
        <PageHeader title="Publicação" />
        <Link to="/feed" className="text-[13px] text-[#9a9ad0]">
          Voltar ao feed
        </Link>
      </div>
      {post === undefined && !error ? (
        <p className="py-[48px] text-center text-[#7f7f8a]">Carregando publicação…</p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-[12px] border border-[#5c2b2a] p-[14px] text-[#e0716e]">
          {error}
        </p>
      ) : null}
      {post === null ? (
        <p className="rounded-[16px] border border-[#313135] py-[48px] text-center text-[#c4c4c9]">
          Publicação não encontrada.
        </p>
      ) : null}
      {post ? (
        <PostCard
          post={post}
          onDelete={(postId) =>
            void deletePost(postId).then(() => navigate("/feed", { replace: true }))
          }
        />
      ) : null}
    </PageShell>
  );
}

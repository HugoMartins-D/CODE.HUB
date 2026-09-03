import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/imports/_shared/Sidebar";
import PostCard from "@/components/PostCard";
import { deletePost, listFeedPage, type Post } from "@/lib/posts";
import { getProfile, initialsOf } from "@/lib/profile";

export default function ScreenFeedHome() {
  const navigate = useNavigate();
  const profile = getProfile();
  const [posts, setPosts] = useState<Post[]>();
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadFirstPage = useCallback(() => {
    setError("");
    setPosts(undefined);
    void listFeedPage().then((page) => {
      setPosts(page.items);
      setHasMore(page.hasMore);
    }).catch(() => setError("Não foi possível carregar o feed."));
  }, []);

  useEffect(loadFirstPage, [loadFirstPage]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const page = await listFeedPage({ offset: posts?.length ?? 0 });
      setPosts((current) => [...(current ?? []), ...page.items]);
      setHasMore(page.hasMore);
    } catch {
      setError("Não foi possível carregar mais publicações.");
    } finally {
      setLoadingMore(false);
    }
  };

  const remove = async (id: string) => {
    await deletePost(id);
    setPosts((current) => current?.filter((post) => post.id !== id));
  };

  return (
    <div className="bg-[#0f0f10] flex items-start relative size-full">
      <Sidebar active="feed" />
      <main className="flex-1 min-w-0 flex justify-center px-[16px] sm:px-[24px] py-[32px]">
        <div className="w-full max-w-[640px] flex flex-col gap-[20px]">
          <button type="button" onClick={() => navigate("/publicar")} className="bg-[#141416] border border-[#313135] rounded-[16px] p-[20px] flex gap-[12px] items-center text-left cursor-pointer">
            <span className="bg-[#474797] rounded-full shrink-0 size-[40px] flex items-center justify-center text-[14px] text-white">{initialsOf(profile.name)}</span>
            <span className="flex-1 bg-[#1c1c1c] border border-[#494950] rounded-[10px] px-[16px] py-[12px] text-[14px] text-[#7f7f8a]">O que você está construindo hoje?</span>
          </button>
          {error ? <div role="alert" className="flex items-center justify-between gap-4 rounded-[12px] border border-[#5c2b2a] p-[14px] text-[#e0716e]"><span>{error}</span><button type="button" onClick={loadFirstPage} className="text-[13px] font-semibold underline">Tentar novamente</button></div> : null}
          {posts === undefined && !error ? <p className="py-[48px] text-center text-[#7f7f8a]">Carregando feed…</p> : null}
          {posts?.map((post) => <PostCard key={post.id} post={post} onDelete={(id) => void remove(id)} />)}
          {hasMore ? <button type="button" disabled={loadingMore} onClick={() => void loadMore()} className="self-center rounded-[10px] border border-[#494950] px-[20px] py-[10px] text-[14px] font-semibold text-[#c4c4c9] disabled:opacity-50">{loadingMore ? "Carregando…" : "Carregar mais"}</button> : null}
          {posts?.length === 0 ? (
            <div className="flex flex-col gap-[8px] items-center border border-[#313135] rounded-[16px] py-[56px] px-[24px] text-center">
              <p className="font-semibold text-[#c4c4c9]">Nenhuma publicação ainda</p>
              <p className="text-[13px] text-[#7f7f8a]">Compartilhe o que você está construindo e sua primeira publicação aparecerá aqui.</p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

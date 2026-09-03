import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/imports/_shared/Sidebar";
import { getProfile, initialsOf, loadProfileByUsername, type Profile } from "@/lib/profile";
import { useNav } from "@/lib/nav";
import { getSession, logout } from "@/lib/auth";
import { deletePost, listPosts, type Post } from "@/lib/posts";
import PostCard from "@/components/PostCard";

function formatJoined(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-[6px]">
      <span className="font-['Space_Grotesk:Bold',sans-serif] font-bold text-[#f7f7f8] text-[18px]">{value}</span>
      <span className="font-['Inter:Regular',sans-serif] text-[#7f7f8a] text-[13px]">{label}</span>
    </div>
  );
}

function MetaItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-[6px] text-[#7f7f8a] text-[13px] font-['Inter:Regular',sans-serif]">
      <span className="text-[#7f7f8a]">{icon}</span>
      {children}
    </span>
  );
}

export default function ScreenProfile() {
  const { navigate } = useNav();
  const { username = "eu" } = useParams();
  const [loadedProfile, setLoadedProfile] = useState<Profile | null | undefined>(() =>
    username === "eu" ? getProfile() : undefined,
  );
  const profile = loadedProfile ?? getProfile();
  const initials = initialsOf(profile.name);
  const joined = formatJoined(profile.joinedAt);
  const website = profile.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const session = getSession();
  const ownProfile = profile.userId === session?.id;
  const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
    if (username !== "eu") setLoadedProfile(undefined);
    void loadProfileByUsername(username).then((loaded) => {
      setLoadedProfile(loaded);
    });
  }, [username]);

  useEffect(() => {
    void listPosts().then((allPosts) => setPosts(allPosts.filter((post) => post.authorId === profile.userId)));
  }, [profile.userId]);

  const removePost = async (id: string) => {
    await deletePost(id);
    setPosts((current) => current?.filter((post) => post.id !== id));
  };

  if (loadedProfile === undefined) {
    return <div className="flex size-full items-center justify-center bg-[#0f0f10] text-[#7f7f8a]">Carregando perfil…</div>;
  }
  if (loadedProfile === null) {
    return <div className="flex size-full flex-col items-center justify-center gap-3 bg-[#0f0f10]"><p className="font-semibold text-[#f7f7f8]">Perfil não encontrado</p><button type="button" onClick={() => navigate("feed")} className="text-sm text-[#9a9ad0] hover:underline">Voltar ao feed</button></div>;
  }

  return (
    <div className="bg-[#0f0f10] flex items-start relative size-full min-h-full" data-name="Screen / Profile">
      <Sidebar active="profile" />

      <div className="flex flex-col items-center relative flex-1 min-w-0" data-name="mainContent">
        {/* Banner */}
        <div className="bg-[#474797] h-[120px] sm:h-[160px] shrink-0 w-full overflow-hidden">
          {profile.bannerUrl ? <img src={profile.bannerUrl} alt={`Banner de ${profile.name}`} className="size-full object-cover" /> : null}
        </div>

        <div className="w-full max-w-[900px] px-[16px] sm:px-[24px] pb-[48px] flex flex-col gap-[24px]">
          {/* Hero */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-start justify-between gap-[12px]">
              <div className="-mt-[40px] sm:-mt-[48px] flex size-[80px] sm:size-[88px] items-center justify-center overflow-hidden rounded-full bg-[#c7d300] ring-4 ring-[#0f0f10]">
                {profile.avatarUrl ? <img src={profile.avatarUrl} alt={`Foto de ${profile.name}`} className="size-full object-cover" /> : <span className="font-['Space_Grotesk:Medium',sans-serif] font-medium text-[28px] sm:text-[30px] text-white">
                  {initials}
                </span>}
              </div>
              <div className="flex gap-[10px] pt-[16px]">
                {ownProfile ? <button
                  type="button"
                  onClick={() => navigate("profile-edit")}
                  className="rounded-[10px] bg-[#474797] hover:bg-[#5252a8] transition-colors px-[18px] py-[10px] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white cursor-pointer"
                >
                  Editar perfil
                </button> : null}
                <button
                  type="button"
                  onClick={() => {
                    const url = window.location.href;
                    if (navigator.share) {
                      void navigator.share({ title: `${profile.name} na CODE.HUB`, url });
                    } else {
                      void navigator.clipboard.writeText(url);
                    }
                  }}
                  className="rounded-[10px] border border-[#494950] hover:bg-[#1c1c1c] transition-colors px-[18px] py-[10px] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#f7f7f8] cursor-pointer"
                >
                  Compartilhar
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <div className="flex flex-col gap-[2px]">
                <h1 className="font-['Space_Grotesk:Bold',sans-serif] font-bold text-[#f7f7f8] text-[22px] sm:text-[24px]">
                  {profile.name || "Sua conta"}
                </h1>
                <p className="text-[13px] font-medium text-[#9a9ad0]">@{profile.username}</p>
                <p className="font-['Inter:Regular',sans-serif] text-[#c4c4c9] text-[14px]">
                  {profile.headline || "Complete seu perfil"}
                </p>
              </div>

              <p className="font-['Inter:Regular',sans-serif] text-[#c4c4c9] text-[14px] leading-[1.6] max-w-[560px]">
                {profile.bio || "Adicione uma bio para que a comunidade conheça você."}
              </p>

              {/* Meta row (edited in “Editar perfil”) */}
              <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[6px] pt-[2px]">
                {profile.location && (
                  <MetaItem
                    icon={
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14s5-4.2 5-8A5 5 0 0 0 3 6c0 3.8 5 8 5 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <circle cx="8" cy="6" r="1.75" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    }
                  >
                    {profile.location}
                  </MetaItem>
                )}
                {joined && (
                  <MetaItem
                    icon={
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                        <rect x="2.5" y="3.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    }
                  >
                    Entrou em {joined}
                  </MetaItem>
                )}
                {website && (
                  <MetaItem
                    icon={
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                        <path d="M6.5 9.5a2.5 2.5 0 0 0 3.6.1l2-2a2.5 2.5 0 0 0-3.5-3.6l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M9.5 6.5a2.5 2.5 0 0 0-3.6-.1l-2 2a2.5 2.5 0 0 0 3.5 3.6l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    }
                  >
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#9a9ad0] hover:underline"
                    >
                      {website}
                    </a>
                  </MetaItem>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-x-[20px] gap-y-[4px] pt-[6px]">
                <Stat value={profile.stats.following} label="Seguindo" />
                <Stat value={profile.stats.followers} label="Seguidores" />
                <Stat value={posts?.length ?? profile.stats.posts} label="Publicações" />
              </div>

              {/* Skills */}
              {profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-[8px] pt-[8px]">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-[6px] bg-[#313135] px-[10px] py-[4px] font-['JetBrains_Mono:Medium',sans-serif] font-medium text-[#c4c4c9] text-[11px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-px w-full bg-[#26262a]" />

          {ownProfile ? <button
            type="button"
            onClick={() => {
              logout();
              navigate("login");
            }}
            className="lg:hidden self-start rounded-[10px] border border-[#494950] px-[18px] py-[10px] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#c4c4c9]"
          >
            Sair da conta
          </button> : null}

          {/* Activity */}
          <div className="flex flex-col gap-[16px]">
            <h2 className="font-['Space_Grotesk:Bold',sans-serif] font-bold text-[#f7f7f8] text-[18px]">Atividade</h2>
            {posts?.map((post) => (
              <PostCard key={post.id} post={post} onDelete={ownProfile ? (id) => void removePost(id) : undefined} />
            ))}
            {posts?.length === 0 ? <div className="flex flex-col items-center justify-center gap-[10px] rounded-[16px] border border-[#313135] py-[44px] px-[24px] text-center">
              <div className="flex size-[56px] items-center justify-center rounded-full bg-[#1c1c1c]">
                <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
                  <path
                    d="M15.5833 2.75H6.41667C4.39162 2.75 2.75 4.39162 2.75 6.41667V15.5833C2.75 17.6084 4.39162 19.25 6.41667 19.25H15.5833C17.6084 19.25 19.25 17.6084 19.25 15.5833V6.41667C19.25 4.39162 17.6084 2.75 15.5833 2.75Z"
                    stroke="#7f7f8a"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M7 8.25H15" stroke="#7f7f8a" strokeWidth="1.75" strokeLinecap="round" />
                  <path d="M7 11.9167H12.5" stroke="#7f7f8a" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </div>
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#c4c4c9] text-[14px]">
                Nenhuma atividade ainda
              </p>
              <p className="font-['Inter:Regular',sans-serif] text-[#7f7f8a] text-[13px] max-w-[360px]">
                Suas publicações, curtidas e comentários vão aparecer aqui.
              </p>
            </div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

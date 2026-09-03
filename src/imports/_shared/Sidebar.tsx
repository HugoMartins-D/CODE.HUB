/**
 * Shared desktop sidebar.
 *
 * Self-sufficient: pulls the signed-in user from the local profile store and
 * navigation from `useNav()`, so screens only need to pass which item is
 * `active`. Hidden below the `lg` breakpoint — on mobile the bottom bar
 * (src/components/BottomNav.tsx) handles navigation.
 */
import type { Screen } from "@/App";
import { useNav } from "@/lib/nav";
import { logout } from "@/lib/auth";
import { getProfile, initialsOf } from "@/lib/profile";

const P = {
  home1: "M2.75 10.0833L11 2.75L19.25 10.0833",
  home2: "M4.58333 9.16667V18.3333H17.4167V9.16667",
  home3: "M8.25 18.3333V12.8333H13.75V18.3333",
  post: "M15.5833 2.75H6.41667C4.39162 2.75 2.75 4.39162 2.75 6.41667V15.5833C2.75 17.6084 4.39162 19.25 6.41667 19.25H15.5833C17.6084 19.25 19.25 17.6084 19.25 15.5833V6.41667C19.25 4.39162 17.6084 2.75 15.5833 2.75Z",
  brief1: "M17.4167 7.33333H4.58333C3.57081 7.33333 2.75 8.15414 2.75 9.16667V16.5C2.75 17.5125 3.57081 18.3333 4.58333 18.3333H17.4167C18.4292 18.3333 19.25 17.5125 19.25 16.5V9.16667C19.25 8.15414 18.4292 7.33333 17.4167 7.33333Z",
  brief2: "M7.33333 7.33333V5.5C7.33333 5.01377 7.52649 4.54745 7.8703 4.20364C8.21412 3.85982 8.68044 3.66667 9.16667 3.66667H12.8333C13.3196 3.66667 13.7859 3.85982 14.1297 4.20364C14.4735 4.54745 14.6667 5.01377 14.6667 5.5V7.33333",
  users1: "M8.25 11.4583C10.0219 11.4583 11.4583 10.0219 11.4583 8.25C11.4583 6.47809 10.0219 5.04167 8.25 5.04167C6.47809 5.04167 5.04167 6.47809 5.04167 8.25C5.04167 10.0219 6.47809 11.4583 8.25 11.4583Z",
  users2: "M2.29167 18.3333C2.29167 15.0333 4.95 13.2917 8.25 13.2917C11.55 13.2917 14.2083 15.0333 14.2083 18.3333",
  users3: "M15.5833 10.5417C16.849 10.5417 17.875 9.51565 17.875 8.25C17.875 6.98435 16.849 5.95833 15.5833 5.95833C14.3177 5.95833 13.2917 6.98435 13.2917 8.25C13.2917 9.51565 14.3177 10.5417 15.5833 10.5417Z",
  users4: "M13.75 13.475C16.0417 13.75 18.3333 15.0333 18.3333 18.3333",
  message:
    "M3.66667 5.5C3.66667 5.01377 3.85982 4.54745 4.20364 4.20364C4.54745 3.85982 5.01377 3.66667 5.5 3.66667H16.5C16.9862 3.66667 17.4525 3.85982 17.7964 4.20364C18.1402 4.54745 18.3333 5.01377 18.3333 5.5V12.8333C18.3333 13.3196 18.1402 13.7859 17.7964 14.1297C17.4525 14.4735 16.9862 14.6667 16.5 14.6667H8.25L3.66667 18.3333V5.5Z",
  bell1:
    "M16.5 7.33333C16.5 5.87464 15.9205 4.4757 14.8891 3.44425C13.8576 2.4128 12.4587 1.83333 11 1.83333C9.54131 1.83333 8.14236 2.4128 7.11091 3.44425C6.07946 4.4757 5.5 5.87464 5.5 7.33333C5.5 13.75 2.75 15.5833 2.75 15.5833H19.25C19.25 15.5833 16.5 13.75 16.5 7.33333Z",
  bell2:
    "M12.5858 19.25C12.4247 19.5278 12.1934 19.7584 11.915 19.9187C11.6367 20.079 11.3212 20.1634 11 20.1634C10.6788 20.1634 10.3633 20.079 10.085 19.9187C9.80664 19.7584 9.57533 19.5278 9.41417 19.25",
};

type SidebarKey =
  | "feed"
  | "criar-publicacao"
  | "vagas"
  | "comunidade"
  | "mensagens"
  | "notificacoes"
  | "profile";

function Icon({ paths, active }: { paths: string[]; active?: boolean }) {
  const stroke = active ? "#F7F7F8" : "#A4A4AC";
  return (
    <svg
      className="block shrink-0"
      fill="none"
      height="22"
      viewBox="0 0 22 22"
      width="22"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
        />
      ))}
    </svg>
  );
}

function NavButton({
  label,
  paths,
  active,
  onClick,
}: {
  label: string;
  paths: string[];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-name={`navItem-${label}`}
      className={
        "flex w-full items-center gap-[14px] rounded-[10px] px-[14px] py-[11px] text-left transition-colors cursor-pointer " +
        (active
          ? "bg-[#313135]"
          : "bg-transparent hover:bg-[#26262a]")
      }
    >
      <Icon paths={paths} active={active} />
      <span
        className={
          "font-['Inter:Medium',sans-serif] text-[15px] " +
          (active ? "font-semibold text-[#f7f7f8]" : "font-medium text-[#c4c4c9]")
        }
      >
        {label}
      </span>
    </button>
  );
}

export default function Sidebar({ active }: { active: SidebarKey }) {
  const { navigate } = useNav();
  const profile = getProfile();
  const initials = initialsOf(profile.name);
  const go = (s: Screen) => () => navigate(s);

  return (
    <aside className="hidden lg:flex bg-[#1c1c1c] border-r border-[#313135] h-full shrink-0 w-[240px] flex-col gap-[8px] py-[20px]">
      {/* logo */}
      <button
        type="button"
        onClick={go("feed")}
        className="px-[20px] pb-[12px] text-left cursor-pointer bg-transparent border-0"
      >
        <span className="font-['Space_Grotesk:Bold',sans-serif] font-bold text-[#f7f7f8] text-[20px]">
          code.hub
        </span>
      </button>

      {/* nav */}
      <nav className="flex flex-col gap-[2px] px-[12px]">
        <NavButton label="Feed" paths={[P.home1, P.home2, P.home3]} active={active === "feed"} onClick={go("feed")} />
        <NavButton label="Postar" paths={[P.post, "M11 7.33333V14.6667", "M7.33333 11H14.6667"]} active={active === "criar-publicacao"} onClick={go("criar-publicacao")} />
        <NavButton label="Mensagens" paths={[P.message]} active={active === "mensagens"} onClick={go("mensagens")} />
        <NavButton label="Notificações" paths={[P.bell1, P.bell2]} active={active === "notificacoes"} onClick={go("notificacoes")} />
      </nav>

      {/* publish CTA */}
      <div className="px-[20px] pt-[16px]">
        <button
          type="button"
          onClick={go("criar-publicacao")}
          className="w-full rounded-[10px] bg-[#474797] hover:bg-[#5252a8] transition-colors px-[28px] py-[14px] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-white cursor-pointer"
        >
          Publicar
        </button>
      </div>

      <div className="flex-1" />

      {/* user */}
      <button
        type="button"
        onClick={go("profile")}
        className="mx-[12px] flex items-center gap-[10px] rounded-[10px] px-[8px] py-[8px] text-left transition-colors hover:bg-[#26262a] cursor-pointer bg-transparent border-0"
      >
        <span className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#474797] font-['Space_Grotesk:Medium',sans-serif] font-medium text-[14px] text-white">
          {initials}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#f7f7f8] text-[14px]">
            {profile.name || "Sua conta"}
          </span>
          <span className="truncate font-['Inter:Regular',sans-serif] text-[#7f7f8a] text-[12px]">
            {profile.headline || "Editar perfil"}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => {
          logout();
          navigate("login");
        }}
        className="mx-[20px] mt-[4px] rounded-[8px] px-[12px] py-[8px] text-left font-['Inter:Medium',sans-serif] text-[13px] text-[#7f7f8a] hover:bg-[#26262a] hover:text-[#c4c4c9] transition-colors cursor-pointer"
      >
        Sair da conta
      </button>
    </aside>
  );
}

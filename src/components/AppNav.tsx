/**
 * Mobile bottom navigation bar. Visible below the `lg` breakpoint only —
 * on desktop the sidebar (src/imports/_shared/Sidebar.tsx) handles navigation.
 */
import type { ReactNode } from "react";
import type { Screen } from "@/App";
import { useNav } from "@/lib/nav";

function IconHome({ c }: { c: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M2.75 8.70833L11 2.75L19.25 8.70833V19.25H14.6667V13.75H7.33333V19.25H2.75V8.70833Z"
        stroke={c}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconProfile({ c }: { c: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="7" r="4" stroke={c} strokeWidth="1.75" />
      <path
        d="M3.5 19c.6-4 3.1-6 7.5-6s6.9 2 7.5 6"
        stroke={c}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconPost({ c }: { c: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect
        x="2.75"
        y="2.75"
        width="16.5"
        height="16.5"
        rx="3"
        stroke={c}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M11 7.33333V14.6667" stroke={c} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M7.33333 11H14.6667" stroke={c} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconMessage({ c }: { c: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M3.5 5.5A2 2 0 0 1 5.5 3.5h11a2 2 0 0 1 2 2v7.3a2 2 0 0 1-2 2H8.2L3.5 18.5v-13Z"
        stroke={c}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconBell({ c }: { c: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M16.5 8.2a5.5 5.5 0 0 0-11 0v6.1L3.7 16h14.6l-1.8-1.7V8.2Z"
        stroke={c}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M9 16a2 2 0 0 0 4 0" stroke={c} strokeWidth="1.75" />
    </svg>
  );
}
const ITEMS: { label: string; screen: Screen; Icon: (p: { c: string }) => ReactNode }[] = [
  { label: "Feed", screen: "feed", Icon: IconHome },
  { label: "Postar", screen: "criar-publicacao", Icon: IconPost },
  { label: "Mensagens", screen: "mensagens", Icon: IconMessage },
  { label: "Alertas", screen: "notificacoes", Icon: IconBell },
  { label: "Perfil", screen: "profile", Icon: IconProfile },
];

export default function AppNav() {
  const { navigate, current } = useNav();
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex items-stretch justify-around border-t border-[#313135]"
      style={{
        background: "rgba(20,20,22,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {ITEMS.map(({ label, screen, Icon }) => {
        const active = current === screen;
        const c = active ? "#9a9ad0" : "#7f7f8a";
        return (
          <button
            key={screen}
            type="button"
            onClick={() => navigate(screen)}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className="flex flex-1 flex-col items-center justify-center gap-[3px] py-[8px] cursor-pointer border-0 bg-transparent"
            style={{ minHeight: 58 }}
          >
            <Icon c={c} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                color: c,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

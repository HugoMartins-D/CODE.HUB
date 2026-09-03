import { useLocation, useNavigate } from "react-router-dom";
import type { Screen } from "@/App";

const SCREEN_PATHS: Record<Screen, string> = {
  login: "/login",
  signup: "/cadastro",
  feed: "/feed",
  profile: "/perfil/eu",
  "profile-edit": "/configuracoes/perfil",
  "criar-publicacao": "/publicar",
  vagas: "/feed",
  mensagens: "/mensagens",
  notificacoes: "/notificacoes",
  comunidade: "/feed",
  "grupo-frontend": "/feed",
  "evento-meetup": "/feed",
  "criar-evento": "/feed",
  "criar-comunidade": "/feed",
};

function currentScreen(pathname: string): Screen {
  if (pathname === "/publicar") return "criar-publicacao";
  if (pathname === "/configuracoes/perfil") return "profile-edit";
  if (pathname.startsWith("/perfil/")) return "profile";
  if (pathname.startsWith("/mensagens")) return "mensagens";
  if (pathname === "/notificacoes") return "notificacoes";
  if (pathname === "/login") return "login";
  if (pathname === "/cadastro") return "signup";
  return "feed";
}

export function useNav() {
  const routerNavigate = useNavigate();
  const { pathname } = useLocation();

  return {
    navigate: (screen: Screen) => routerNavigate(SCREEN_PATHS[screen]),
    current: currentScreen(pathname),
  };
}

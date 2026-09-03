import { useEffect, useState, type ReactNode } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { getSession, initializeAuth } from "@/lib/auth";
import { loadMyProfile } from "@/lib/profile";
import LoginScreen from "@/screens/LoginScreen";
import SignupScreen from "@/screens/SignupScreen";
import ProfileEditScreen from "@/screens/ProfileEditScreen";
import AppNav from "@/components/AppNav";
import ScreenFeedHome from "@/imports/ScreenFeedHome/index";
import ScreenProfile from "@/imports/ScreenProfile/index";
import ScreenCriarPublicacao from "@/imports/ScreenCriarPublicacao/index";
import PublicationScreen from "@/screens/PublicationScreen";
import ScreenMensagens from "@/imports/ScreenMensagens/index";
import ScreenNotificacoes from "@/imports/ScreenNotificacoes/index";
import LegalScreen from "@/screens/LegalScreen";

export type Screen =
  | "login"
  | "signup"
  | "feed"
  | "profile"
  | "profile-edit"
  | "criar-publicacao"
  // Kept for screens outside the MVP while they remain in the repository.
  | "vagas"
  | "mensagens"
  | "notificacoes"
  | "comunidade"
  | "grupo-frontend"
  | "evento-meetup"
  | "criar-evento"
  | "criar-comunidade";

function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!getSession()) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  if (getSession()) return <Navigate to="/feed" replace />;
  return children;
}

function MvpShell() {
  return (
    <div className="h-full w-full overflow-y-auto bg-[#0f0f10] flex flex-col">
      <div className="flex-1 flex pb-[64px] lg:pb-0">
        <Outlet />
      </div>
      <AppNav />
    </div>
  );
}

function LoginRoute() {
  const navigate = useNavigate();
  return (
    <LoginScreen
      onLogin={() => navigate("/feed", { replace: true })}
      onSignup={() => navigate("/cadastro")}
    />
  );
}

function SignupRoute() {
  const navigate = useNavigate();
  return (
    <SignupScreen
      onSignup={() => navigate("/feed", { replace: true })}
      onLogin={() => navigate("/login")}
    />
  );
}

function ProfileEditRoute() {
  const navigate = useNavigate();
  return (
    <ProfileEditScreen
      onCancel={() => navigate("/perfil/eu")}
      onSaved={() => navigate("/perfil/eu", { replace: true })}
    />
  );
}

function RootRedirect() {
  return <Navigate to={getSession() ? "/feed" : "/login"} replace />;
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void initializeAuth()
      .then((session) => (session ? loadMyProfile() : null))
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0f0f10] text-[#9a9ad0]">
        Carregando CODE.HUB…
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginRoute />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/cadastro"
        element={
          <PublicOnlyRoute>
            <SignupRoute />
          </PublicOnlyRoute>
        }
      />
      <Route path="/termos" element={<LegalScreen kind="terms" />} />
      <Route path="/privacidade" element={<LegalScreen kind="privacy" />} />

      <Route
        element={
          <ProtectedRoute>
            <MvpShell />
          </ProtectedRoute>
        }
      >
        <Route path="/feed" element={<ScreenFeedHome />} />
        <Route path="/publicar" element={<ScreenCriarPublicacao />} />
        <Route path="/publicacao/:id" element={<PublicationScreen />} />
        <Route path="/mensagens" element={<ScreenMensagens />} />
        <Route path="/mensagens/:conversationId" element={<ScreenMensagens />} />
        <Route path="/notificacoes" element={<ScreenNotificacoes />} />
        <Route path="/perfil" element={<Navigate to="/perfil/eu" replace />} />
        <Route path="/perfil/:username" element={<ScreenProfile />} />
      </Route>

      <Route
        path="/configuracoes/perfil"
        element={
          <ProtectedRoute>
            <ProfileEditRoute />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

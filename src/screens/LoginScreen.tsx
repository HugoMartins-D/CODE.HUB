import { useState } from "react";
import { AuthError, login, loginWithGithub } from "@/lib/auth";
import { loadMyProfile } from "@/lib/profile";

type Props = {
  onLogin: () => void;
  onSignup: () => void;
};

function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  invalid,
  autoComplete,
  extra,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  autoComplete?: string;
  extra?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = invalid ? "#c4514e" : focused ? "#474797" : "#494950";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: 13,
            color: "#c4c4c9",
          }}
        >
          {label}
        </label>
        {extra}
      </div>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.currentTarget.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            display: "block",
            width: "100%",
            height: 48,
            backgroundColor: "#1c1c1c",
            border: `1px solid ${borderColor}`,
            borderRadius: 8,
            padding: "0 16px",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "#f7f7f8",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            boxShadow: focused && !invalid ? "0 0 0 3px rgba(71,71,151,0.25)" : "none",
          }}
        />
      </div>
    </div>
  );
}

export default function LoginScreen({ onLogin, onSignup }: Props) {
  const [hovering, setHovering] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get("oauth") === "failed"
      ? "Não foi possível entrar com o GitHub. Tente novamente."
      : null,
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      await loadMyProfile();
      onLogin();
    } catch (err) {
      setError(
        err instanceof AuthError ? err.message : "Não foi possível entrar. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100dvh",
        backgroundColor: "#0f0f10",
        overflow: "hidden",
      }}
    >
      {/* ── Left branding panel (desktop only) ── */}
      <div
        className="hidden lg:flex"
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#474797",
          width: "min(45%, 560px)",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <img
          src="/LOGO%20ESCRITA%20BRANCA.svg"
          alt="CODE.HUB"
          style={{ width: 235, height: "auto", display: "block" }}
        />

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 432 }}>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 34,
              color: "#fff",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Construa, compartilhe e cresça com a maior comunidade tech do Brasil
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Vagas e experiências trocadas todos os dias entre devs, designers e vibecoders.
          </p>
        </div>

        {/* Footer */}
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
            margin: 0,
          }}
        >
          © 2026 CODE.HUB
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          padding: "40px 24px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ marginBottom: 4 }}>
            <img
              src="/LOGO%20ESCRITA%20BRANCA.svg"
              alt="CODE.HUB"
              style={{ width: 253, height: "auto", display: "block", marginBottom: 8 }}
            />
            <p
              style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9a9ad0", margin: 0 }}
            >
              Comunidade tech do Brasil
            </p>
          </div>

          {/* Heading */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 28,
                color: "#f7f7f8",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Bem-vindo de volta
            </h1>
            <p
              style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#c4c4c9", margin: 0 }}
            >
              Entre na sua conta para continuar
            </p>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #5c2b2a",
                backgroundColor: "rgba(196,81,78,0.12)",
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#e0716e",
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          {/* Fields */}
          <InputField
            label="Email"
            placeholder="Digite seu email"
            type="email"
            value={email}
            onChange={setEmail}
            invalid={!!error}
            autoComplete="email"
          />
          <InputField
            label="Senha"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={setPassword}
            invalid={!!error}
            autoComplete="current-password"
            extra={
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  color: "#9a9ad0",
                  cursor: "pointer",
                }}
              >
                Esqueceu a senha?
              </span>
            }
          />

          {/* CTA */}
          <button
            type="submit"
            disabled={submitting}
            onMouseEnter={() => setHovering("login")}
            onMouseLeave={() => setHovering(null)}
            style={{
              width: "100%",
              height: 50,
              backgroundColor: submitting
                ? "#3b3b80"
                : hovering === "login"
                  ? "#5555a8"
                  : "#474797",
              border: "none",
              borderRadius: 10,
              cursor: submitting ? "default" : "pointer",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: "#fff",
              transition: "background-color 0.15s ease",
            }}
          >
            {submitting ? "Entrando…" : "Entrar"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: "#313135" }} />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#7f7f8a",
                whiteSpace: "nowrap",
              }}
            >
              ou continue com
            </span>
            <div style={{ flex: 1, height: 1, backgroundColor: "#313135" }} />
          </div>

          {/* GitHub */}
          <button
            type="button"
            onClick={loginWithGithub}
            onMouseEnter={() => setHovering("github")}
            onMouseLeave={() => setHovering(null)}
            style={{
              width: "100%",
              height: 50,
              backgroundColor: hovering === "github" ? "#1c1c1c" : "transparent",
              border: "1px solid #494950",
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: "#f7f7f8",
              transition: "background-color 0.15s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#f7f7f8">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continuar com GitHub
          </button>

          {/* Switch to signup */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#c4c4c9" }}>
              Não tem conta?
            </span>
            <button
              type="button"
              onClick={onSignup}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: "#9a9ad0",
                padding: 0,
              }}
            >
              Criar conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

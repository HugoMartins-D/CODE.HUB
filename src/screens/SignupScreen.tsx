import { useState } from "react";
import { AuthError, loginWithGithub, register } from "@/lib/auth";
import { loadMyProfile } from "@/lib/profile";

type Props = {
  onSignup: () => void;
  onLogin: () => void;
};

function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  invalid,
  trailing,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  trailing?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = invalid ? "#c4514e" : focused ? "#474797" : "#494950";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      <label
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 13, color: "#c4c4c9" }}
      >
        {label}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
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
            padding: trailing ? "0 44px 0 16px" : "0 16px",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "#f7f7f8",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            boxShadow: focused && !invalid ? "0 0 0 3px rgba(71,71,151,0.25)" : "none",
          }}
        />
        {trailing && (
          <div
            style={{
              position: "absolute",
              right: 8,
              top: 0,
              height: 48,
              display: "flex",
              alignItems: "center",
            }}
          >
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SignupScreen({ onSignup, onLogin }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hovering, setHovering] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 8;
  const confirmMismatch = confirm.length > 0 && confirm !== password;
  const canSubmit =
    name.trim().length > 0 && emailValid && passwordValid && confirm === password && accepted;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setFormError(null);
    setSubmitting(true);
    try {
      await register({ name, email, password, confirmPassword: confirm });
      await loadMyProfile();
      onSignup();
    } catch (err) {
      setFormError(
        err instanceof AuthError ? err.message : "Não foi possível criar a conta. Tente novamente.",
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
        <img
          src="/LOGO%20ESCRITA%20BRANCA.svg"
          alt="CODE.HUB"
          style={{ width: 235, height: "auto", display: "block" }}
        />

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
            Junte-se à comunidade que constrói o futuro da tecnologia no Brasil
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
            Crie sua conta gratuitamente e comece a trocar experiências, encontrar vagas e
            acompanhar outros devs.
          </p>
        </div>

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
            gap: 18,
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
              Criar sua conta
            </h1>
            <p
              style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#c4c4c9", margin: 0 }}
            >
              Leva menos de um minuto
            </p>
          </div>

          {formError && (
            <div
              role="alert"
              style={{
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
              {formError}
            </div>
          )}

          {/* Fields */}
          <InputField
            label="Nome completo"
            placeholder="Digite seu nome completo"
            value={name}
            onChange={setName}
          />
          <InputField
            label="Email"
            placeholder="seu@email.com"
            type="email"
            value={email}
            onChange={setEmail}
          />
          <InputField
            label="Senha"
            placeholder="Crie uma senha (mín. 8 caracteres)"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={setPassword}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 8px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#9a9ad0",
                }}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            }
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <InputField
              label="Confirmar senha"
              placeholder="Repita a senha"
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={setConfirm}
              invalid={confirmMismatch}
            />
            {confirmMismatch && (
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "#e0716e",
                  margin: 0,
                }}
              >
                As senhas não coincidem.
              </p>
            )}
          </div>

          {/* Terms */}
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
            <span
              style={{
                position: "relative",
                flexShrink: 0,
                width: 18,
                height: 18,
                marginTop: 1,
                borderRadius: 4,
                border: `1.5px solid ${accepted ? "#474797" : "#494950"}`,
                backgroundColor: accepted ? "#474797" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.15s ease, border-color 0.15s ease",
              }}
            >
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.currentTarget.checked)}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  margin: 0,
                  cursor: "pointer",
                }}
              />
              {accepted && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6.2 4.8 9 10 3.2"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#c4c4c9",
                lineHeight: 1.5,
              }}
            >
              Aceito os{" "}
              <a
                href="/termos"
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                style={{ color: "#9a9ad0", textDecoration: "underline" }}
              >
                Termos de Uso
              </a>{" "}
              e a{" "}
              <a
                href="/privacidade"
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                style={{ color: "#9a9ad0", textDecoration: "underline" }}
              >
                Política de Privacidade
              </a>
            </span>
          </label>

          {/* CTA */}
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            onMouseEnter={() => setHovering("signup")}
            onMouseLeave={() => setHovering(null)}
            style={{
              width: "100%",
              height: 50,
              backgroundColor: !canSubmit
                ? "#2c2c4a"
                : submitting
                  ? "#3b3b80"
                  : hovering === "signup"
                    ? "#5555a8"
                    : "#474797",
              border: "none",
              borderRadius: 10,
              cursor: !canSubmit ? "not-allowed" : submitting ? "default" : "pointer",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: canSubmit ? "#fff" : "#8a8a9e",
              transition: "background-color 0.15s ease",
            }}
          >
            {submitting ? "Criando conta…" : "Criar conta"}
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

          {/* Switch to login */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#c4c4c9" }}>
              Já tem conta?
            </span>
            <button
              type="button"
              onClick={onLogin}
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
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

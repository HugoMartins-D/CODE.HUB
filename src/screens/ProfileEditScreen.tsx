import { useState } from "react";
import {
  getProfile,
  initialsOf,
  MAX_PROFILE_IMAGE_BYTES,
  normalizeUsername,
  ProfileError,
  saveProfile,
} from "@/lib/profile";

function formatJoined(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: 14,
        color: "#f7f7f8",
        marginTop: 8,
      }}
    >
      {children}
    </span>
  );
}

type Props = {
  onCancel: () => void;
  onSaved: () => void;
};

const fieldWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 500,
  fontSize: 13,
  color: "#c4c4c9",
};

const controlStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#1c1c1c",
  border: "1px solid #494950",
  borderRadius: 8,
  padding: "12px 16px",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#f7f7f8",
  outline: "none",
  boxSizing: "border-box",
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.currentTarget.value)}
          rows={4}
          style={{ ...controlStyle, resize: "vertical", minHeight: 96, lineHeight: 1.5 }}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.currentTarget.value)}
          style={{ ...controlStyle, height: 46 }}
        />
      )}
      {hint && (
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#7f7f8a" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

export default function ProfileEditScreen({ onCancel, onSaved }: Props) {
  const initial = getProfile();
  const [name, setName] = useState(initial.name);
  const [username, setUsername] = useState(initial.username);
  const [headline, setHeadline] = useState(initial.headline);
  const [location, setLocation] = useState(initial.location);
  const [website, setWebsite] = useState(initial.website);
  const [bio, setBio] = useState(initial.bio);
  const [skills, setSkills] = useState(initial.skills.join(", "));
  const [hovering, setHovering] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState<File | null | undefined>();
  const [banner, setBanner] = useState<File | null | undefined>();
  const [avatarPreview, setAvatarPreview] = useState(initial.avatarUrl);
  const [bannerPreview, setBannerPreview] = useState(initial.bannerUrl);
  const joined = formatJoined(initial.joinedAt);

  const handleSave = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await saveProfile(
        {
          username,
          name: name.trim(),
          headline: headline.trim(),
          location: location.trim(),
          website: website.trim(),
          bio: bio.trim(),
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        { avatar, banner },
      );
      onSaved();
    } catch (reason) {
      setError(
        reason instanceof ProfileError ? reason.message : "Não foi possível salvar o perfil.",
      );
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        backgroundColor: "#0f0f10",
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSave}
        style={{
          width: "100%",
          maxWidth: 560,
          padding: "40px 24px 64px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Voltar"
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "1px solid #494950",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="#c4c4c9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: "#f7f7f8",
              margin: 0,
            }}
          >
            Editar perfil
          </h1>
        </div>

        <SectionLabel>Foto e banner</SectionLabel>
        <div className="relative h-[150px] overflow-hidden rounded-[14px] border border-[#313135] bg-[#474797]">
          {bannerPreview ? (
            <img src={bannerPreview} alt="Prévia do banner" className="size-full object-cover" />
          ) : null}
          <label className="absolute bottom-3 right-3 cursor-pointer rounded-[9px] bg-black/70 px-3 py-2 text-xs font-semibold text-white">
            Alterar banner
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (!file) return;
                if (!file.type.startsWith("image/") || file.size > MAX_PROFILE_IMAGE_BYTES) {
                  setError("Envie uma imagem de até 5 MB.");
                  return;
                }
                setBanner(file);
                setBannerPreview(URL.createObjectURL(file));
              }}
            />
          </label>
          {bannerPreview ? (
            <button
              type="button"
              onClick={() => {
                setBanner(null);
                setBannerPreview("");
              }}
              className="absolute left-3 top-3 rounded-[8px] bg-black/70 px-3 py-1.5 text-xs text-white"
            >
              Remover
            </button>
          ) : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "#c7d300",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Prévia da foto de perfil"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: 24,
                  color: "#fff",
                }}
              >
                {initialsOf(name)}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-[9px] bg-[#474797] px-3 py-2 text-xs font-semibold text-white">
              Alterar foto
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (!file) return;
                  if (!file.type.startsWith("image/") || file.size > MAX_PROFILE_IMAGE_BYTES) {
                    setError("Envie uma imagem de até 5 MB.");
                    return;
                  }
                  setAvatar(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
              />
            </label>
            {avatarPreview ? (
              <button
                type="button"
                onClick={() => {
                  setAvatar(null);
                  setAvatarPreview("");
                }}
                className="rounded-[9px] border border-[#494950] px-3 py-2 text-xs text-[#c4c4c9]"
              >
                Remover
              </button>
            ) : null}
            <span className="w-full text-xs text-[#7f7f8a]">
              JPG, PNG, WebP, AVIF ou HEIC · até 5 MB.
            </span>
          </div>
        </div>

        <Field label="Nome" value={name} onChange={setName} placeholder="Seu nome" />
        <Field
          label="Nome de usuário"
          value={username}
          onChange={(value) => setUsername(normalizeUsername(value))}
          placeholder="seu.usuario"
          hint="Seu endereço público: code.hub/perfil/@usuario · letras, números, ponto e _."
        />
        <Field
          label="Título"
          value={headline}
          onChange={setHeadline}
          placeholder="Ex.: Fullstack Developer"
        />

        <SectionLabel>Sobre</SectionLabel>
        <Field
          label="Bio"
          value={bio}
          onChange={setBio}
          placeholder="Fale um pouco sobre você"
          multiline
        />
        <Field
          label="Localização"
          value={location}
          onChange={setLocation}
          placeholder="Ex.: São Paulo, Brasil"
        />
        <Field
          label="Site"
          value={website}
          onChange={setWebsite}
          placeholder="seudominio.dev"
          hint={joined ? `Entrou em ${joined} · esta data não pode ser alterada.` : undefined}
        />

        <SectionLabel>Skills</SectionLabel>
        <Field
          label="Skills"
          value={skills}
          onChange={setSkills}
          placeholder="React, Node.js, PostgreSQL"
          hint="Separe por vírgulas."
        />

        {/* Actions */}
        {error ? (
          <p role="alert" style={{ color: "#e0716e", fontSize: 13, margin: 0 }}>
            {error}
          </p>
        ) : null}
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <button
            type="submit"
            disabled={saving}
            onMouseEnter={() => setHovering("save")}
            onMouseLeave={() => setHovering(null)}
            style={{
              flex: 1,
              height: 46,
              backgroundColor: hovering === "save" ? "#5555a8" : "#474797",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              color: "#fff",
              transition: "background-color 0.15s ease",
            }}
          >
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              height: 46,
              padding: "0 20px",
              backgroundColor: "transparent",
              border: "1px solid #494950",
              borderRadius: 10,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              color: "#c4c4c9",
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

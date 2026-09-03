/**
 * Small shared UI kit used by the create/detail screens so they stay visually
 * consistent with the Feed / Profile / Comunidade screens and stay responsive.
 */
import type { ReactNode } from "react";
import Sidebar from "@/imports/_shared/Sidebar";

type SidebarKey =
  | "feed"
  | "criar-publicacao"
  | "vagas"
  | "comunidade"
  | "mensagens"
  | "notificacoes"
  | "profile";

const FONT_HEAD = "font-['Space_Grotesk:Bold',sans-serif] font-bold";
const FONT_SEMI = "font-['Inter:Semi_Bold',sans-serif] font-semibold";
const FONT_MED = "font-['Inter:Medium',sans-serif] font-medium";
const FONT_REG = "font-['Inter:Regular',sans-serif]";

export function PageShell({
  active,
  maxWidth = 720,
  children,
}: {
  active: SidebarKey;
  maxWidth?: number;
  children: ReactNode;
}) {
  return (
    <div className="bg-[#0f0f10] flex items-start relative size-full min-h-full">
      <Sidebar active={active} />
      <div className="flex-1 min-w-0 flex justify-center px-[16px] py-[28px] lg:px-[24px] lg:py-[40px]">
        <div className="w-full flex flex-col gap-[24px]" style={{ maxWidth }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <h1 className={`${FONT_HEAD} text-[#f7f7f8] text-[26px] lg:text-[28px]`}>{title}</h1>
      {subtitle && <p className={`${FONT_REG} text-[#c4c4c9] text-[14px] lg:text-[15px]`}>{subtitle}</p>}
    </div>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#141416] border border-[#313135] rounded-[16px] p-[20px] lg:p-[24px] flex flex-col gap-[18px]">
      {children}
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-[8px]">
      <span className={`${FONT_SEMI} text-[#f7f7f8] text-[14px]`}>{label}</span>
      {children}
      {hint && <span className={`${FONT_REG} text-[#7f7f8a] text-[12px]`}>{hint}</span>}
    </label>
  );
}

const inputClass =
  `w-full bg-[#1c1c1c] border border-[#494950] rounded-[10px] px-[16px] py-[12px] ${FONT_REG} text-[14px] text-[#f7f7f8] placeholder:text-[#7f7f8a] outline-none focus:border-[#474797] transition-colors`;

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-[120px] resize-y`} />;
}

export function ChipRow({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-[8px]">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={
            `rounded-[999px] px-[16px] py-[7px] text-[13px] cursor-pointer transition-colors ${FONT_MED} ` +
            (value === opt
              ? "bg-[#474797] text-white"
              : "bg-[#1c1c1c] border border-[#494950] text-[#c4c4c9] hover:border-[#5a5a62]")
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-[10px] bg-[#474797] hover:bg-[#5252a8] disabled:bg-[#2c2c4a] disabled:text-[#8a8a9e] text-white px-[24px] py-[11px] ${FONT_SEMI} text-[14px] cursor-pointer disabled:cursor-not-allowed transition-colors`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-[10px] border border-[#494950] hover:bg-[#1c1c1c] text-[#f7f7f8] px-[24px] py-[11px] ${FONT_SEMI} text-[14px] cursor-pointer transition-colors`}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, hint, icon }: { title: string; hint: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-[10px] border border-[#313135] rounded-[16px] py-[48px] px-[24px] text-center">
      {icon && (
        <div className="flex size-[56px] items-center justify-center rounded-full bg-[#1c1c1c]">{icon}</div>
      )}
      <p className={`${FONT_SEMI} text-[#c4c4c9] text-[14px]`}>{title}</p>
      <p className={`${FONT_REG} text-[#7f7f8a] text-[13px] max-w-[360px]`}>{hint}</p>
    </div>
  );
}

import { useState } from "react";
import { PageShell, PageHeader, Card, TextInput, PrimaryButton, EmptyState } from "@/imports/_shared/ui";

const TABS = ["Discussões", "Membros", "Eventos"] as const;
type Tab = (typeof TABS)[number];

export default function ScreenGrupoFrontend() {
  const [tab, setTab] = useState<Tab>("Discussões");
  const [draft, setDraft] = useState("");

  return (
    <PageShell active="comunidade" maxWidth={720}>
      <PageHeader title="Frontend" subtitle="Grupo da comunidade · público" />

      <div className="flex gap-[6px] border-b border-[#313135]">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              "px-[14px] py-[10px] text-[14px] cursor-pointer border-b-2 -mb-px transition-colors " +
              (tab === t
                ? "border-[#474797] text-[#f7f7f8] font-['Inter:Semi_Bold',sans-serif] font-semibold"
                : "border-transparent text-[#7f7f8a] font-['Inter:Medium',sans-serif] font-medium hover:text-[#c4c4c9]")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Discussões" && (
        <>
          <Card>
            <div className="flex gap-[10px]">
              <TextInput
                value={draft}
                onChange={(e) => setDraft(e.currentTarget.value)}
                placeholder="Compartilhe algo com o grupo Frontend..."
              />
              <PrimaryButton type="button" disabled={!draft.trim()} onClick={() => setDraft("")}>
                Publicar
              </PrimaryButton>
            </div>
          </Card>
          <EmptyState
            title="Nenhuma discussão ainda"
            hint="Seja a primeira pessoa a iniciar uma conversa neste grupo."
          />
        </>
      )}

      {tab === "Membros" && (
        <EmptyState
          title="Você é o primeiro por aqui"
          hint="Convide outras pessoas para o grupo — elas aparecem nesta lista."
        />
      )}

      {tab === "Eventos" && (
        <EmptyState
          title="Nenhum evento do grupo"
          hint="Crie um evento a partir da página Comunidade para reunir os membros."
        />
      )}
    </PageShell>
  );
}

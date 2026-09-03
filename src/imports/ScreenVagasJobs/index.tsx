import { useState } from "react";
import { PageShell, PageHeader, ChipRow, TextInput, EmptyState } from "@/imports/_shared/ui";

const FILTERS = ["Todas", "Remoto", "Presencial", "Estágio", "Pleno", "Sênior"];

export default function ScreenVagasJobs() {
  const [filter, setFilter] = useState("Todas");
  const [query, setQuery] = useState("");

  return (
    <PageShell active="vagas" maxWidth={880}>
      <PageHeader title="Vagas" subtitle="Oportunidades compartilhadas pela comunidade tech." />

      <TextInput
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        placeholder="Buscar por cargo, empresa ou stack..."
      />
      <ChipRow options={FILTERS} value={filter} onChange={setFilter} />

      <EmptyState
        title="Nenhuma vaga publicada ainda"
        hint="Assim que alguém da comunidade publicar uma oportunidade, ela aparece aqui."
        icon={
          <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
            <rect x="2.75" y="7.33333" width="16.5" height="11" rx="2" stroke="#7f7f8a" strokeWidth="1.75" strokeLinecap="round" />
            <path
              d="M7.33333 7.33333V5.5C7.33333 4.57953 8.07953 3.83333 9 3.83333H13C13.9205 3.83333 14.6667 4.57953 14.6667 5.5V7.33333"
              stroke="#7f7f8a"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <path d="M2.75 11.9167H19.25" stroke="#7f7f8a" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        }
      />
    </PageShell>
  );
}

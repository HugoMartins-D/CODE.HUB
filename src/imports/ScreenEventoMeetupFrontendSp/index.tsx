import { useState } from "react";
import { PageShell, PageHeader, Card, PrimaryButton, GhostButton, EmptyState } from "@/imports/_shared/ui";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#7f7f8a] text-[12px] uppercase tracking-[0.6px]">
        {label}
      </span>
      <span className="font-['Inter:Regular',sans-serif] text-[#f7f7f8] text-[14px]">{value}</span>
    </div>
  );
}

export default function ScreenEventoMeetupFrontendSp() {
  const [going, setGoing] = useState(false);

  return (
    <PageShell active="comunidade" maxWidth={680}>
      <PageHeader title="Meetup Frontend SP" subtitle="Evento da comunidade" />

      <Card>
        <div className="grid gap-[16px] sm:grid-cols-2">
          <InfoRow label="Data e hora" value="A definir" />
          <InfoRow label="Formato" value="Presencial" />
          <InfoRow label="Local" value="A definir" />
          <InfoRow label="Organização" value="Comunidade CODE.HUB" />
        </div>

        <p className="font-['Inter:Regular',sans-serif] text-[#c4c4c9] text-[14px] leading-[1.6]">
          Detalhes deste evento ainda estão sendo definidos pela organização. Confirme sua presença
          para receber atualizações assim que a agenda for publicada.
        </p>

        <div className="flex items-center gap-[10px]">
          <PrimaryButton type="button" onClick={() => setGoing((g) => !g)}>
            {going ? "Presença confirmada" : "Confirmar presença"}
          </PrimaryButton>
          {going && (
            <GhostButton type="button" onClick={() => setGoing(false)}>
              Cancelar presença
            </GhostButton>
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-[12px]">
        <h2 className="font-['Space_Grotesk:Bold',sans-serif] font-bold text-[#f7f7f8] text-[18px]">Quem vai</h2>
        <EmptyState
          title={going ? "Só você até agora" : "Ninguém confirmado ainda"}
          hint="A lista de participantes aparece aqui conforme as pessoas confirmam presença."
        />
      </div>
    </PageShell>
  );
}

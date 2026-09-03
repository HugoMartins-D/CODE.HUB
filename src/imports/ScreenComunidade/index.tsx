import Sidebar from "@/imports/_shared/Sidebar";

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between w-full">
      <p className="font-['Space_Grotesk:Bold',sans-serif] font-bold text-[#f7f7f8] text-[20px]">{title}</p>
      {action}
    </div>
  );
}

function OutlineButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="relative rounded-[10px] border border-[#494950] cursor-pointer hover:bg-[#1c1c1c] transition-colors"
    >
      <div className="flex items-center justify-center px-[18px] py-[10px]">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#f7f7f8] text-[14px] whitespace-nowrap">
          {children}
        </p>
      </div>
    </button>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col gap-[6px] items-center justify-center border border-[#313135] rounded-[16px] py-[40px] px-[24px] w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#c4c4c9]">{title}</p>
      <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#7f7f8a] text-center max-w-[380px]">{hint}</p>
    </div>
  );
}

export default function ScreenComunidade() {
  return (
    <div className="bg-[#0f0f10] flex items-start relative size-full" data-name="Screen / Comunidade">
      <Sidebar active="comunidade" />

      <div className="flex-1 min-w-0 flex justify-center px-[24px] py-[40px]">
        <div className="w-full max-w-[1040px] flex flex-col gap-[40px]">
          {/* Header */}
          <div className="flex flex-col gap-[6px]">
            <p className="font-['Space_Grotesk:Bold',sans-serif] font-bold text-[#f7f7f8] text-[28px]">
              Comunidade
            </p>
            <p className="font-['Inter:Regular',sans-serif] text-[#c4c4c9] text-[15px]">
              Encontre grupos, pessoas e eventos da comunidade tech
            </p>
          </div>

          {/* Grupos */}
          <div className="flex flex-col gap-[16px] w-full">
            <SectionHeader title="Grupos" action={<OutlineButton>+ Criar comunidade</OutlineButton>} />
            <EmptyState
              title="Nenhum grupo ainda"
              hint="Crie o primeiro grupo da comunidade ou aguarde novos grupos aparecerem aqui."
            />
          </div>

          {/* Devs para seguir */}
          <div className="flex flex-col gap-[16px] w-full">
            <SectionHeader title="Devs para seguir" />
            <EmptyState
              title="Nada por aqui ainda"
              hint="Sugestões de devs para seguir vão aparecer conforme a comunidade cresce."
            />
          </div>

          {/* Eventos */}
          <div className="flex flex-col gap-[16px] w-full">
            <SectionHeader title="Eventos" action={<OutlineButton>Criar evento</OutlineButton>} />
            <EmptyState
              title="Nenhum evento agendado"
              hint="Crie um evento para reunir a comunidade — ele aparece aqui para todos."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

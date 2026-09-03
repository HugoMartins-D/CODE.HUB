import svgPaths from "./svg-9mafjm0jkz";

function JobCard({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[#1c1c1c] relative rounded-[16px] w-[340px]"} data-name="Job Card">
      <div aria-hidden className="absolute border border-[#313135] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative size-full">
        <div className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0" data-name="Frame">
          <div className="bg-[#474797] relative rounded-[10px] shrink-0 size-[44px]" data-name="Frame" />
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] overflow-clip relative shrink-0 whitespace-nowrap" data-name="Frame">
            <p className="font-['Space_Grotesk:Medium',sans-serif] font-medium relative shrink-0 text-[#f7f7f8] text-[16px]">Engenheiro(a) Frontend</p>
            <p className="font-['Inter:Regular',sans-serif] font-normal not-italic relative shrink-0 text-[#c4c4c9] text-[13px]">Nimbus Labs</p>
          </div>
        </div>
        <div className="content-stretch flex gap-[6px] items-start overflow-clip relative shrink-0" data-name="Frame">
          <div className="bg-[#313135] content-stretch flex items-start overflow-clip px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
            <p className="[word-break:break-word] font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#c4c4c9] text-[10px] whitespace-nowrap">REMOTO</p>
          </div>
          <div className="bg-[#313135] content-stretch flex items-start overflow-clip px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
            <p className="[word-break:break-word] font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#c4c4c9] text-[10px] whitespace-nowrap">FULL-TIME</p>
          </div>
          <div className="bg-[#313135] content-stretch flex items-start overflow-clip px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
            <p className="[word-break:break-word] font-['JetBrains_Mono:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#c4c4c9] text-[10px] whitespace-nowrap">PL</p>
          </div>
        </div>
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#25da67] text-[14px] whitespace-nowrap">R$ 9.000 – 13.000 / mês</p>
        <div className="bg-[#474797] relative rounded-[10px] shrink-0 w-full" data-name="Frame">
          <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex items-start justify-center px-[20px] py-[10px] relative size-full">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap">Candidatar-se</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
type AvatarProps = {
  className?: string;
  size?: "Medium";
};

function Avatar({ className, size = "Medium" }: AvatarProps) {
  return (
    <div className={className || "bg-[#474797] relative rounded-[999px] size-[40px]"}>
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center relative size-full">
          <p className="[word-break:break-word] font-['Space_Grotesk:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">HM</p>
        </div>
      </div>
    </div>
  );
}

function LogoRow() {
  return (
    <div className="relative shrink-0 w-full" data-name="logoRow">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start pb-[12px] px-[20px] relative size-full">
          <p className="[word-break:break-word] font-['Space_Grotesk:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#f7f7f8] text-[20px] whitespace-nowrap">code.hub</p>
        </div>
      </div>
    </div>
  );
}

function SearchWrap() {
  return (
    <div className="relative shrink-0 w-full" data-name="searchWrap">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start pb-[16px] px-[20px] relative size-full">
          <div className="bg-[#1c1c1c] flex-[1_0_0] h-[20px] min-w-px relative rounded-[6px]" data-name="Input">
            <div aria-hidden className="absolute border border-[#494950] border-solid inset-0 pointer-events-none rounded-[6px]" />
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-px not-italic relative text-[#7f7f8a] text-[14px]">Buscar...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconHome() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="icon/home">
      <svg className="absolute block inset-0 size-full" fill="none" height="22" preserveAspectRatio="none" viewBox="0 0 22 22" width="22">
        <g id="icon/home">
          <path d={svgPaths.p3e21ac80} id="Vector" stroke="#F7F7F8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p1fbeecc0} id="Vector_2" stroke="#F7F7F8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p3cf1300} id="Vector_3" stroke="#F7F7F8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function NavItemFeed() {
  return (
    <div className="bg-[#313135] relative rounded-[10px] shrink-0 w-full" data-name="navItem-feed">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[14px] py-[11px] relative size-full">
          <IconHome />
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f7f7f8] text-[15px] w-[120px]">Feed</p>
        </div>
      </div>
    </div>
  );
}

function IconPost() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="icon/post">
      <svg className="absolute block inset-0 size-full" fill="none" height="22" preserveAspectRatio="none" viewBox="0 0 22 22" width="22">
        <g id="icon/post">
          <path d={svgPaths.p27213080} id="Vector" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M11 7.33333V14.6667" id="Vector_2" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M7.33333 11H14.6667" id="Vector_3" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function NavItemPostar() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="navItem-postar">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[14px] py-[11px] relative size-full">
          <IconPost />
          <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[15px] w-[120px]">Postar</p>
        </div>
      </div>
    </div>
  );
}

function IconBriefcase() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="icon/briefcase">
      <svg className="absolute block inset-0 size-full" fill="none" height="22" preserveAspectRatio="none" viewBox="0 0 22 22" width="22">
        <g id="icon/briefcase">
          <path d={svgPaths.pf12ec00} id="Vector" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p2d9db200} id="Vector_2" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M2.75 11.9167H19.25" id="Vector_3" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function NavItemVagas() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="navItem-vagas">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[14px] py-[11px] relative size-full">
          <IconBriefcase />
          <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[15px] w-[120px]">Vagas</p>
        </div>
      </div>
    </div>
  );
}

function IconUsers() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="icon/users">
      <svg className="absolute block inset-0 size-full" fill="none" height="22" preserveAspectRatio="none" viewBox="0 0 22 22" width="22">
        <g id="icon/users">
          <path d={svgPaths.p1b678b00} id="Vector" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p2027fd50} id="Vector_2" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p24659600} id="Vector_3" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.pe64e200} id="Vector_4" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function NavItemComunidade() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="navItem-comunidade">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[14px] py-[11px] relative size-full">
          <IconUsers />
          <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[15px] w-[120px]">Comunidade</p>
        </div>
      </div>
    </div>
  );
}

function DivWrap() {
  return (
    <div className="content-stretch flex items-start overflow-clip py-[8px] relative shrink-0 w-full" data-name="divWrap">
      <div className="bg-[#313135] flex-[1_0_0] h-px min-w-px relative" data-name="divider" />
    </div>
  );
}

function IconMessage() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="icon/message">
      <svg className="absolute block inset-0 size-full" fill="none" height="22" preserveAspectRatio="none" viewBox="0 0 22 22" width="22">
        <g id="icon/message">
          <path d={svgPaths.p1e4c9a00} id="Vector" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function NavBadge() {
  return (
    <div className="bg-[#e93e8f] content-stretch flex items-center justify-center overflow-clip relative rounded-[10px] shrink-0 size-[20px]" data-name="navBadge">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[11px] text-white whitespace-nowrap">3</p>
    </div>
  );
}

function NavItemMensagens() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="navItem-mensagens">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[14px] py-[11px] relative size-full">
          <IconMessage />
          <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[15px] w-[120px]">Mensagens</p>
          <NavBadge />
        </div>
      </div>
    </div>
  );
}

function IconBell() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="icon/bell">
      <svg className="absolute block inset-0 size-full" fill="none" height="22" preserveAspectRatio="none" viewBox="0 0 22 22" width="22">
        <g id="icon/bell">
          <path d={svgPaths.p3ce76080} id="Vector" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p467ef00} id="Vector_2" stroke="#A4A4AC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function NavBadge1() {
  return (
    <div className="bg-[#e93e8f] content-stretch flex items-center justify-center overflow-clip relative rounded-[10px] shrink-0 size-[20px]" data-name="navBadge">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[11px] text-white whitespace-nowrap">5</p>
    </div>
  );
}

function NavItemNotificacoes() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="navItem-notificacoes">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[14px] items-center px-[14px] py-[11px] relative size-full">
          <IconBell />
          <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[15px] w-[120px]">Notificações</p>
          <NavBadge1 />
        </div>
      </div>
    </div>
  );
}

function NavList() {
  return (
    <div className="relative shrink-0 w-full" data-name="navList">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[2px] items-start px-[12px] relative size-full">
          <NavItemFeed />
          <NavItemPostar />
          <NavItemVagas />
          <NavItemComunidade />
          <DivWrap />
          <NavItemMensagens />
          <NavItemNotificacoes />
        </div>
      </div>
    </div>
  );
}

function PublicarWrap() {
  return (
    <div className="relative shrink-0 w-full" data-name="publicarWrap">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start pt-[16px] px-[20px] relative size-full">
          <div className="bg-[#474797] flex-[1_0_0] min-w-px relative rounded-[10px]" data-name="Button">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex items-center justify-center px-[28px] py-[16px] relative size-full">
                <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Publicar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spacer() {
  return <div className="flex-[1_0_0] min-h-px relative w-full" data-name="spacer" />;
}

function UserCol() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-px items-start leading-[normal] min-w-px not-italic overflow-clip relative" data-name="userCol">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#f7f7f8] text-[14px] w-full">Hugo Martins</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#7f7f8a] text-[12px] w-full">Dev Fullstack</p>
    </div>
  );
}

function UserRow() {
  return (
    <div className="relative shrink-0 w-full" data-name="userRow">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center pt-[8px] px-[20px] relative size-full">
          <Avatar className="bg-[#474797] relative rounded-[999px] shrink-0 size-[40px]" />
          <UserCol />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#474797] content-stretch flex items-center justify-center overflow-clip relative rounded-[24px] shrink-0 size-[48px]" data-name="Frame">
      <p className="[word-break:break-word] font-['Space_Grotesk:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap">HM</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#f7f7f8] text-[15px]">Hugo Martins</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#c4c4c9] text-[13px]">Fullstack Dev</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0" data-name="Frame">
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium gap-[4px] items-start not-italic overflow-clip relative shrink-0 text-[#25da67]" data-name="Frame">
      <p className="relative shrink-0 text-[13px]">↑</p>
      <p className="relative shrink-0 text-[12px]">+12% essa semana</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start overflow-clip relative shrink-0 w-[280px]" data-name="Frame">
      <Frame2 />
      <div className="bg-[#1c1c1c] relative rounded-[16px] shrink-0 w-[220px]" data-name="Stat Tile">
        <div aria-hidden className="absolute border border-[#313135] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start leading-[normal] p-[24px] relative size-full whitespace-nowrap">
          <p className="font-['Inter:Medium',sans-serif] font-medium not-italic relative shrink-0 text-[#c4c4c9] text-[13px]">Novos membros</p>
          <p className="font-['Space_Grotesk:Bold',sans-serif] font-bold relative shrink-0 text-[#f7f7f8] text-[32px]">1.2k</p>
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#474797] content-stretch flex items-center justify-center overflow-clip relative rounded-[20px] shrink-0 size-[40px]" data-name="Frame">
      <p className="[word-break:break-word] font-['Space_Grotesk:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">HM</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-[#0f0f10] flex-[1_0_0] h-[40px] min-w-px relative rounded-[8px]" data-name="Frame">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[14px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#7f7f8a] text-[14px] whitespace-nowrap">O que você está construindo hoje?</p>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#494950] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[12px] h-[45px] items-center overflow-clip relative shrink-0 w-full" data-name="Frame">
      <Frame9 />
      <Frame10 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#1c1c1c] relative rounded-[12px] shrink-0 w-full" data-name="Frame">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start p-[16px] relative size-full">
          <Frame8 />
          <div className="bg-[#474797] relative rounded-[10px] shrink-0" data-name="Button">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex items-center justify-center px-[20px] py-[12px] relative size-full">
                <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">Publicar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#494950] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[8px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <div className="bg-[#474797] relative rounded-[999px] shrink-0" data-name="Filter Chip">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[10px] py-[4px] relative size-full">
            <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[13px] text-white whitespace-nowrap">Todos</p>
          </div>
        </div>
      </div>
      <div className="bg-[#313135] relative rounded-[999px] shrink-0" data-name="Filter Chip">
        <div aria-hidden className="absolute border border-[#494950] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[10px] py-[4px] relative size-full">
            <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[13px] whitespace-nowrap">Vagas</p>
          </div>
        </div>
      </div>
      <div className="bg-[#313135] relative rounded-[999px] shrink-0" data-name="Filter Chip">
        <div aria-hidden className="absolute border border-[#494950] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[10px] py-[4px] relative size-full">
            <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[13px] whitespace-nowrap">Dúvidas</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#474797] content-stretch flex items-center justify-center overflow-clip relative rounded-[20px] shrink-0 size-[40px]" data-name="Frame">
      <p className="[word-break:break-word] font-['Space_Grotesk:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">HM</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[6px] items-center overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#f7f7f8] text-[14px]">Marina Pires</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#7f7f8a] text-[12px]">@hugom</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap" data-name="Frame">
      <Frame15 />
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#7f7f8a] text-[12px]">há 2 horas</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0" data-name="Frame">
      <Frame13 />
      <Frame14 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#0f0f10] relative rounded-[6px] shrink-0 w-full" data-name="Frame">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="[word-break:break-word] content-stretch flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal items-start leading-[normal] px-[16px] py-[14px] relative size-full text-[12px] whitespace-nowrap">
          <p className="relative shrink-0 text-[#26b2f2]">{`UPDATE jobs SET status='locked'`}</p>
          <p className="relative shrink-0 text-[#c4c4c9]">{`WHERE id = $1 AND status='pending';`}</p>
        </div>
      </div>
    </div>
  );
}

function IconMessage1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="icon/message">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="icon/message">
          <path d={svgPaths.p3e7fc400} id="Vector" stroke="#C4C4C9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[6px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[13px] whitespace-nowrap">♥ 128</p>
      <IconMessage1 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[13px] whitespace-nowrap">24</p>
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[13px] whitespace-nowrap">↗ Compartilhar</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-[#474797] content-stretch flex items-center justify-center overflow-clip relative rounded-[20px] shrink-0 size-[40px]" data-name="Frame">
      <p className="[word-break:break-word] font-['Space_Grotesk:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">HM</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[6px] items-center overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#f7f7f8] text-[14px]">Lucas Andrade</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#7f7f8a] text-[12px]">@hugom</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap" data-name="Frame">
      <Frame21 />
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#7f7f8a] text-[12px]">há 2 horas</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0" data-name="Frame">
      <Frame19 />
      <Frame20 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#0f0f10] relative rounded-[6px] shrink-0 w-full" data-name="Frame">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="[word-break:break-word] content-stretch flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal items-start leading-[normal] px-[16px] py-[14px] relative size-full text-[12px] whitespace-nowrap">
          <p className="relative shrink-0 text-[#26b2f2]">{`UPDATE jobs SET status='locked'`}</p>
          <p className="relative shrink-0 text-[#c4c4c9]">{`WHERE id = $1 AND status='pending';`}</p>
        </div>
      </div>
    </div>
  );
}

function IconMessage2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="icon/message">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="icon/message">
          <path d={svgPaths.p3e7fc400} id="Vector" stroke="#C4C4C9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex gap-[6px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[13px] whitespace-nowrap">♥ 128</p>
      <IconMessage2 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[13px] whitespace-nowrap">24</p>
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[13px] whitespace-nowrap">↗ Compartilhar</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-[#474797] content-stretch flex items-center justify-center overflow-clip relative rounded-[20px] shrink-0 size-[40px]" data-name="Frame">
      <p className="[word-break:break-word] font-['Space_Grotesk:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">HM</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[6px] items-center overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#f7f7f8] text-[14px]">Duda Ramos</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#7f7f8a] text-[12px]">@hugom</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap" data-name="Frame">
      <Frame27 />
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#7f7f8a] text-[12px]">há 2 horas</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0" data-name="Frame">
      <Frame25 />
      <Frame26 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="bg-[#0f0f10] relative rounded-[6px] shrink-0 w-full" data-name="Frame">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="[word-break:break-word] content-stretch flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal items-start leading-[normal] px-[16px] py-[14px] relative size-full text-[12px] whitespace-nowrap">
          <p className="relative shrink-0 text-[#26b2f2]">{`UPDATE jobs SET status='locked'`}</p>
          <p className="relative shrink-0 text-[#c4c4c9]">{`WHERE id = $1 AND status='pending';`}</p>
        </div>
      </div>
    </div>
  );
}

function IconMessage3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="icon/message">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="icon/message">
          <path d={svgPaths.p3e7fc400} id="Vector" stroke="#C4C4C9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[6px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[13px] whitespace-nowrap">♥ 128</p>
      <IconMessage3 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[13px] whitespace-nowrap">24</p>
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#c4c4c9] text-[13px] whitespace-nowrap">↗ Compartilhar</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px overflow-clip relative" data-name="Frame">
      <Frame7 />
      <Frame11 />
      <div className="bg-[#1c1c1c] relative rounded-[16px] shrink-0 w-full" data-name="Feed Post">
        <div aria-hidden className="absolute border border-[#313135] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <div className="content-stretch flex flex-col gap-[14px] items-start p-[20px] relative size-full">
          <Frame12 />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#f7f7f8] text-[14px] w-[min-content]">Finalmente resolvi o bug de race condition no meu projeto de filas! O segredo era um lock otimista:</p>
          <Frame16 />
          <Frame17 />
        </div>
      </div>
      <div className="bg-[#1c1c1c] relative rounded-[16px] shrink-0 w-full" data-name="Feed Post">
        <div aria-hidden className="absolute border border-[#313135] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <div className="content-stretch flex flex-col gap-[14px] items-start p-[20px] relative size-full">
          <Frame18 />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#f7f7f8] text-[14px] w-[min-content]">Finalmente resolvi o bug de race condition no meu projeto de filas! O segredo era um lock otimista:</p>
          <Frame22 />
          <Frame23 />
        </div>
      </div>
      <div className="bg-[#1c1c1c] relative rounded-[16px] shrink-0 w-full" data-name="Feed Post">
        <div aria-hidden className="absolute border border-[#313135] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <div className="content-stretch flex flex-col gap-[14px] items-start p-[20px] relative size-full">
          <Frame24 />
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#f7f7f8] text-[14px] w-[min-content]">Finalmente resolvi o bug de race condition no meu projeto de filas! O segredo era um lock otimista:</p>
          <Frame28 />
          <Frame29 />
        </div>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-[#c7d300] content-stretch flex items-center justify-center overflow-clip relative rounded-[18px] shrink-0 size-[36px]" data-name="Frame">
      <p className="[word-break:break-word] font-['Space_Grotesk:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">RC</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#f7f7f8] text-[13px]">Rafael Costa</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#c4c4c9] text-[12px]">DevOps</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0" data-name="Frame">
      <Frame33 />
      <Frame34 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-[340px]" data-name="Frame">
      <Frame32 />
      <div className="relative rounded-[8px] shrink-0" data-name="Button">
        <div aria-hidden className="absolute border-[#494950] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[22.4px] py-[12.8px] relative size-full">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f7f7f8] text-[12.8px] whitespace-nowrap">Seguir</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="bg-[#c7d300] content-stretch flex items-center justify-center overflow-clip relative rounded-[18px] shrink-0 size-[36px]" data-name="Frame">
      <p className="[word-break:break-word] font-['Space_Grotesk:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">BS</p>
    </div>
  );
}

function Frame38() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#f7f7f8] text-[13px]">Beatriz Souza</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#c4c4c9] text-[12px]">Mobile Dev</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0" data-name="Frame">
      <Frame37 />
      <Frame38 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-[340px]" data-name="Frame">
      <Frame36 />
      <div className="relative rounded-[8px] shrink-0" data-name="Button">
        <div aria-hidden className="absolute border-[#494950] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[22.4px] py-[12.8px] relative size-full">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f7f7f8] text-[12.8px] whitespace-nowrap">Seguir</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-[340px]" data-name="Frame">
      <p className="[word-break:break-word] font-['Space_Grotesk:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#f7f7f8] text-[16px] whitespace-nowrap">Vagas em destaque</p>
      <JobCard className="bg-[#1c1c1c] relative rounded-[16px] shrink-0 w-[340px]" />
      <p className="[word-break:break-word] font-['Space_Grotesk:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#f7f7f8] text-[16px] whitespace-nowrap">Devs para seguir</p>
      <Frame31 />
      <Frame35 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[24px] items-start overflow-clip p-[32px] relative shrink-0 w-[1440px]" data-name="Frame">
      <Frame1 />
      <Frame6 />
      <Frame30 />
    </div>
  );
}

export default function ScreenFeedHome() {
  return (
    <div className="bg-[#0f0f10] content-stretch flex items-start relative size-full" data-name="Screen / Feed (Home)">
      <div className="bg-[#1c1c1c] relative self-stretch shrink-0 w-[240px]" data-name="Sidebar">
        <div aria-hidden className="absolute border-[#313135] border-r border-solid inset-0 pointer-events-none" />
        <div className="content-stretch flex flex-col gap-[8px] items-start py-[20px] relative size-full">
          <LogoRow />
          <SearchWrap />
          <NavList />
          <PublicarWrap />
          <Spacer />
          <UserRow />
        </div>
      </div>
      <Frame />
    </div>
  );
}
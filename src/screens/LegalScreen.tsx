import { Link } from "react-router-dom";

type Section = { title: string; paragraphs?: string[]; items?: string[] };

const terms: Section[] = [
  {
    title: "1. Aceitação",
    paragraphs: [
      "Ao criar uma conta ou usar a CODE.HUB, você concorda com estes Termos e com a Política de Privacidade. Se não concordar, não utilize a plataforma.",
    ],
  },
  {
    title: "2. A plataforma",
    paragraphs: [
      "A CODE.HUB é uma comunidade para profissionais de tecnologia publicarem projetos, trocarem feedback, criarem conexões e enviarem mensagens. Recursos podem ser alterados, suspensos ou descontinuados para evolução, segurança ou manutenção do serviço.",
    ],
  },
  {
    title: "3. Conta e segurança",
    items: [
      "Forneça informações verdadeiras e mantenha seus dados atualizados.",
      "Mantenha sua senha em sigilo e avise pelo canal de suporte se suspeitar de acesso indevido.",
      "Você responde pelas atividades realizadas em sua conta, salvo quando decorrentes de falha da plataforma.",
      "A plataforma é destinada a pessoas com capacidade legal para aceitar estes Termos.",
    ],
  },
  {
    title: "4. Conteúdo e licença",
    paragraphs: [
      "Você mantém a titularidade do conteúdo que publica. Ao publicá-lo, concede à CODE.HUB uma licença não exclusiva, gratuita e limitada ao funcionamento, divulgação interna e melhoria da plataforma. A licença termina quando o conteúdo é excluído, exceto por cópias necessárias para segurança, cumprimento legal ou conteúdo já compartilhado por terceiros.",
    ],
    items: [
      "Publique apenas conteúdo que você criou ou tem autorização para usar.",
      "Não divulgue dados pessoais, segredos comerciais ou informações confidenciais de terceiros sem autorização.",
    ],
  },
  {
    title: "5. Condutas proibidas",
    items: [
      "Praticar assédio, discriminação, fraude, ameaça ou atividade ilegal.",
      "Publicar malware, spam, conteúdo que viole direitos autorais ou tente comprometer a segurança do serviço.",
      "Acessar contas ou dados de terceiros sem autorização, automatizar acessos abusivos ou contornar limitações técnicas.",
      "Fingir ser outra pessoa ou manipular interações e métricas.",
    ],
  },
  {
    title: "6. Moderação",
    paragraphs: [
      "Podemos limitar a distribuição, remover conteúdo, restringir ou encerrar contas quando houver violação destes Termos, risco a pessoas ou à plataforma, ou obrigação legal. Sempre que razoável, informaremos a razão e permitiremos contestação pelo canal de suporte.",
    ],
  },
  {
    title: "7. Disponibilidade e responsabilidade",
    paragraphs: [
      "Buscamos manter o serviço seguro e disponível, mas não garantimos operação ininterrupta ou livre de erros. Na extensão permitida pela legislação, a CODE.HUB não responde por decisões profissionais tomadas com base em conteúdo de usuários, relações entre usuários ou serviços externos acessados por links.",
    ],
  },
  {
    title: "8. Encerramento",
    paragraphs: [
      "Você pode deixar de usar o serviço e solicitar a exclusão da conta. Obrigações que, por sua natureza, devam sobreviver ao encerramento — como direitos autorais, responsabilidades e cumprimento legal — permanecem aplicáveis.",
    ],
  },
  {
    title: "9. Alterações e legislação",
    paragraphs: [
      "Podemos atualizar estes Termos e comunicaremos mudanças relevantes pela plataforma. Estes Termos são regidos pelas leis brasileiras, preservados os direitos do consumidor e o foro legalmente competente.",
    ],
  },
  {
    title: "10. Contato",
    paragraphs: [
      "Dúvidas, denúncias ou solicitações relacionadas a estes Termos podem ser enviadas pelo canal de suporte disponibilizado na CODE.HUB.",
    ],
  },
];

const privacy: Section[] = [
  {
    title: "1. Quem trata os dados",
    paragraphs: [
      "A CODE.HUB atua como controladora dos dados pessoais tratados para oferecer a plataforma. Esta Política explica quais dados são usados, para quais finalidades e quais escolhas você possui.",
    ],
  },
  {
    title: "2. Dados coletados",
    items: [
      "Cadastro e conta: nome, email, identificador da conta e datas de criação e acesso.",
      "Perfil e conteúdo: username, apresentação, bio, localização, site, skills, publicações, imagens, comentários e reações.",
      "Relacionamentos: conexões, participantes de conversas, mensagens, confirmações de leitura e notificações.",
      "Dados técnicos e de segurança: endereço IP, dispositivo, navegador, registros de acesso, falhas e eventos necessários à prevenção de abuso.",
      "Comunicações enviadas ao suporte e preferências informadas por você.",
    ],
  },
  {
    title: "3. Finalidades e bases legais",
    items: [
      "Executar o contrato: criar sua conta, autenticar acessos, publicar conteúdo, entregar mensagens e operar as funcionalidades solicitadas.",
      "Legítimo interesse: proteger contas, prevenir fraude e abuso, diagnosticar falhas e melhorar a experiência, com avaliação dos direitos dos titulares.",
      "Cumprir obrigação legal ou regulatória e exercer direitos em processos.",
      "Consentimento, quando exigido, para finalidades opcionais; ele poderá ser revogado.",
    ],
  },
  {
    title: "4. Visibilidade",
    paragraphs: [
      "Dados de perfil, publicações e interações sociais ficam visíveis aos usuários autenticados conforme a proposta da comunidade. Mensagens e notificações são acessíveis somente aos participantes ou destinatários autorizados. Evite publicar informações sensíveis ou confidenciais em áreas públicas.",
    ],
  },
  {
    title: "5. Compartilhamento e operadores",
    paragraphs: [
      "Usamos fornecedores de infraestrutura para operar o serviço, incluindo o Appwrite para autenticação, banco de dados e armazenamento. Esses fornecedores tratam dados conforme nossas instruções e seus compromissos de segurança. Também poderemos compartilhar dados quando exigido por lei, para proteger direitos ou em operação societária com garantias adequadas.",
    ],
    items: [
      "Não vendemos dados pessoais.",
      "Não compartilhamos o conteúdo de mensagens com anunciantes.",
    ],
  },
  {
    title: "6. Transferência internacional",
    paragraphs: [
      "A infraestrutura e os fornecedores podem tratar dados fora do Brasil. Quando isso ocorrer, adotaremos mecanismos permitidos pela LGPD e medidas apropriadas de proteção.",
    ],
  },
  {
    title: "7. Retenção e exclusão",
    paragraphs: [
      "Mantemos os dados enquanto a conta estiver ativa e pelo tempo necessário às finalidades descritas. Após uma solicitação de exclusão, dados serão apagados ou anonimizados, salvo quando a conservação for necessária para cumprimento legal, prevenção de fraude, segurança ou exercício de direitos. Prazos de backup podem impedir a remoção imediata de cópias residuais.",
    ],
  },
  {
    title: "8. Seus direitos",
    items: [
      "Confirmar o tratamento e acessar seus dados.",
      "Corrigir dados incompletos, inexatos ou desatualizados.",
      "Solicitar anonimização, bloqueio ou eliminação quando aplicável.",
      "Solicitar portabilidade e informações sobre compartilhamentos, observada a regulamentação.",
      "Revogar consentimento e se opor a tratamentos nas hipóteses legais.",
      "Pedir revisão de decisões exclusivamente automatizadas, caso sejam adotadas.",
      "Apresentar petição à Autoridade Nacional de Proteção de Dados e aos órgãos de defesa do consumidor.",
    ],
  },
  {
    title: "9. Segurança",
    paragraphs: [
      "Adotamos controles de acesso, permissões por registro, criptografia e outras medidas técnicas e administrativas adequadas ao risco. Nenhum sistema é absolutamente seguro; investigaremos incidentes e realizaremos as comunicações exigidas pela legislação.",
    ],
  },
  {
    title: "10. Cookies e sessão",
    paragraphs: [
      "Utilizamos mecanismos estritamente necessários para autenticação, manutenção da sessão, segurança e funcionamento da aplicação. Se ferramentas opcionais de análise ou publicidade forem adicionadas, esta Política e os controles de escolha serão atualizados antes do uso.",
    ],
  },
  {
    title: "11. Contato e alterações",
    paragraphs: [
      "Para exercer direitos ou esclarecer dúvidas, utilize o canal de suporte disponibilizado na CODE.HUB. Poderemos solicitar informações para confirmar sua identidade e proteger sua conta. Alterações relevantes nesta Política serão comunicadas pela plataforma.",
    ],
  },
];

export default function LegalScreen({ kind }: { kind: "terms" | "privacy" }) {
  const isTerms = kind === "terms";
  return (
    <main className="min-h-full w-full overflow-y-auto bg-[#0f0f10] px-5 py-10 text-[#c4c4c9] sm:px-8">
      <article className="mx-auto max-w-[760px]">
        <Link to="/cadastro" className="text-sm font-medium text-[#9a9ad0] hover:underline">
          ← Voltar ao cadastro
        </Link>
        <header className="mt-8 border-b border-[#313135] pb-7">
          <img src="/LOGO%20ESCRITA%20BRANCA.svg" alt="CODE.HUB" className="mb-7 w-[210px]" />
          <h1 className="font-['Space_Grotesk:Bold',sans-serif] text-3xl font-bold text-[#f7f7f8] sm:text-4xl">
            {isTerms ? "Termos de Uso" : "Política de Privacidade"}
          </h1>
          <p className="mt-3 text-sm text-[#7f7f8a]">Última atualização: 3 de setembro de 2026</p>
        </header>
        <div className="flex flex-col gap-8 py-8">
          {(isTerms ? terms : privacy).map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 font-['Space_Grotesk:Bold',sans-serif] text-xl font-bold text-[#f7f7f8]">
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mb-3 text-[15px] leading-7">
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="list-disc space-y-2 pl-6 text-[15px] leading-7">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
        <footer className="border-t border-[#313135] py-7 text-sm text-[#7f7f8a]">
          CODE.HUB ·{" "}
          {isTerms ? (
            <Link to="/privacidade" className="text-[#9a9ad0] hover:underline">
              Política de Privacidade
            </Link>
          ) : (
            <Link to="/termos" className="text-[#9a9ad0] hover:underline">
              Termos de Uso
            </Link>
          )}
        </footer>
      </article>
    </main>
  );
}

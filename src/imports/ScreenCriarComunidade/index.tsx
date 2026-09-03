import { useState } from "react";
import { useNav } from "@/lib/nav";
import {
  PageShell,
  PageHeader,
  Card,
  Field,
  TextInput,
  TextArea,
  ChipRow,
  PrimaryButton,
  GhostButton,
} from "@/imports/_shared/ui";

const TOPICS = ["Frontend", "Backend", "UI/UX Design", "Open Source", "Dados", "Carreira"];
const PRIVACY = ["Público", "Privado"];

export default function ScreenCriarComunidade() {
  const { navigate } = useNav();
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [privacy, setPrivacy] = useState(PRIVACY[0]);

  return (
    <PageShell active="comunidade" maxWidth={640}>
      <PageHeader title="Criar comunidade" subtitle="Reúna pessoas em torno de um tema e organize discussões e eventos." />

      <Card>
        <Field label="Nome do grupo">
          <TextInput
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Ex: Design Systems Brasil"
          />
        </Field>

        <Field label="Descrição">
          <TextArea placeholder="Explique o propósito do grupo e quem deveria participar." />
        </Field>

        <Field label="Tópico principal">
          <ChipRow options={TOPICS} value={topic} onChange={(v) => setTopic(v === topic ? "" : v)} />
        </Field>

        <Field label="Privacidade" hint={privacy === "Privado" ? "Novos membros precisam ser aprovados." : "Qualquer pessoa pode entrar."}>
          <ChipRow options={PRIVACY} value={privacy} onChange={setPrivacy} />
        </Field>

        <div className="flex items-center justify-end gap-[10px] pt-[2px]">
          <GhostButton type="button" onClick={() => navigate("comunidade")}>
            Cancelar
          </GhostButton>
          <PrimaryButton type="button" disabled={!name.trim()}>
            Criar comunidade
          </PrimaryButton>
        </div>
      </Card>
    </PageShell>
  );
}

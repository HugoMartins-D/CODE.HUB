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

const FORMATS = ["Presencial", "Online", "Híbrido"];
const CATEGORIES = ["Frontend", "Backend", "UI/UX Design", "Open Source", "Carreira", "Outro"];

export default function ScreenCriarEvento() {
  const { navigate } = useNav();
  const [format, setFormat] = useState(FORMATS[0]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");

  return (
    <PageShell active="comunidade" maxWidth={720}>
      <PageHeader title="Criar evento" subtitle="Organize um encontro, meetup ou workshop para a comunidade." />

      <Card>
        <Field label="Título do evento">
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            placeholder="Ex: Meetup Frontend SP: performance na prática"
          />
        </Field>

        <Field label="Descrição">
          <TextArea placeholder="Conte o que vai acontecer, para quem é e o que a pessoa precisa levar." />
        </Field>

        <div className="grid gap-[18px] sm:grid-cols-2">
          <Field label="Data">
            <TextInput type="date" />
          </Field>
          <Field label="Horário">
            <TextInput type="time" />
          </Field>
        </div>

        <Field label="Formato">
          <ChipRow options={FORMATS} value={format} onChange={setFormat} />
        </Field>

        <Field label="Local ou link de acesso">
          <TextInput placeholder="Ex: Rua Augusta, 1200 — São Paulo, SP" />
        </Field>

        <div className="grid gap-[18px] sm:grid-cols-2">
          <Field label="Categoria">
            <ChipRow options={CATEGORIES} value={category} onChange={(v) => setCategory(v === category ? "" : v)} />
          </Field>
          <Field label="Capacidade de vagas" hint="Deixe em branco para vagas ilimitadas.">
            <TextInput type="number" min={1} placeholder="Ex: 60" />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-[10px] pt-[2px]">
          <GhostButton type="button" onClick={() => navigate("comunidade")}>
            Cancelar
          </GhostButton>
          <PrimaryButton type="button" disabled={!title.trim()}>
            Publicar evento
          </PrimaryButton>
        </div>
      </Card>
    </PageShell>
  );
}

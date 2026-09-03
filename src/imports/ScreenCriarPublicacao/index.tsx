import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, initialsOf } from "@/lib/profile";
import { createPost, MAX_IMAGE_BYTES, MAX_POST_CHARS, MAX_POST_IMAGES } from "@/lib/posts";
import { PageShell, PageHeader } from "@/imports/_shared/ui";

type Preview = { id: string; file: File; url: string };

export default function ScreenCriarPublicacao() {
  const navigate = useNavigate();
  const profile = getProfile();
  const [text, setText] = useState("");
  const [images, setImages] = useState<Preview[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => () => imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url)), []);
  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = Math.max(element.scrollHeight, 80) + "px";
  }, [text]);

  const addImages = (files: FileList | null) => {
    if (!files) return;
    setError("");
    const candidates = Array.from(files);
    if (candidates.some((file) => !file.type.startsWith("image/"))) return setError("Envie apenas arquivos de imagem.");
    if (candidates.some((file) => file.size > MAX_IMAGE_BYTES)) return setError("Cada imagem pode ter no máximo 5 MB.");
    setImages((current) => [
      ...current,
      ...candidates.slice(0, MAX_POST_IMAGES - current.length).map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const image = current.find((item) => item.id === id);
      if (image) URL.revokeObjectURL(image.url);
      return current.filter((item) => item.id !== id);
    });
  };

  const publish = async () => {
    setSubmitting(true);
    setError("");
    try {
      const post = await createPost({ text, images: images.map((image) => image.file) });
      images.forEach((image) => URL.revokeObjectURL(image.url));
      navigate("/publicacao/" + post.id, { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível publicar.");
      setSubmitting(false);
    }
  };

  const canPublish = (text.trim().length > 0 || images.length > 0) && text.length <= MAX_POST_CHARS && !submitting;
  return (
    <PageShell active="criar-publicacao" maxWidth={640}>
      <PageHeader title="Criar publicação" subtitle="Mostre à comunidade o que você está construindo." />
      <div className="rounded-[18px] border border-[#313135] bg-[#141416] p-[16px] sm:p-[20px]">
        <div className="flex gap-[12px]">
          <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[#474797] text-white">{initialsOf(profile.name)}</span>
          <div className="min-w-0 flex-1">
            <textarea ref={textareaRef} value={text} onChange={(event) => setText(event.currentTarget.value)} placeholder="O que está acontecendo?" className="w-full resize-none overflow-hidden bg-transparent pt-[9px] text-[18px] leading-[1.5] text-[#f7f7f8] placeholder:text-[#7f7f8a] outline-none" />
            {images.length ? <div className={"mt-[14px] grid gap-[8px] " + (images.length === 1 ? "grid-cols-1" : "grid-cols-2")}>{images.map((image, index) => <div key={image.id} className="relative"><img src={image.url} alt={"Prévia da imagem " + (index + 1)} className="max-h-[320px] h-full w-full rounded-[14px] object-cover" /><button type="button" aria-label="Remover imagem" onClick={() => removeImage(image.id)} className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1 text-white">×</button></div>)}</div> : null}
            {error ? <p role="alert" className="mt-[12px] text-[13px] text-[#e0716e]">{error}</p> : null}
            <div className="mt-[14px] flex flex-wrap items-center justify-between gap-[12px] border-t border-[#26262a] pt-[12px]">
              <div>
                <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(event) => { addImages(event.currentTarget.files); event.currentTarget.value = ""; }} />
                <button type="button" disabled={images.length >= MAX_POST_IMAGES} onClick={() => inputRef.current?.click()} className="rounded-[10px] px-[12px] py-[8px] text-[14px] text-[#9a9ad0] hover:bg-[#1b1b3c] disabled:opacity-40">Adicionar imagens</button>
                <span className="ml-2 text-[12px] text-[#7f7f8a]">{images.length}/{MAX_POST_IMAGES}</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <span className={"text-[12px] " + (text.length > MAX_POST_CHARS ? "text-[#e0716e]" : "text-[#7f7f8a]")}>{text.length}/{MAX_POST_CHARS}</span>
                <button type="button" disabled={!canPublish} onClick={() => void publish()} className="rounded-full bg-[#474797] px-[22px] py-[9px] font-semibold text-white disabled:bg-[#2c2c4a] disabled:text-[#8a8a9e]">{submitting ? "Publicando…" : "Publicar"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

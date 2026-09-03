import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/imports/_shared/Sidebar";
import { getSession, type SessionUser } from "@/lib/auth";
import { initialsOf } from "@/lib/profile";
import {
  availableContacts,
  getMessages,
  listConversations,
  markConversationRead,
  sendMessage,
  startConversation,
  type ConversationSummary,
  type Message,
} from "@/lib/messages";

export default function ScreenMensagens() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [contacts, setContacts] = useState<SessionUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const refreshConversations = useCallback(async () => {
    try {
      setConversations(await listConversations());
      setContacts(await availableContacts());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível carregar as conversas.");
    }
  }, []);

  useEffect(() => { void refreshConversations(); }, [refreshConversations]);
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setError("");
    void getMessages(conversationId)
      .then((items) => {
        setMessages(items);
        return markConversationRead(conversationId);
      })
      .then(refreshConversations)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Não foi possível abrir a conversa."));
  }, [conversationId, refreshConversations]);

  const openContact = async (personId: string) => {
    const conversation = await startConversation(personId);
    await refreshConversations();
    navigate("/mensagens/" + conversation.id);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!conversationId || !draft.trim()) return;
    setSending(true);
    setError("");
    try {
      const message = await sendMessage(conversationId, draft);
      setMessages((current) => [...current, message]);
      setDraft("");
      await refreshConversations();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível enviar a mensagem.");
    } finally {
      setSending(false);
    }
  };

  const selected = conversations.find((conversation) => conversation.id === conversationId);
  const visibleConversations = conversations.filter((conversation) => conversation.otherPerson.name.toLowerCase().includes(query.toLowerCase()));
  const contactsWithoutConversation = contacts.filter((contact) => !conversations.some((conversation) => conversation.participantIds.includes(contact.id)));

  return (
    <div className="flex size-full bg-[#0f0f10]">
      <Sidebar active="mensagens" />
      <aside className={(conversationId ? "hidden lg:flex " : "flex ") + "w-full lg:w-[360px] shrink-0 flex-col border-r border-[#313135] bg-[#171719]"}>
        <div className="border-b border-[#313135] p-[20px]">
          <h1 className="font-['Space_Grotesk:Bold',sans-serif] text-[22px] font-bold text-[#f7f7f8]">Mensagens</h1>
          <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Buscar conversas..." className="mt-[14px] w-full rounded-[9px] border border-[#494950] bg-[#1c1c1c] px-[14px] py-[10px] text-[14px] text-[#f7f7f8] outline-none focus:border-[#474797]" />
        </div>
        <div className="flex-1 overflow-y-auto p-[10px]">
          {visibleConversations.map((conversation) => (
            <button key={conversation.id} type="button" onClick={() => navigate("/mensagens/" + conversation.id)} className={"mb-1 flex w-full items-center gap-3 rounded-[10px] p-3 text-left " + (conversation.id === conversationId ? "bg-[#313135]" : "hover:bg-[#26262a]")}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#474797] text-sm text-white">{initialsOf(conversation.otherPerson.name)}</span>
              <span className="min-w-0 flex-1"><strong className="block truncate text-sm text-[#f7f7f8]">{conversation.otherPerson.name}</strong><span className="block truncate text-xs text-[#7f7f8a]">{conversation.lastMessage?.text ?? "Conversa iniciada"}</span></span>
              {conversation.unreadCount ? <span className="flex size-5 items-center justify-center rounded-full bg-[#e93e8f] text-[10px] text-white">{conversation.unreadCount}</span> : null}
            </button>
          ))}
          {contactsWithoutConversation.length ? <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-[#7f7f8a]">Iniciar conversa</p> : null}
          {contactsWithoutConversation.map((contact) => <button key={contact.id} type="button" onClick={() => void openContact(contact.id)} className="flex w-full items-center gap-3 rounded-[10px] p-3 text-left hover:bg-[#26262a]"><span className="flex size-10 items-center justify-center rounded-full bg-[#313135] text-sm text-white">{initialsOf(contact.name)}</span><span className="text-sm text-[#c4c4c9]">{contact.name}</span></button>)}
          {!conversations.length && !contacts.length ? <div className="px-5 py-12 text-center"><p className="text-sm font-semibold text-[#c4c4c9]">Nenhuma outra pessoa cadastrada</p><p className="mt-2 text-xs leading-5 text-[#7f7f8a]">Quando outras pessoas entrarem na CODE.HUB, elas aparecerão aqui.</p></div> : null}
        </div>
      </aside>

      <main className={(conversationId ? "flex " : "hidden lg:flex ") + "min-w-0 flex-1 flex-col"}>
        {selected ? (
          <>
            <header className="flex h-[72px] items-center gap-3 border-b border-[#313135] px-4 lg:px-6">
              <button type="button" onClick={() => navigate("/mensagens")} className="lg:hidden text-[#c4c4c9]" aria-label="Voltar às conversas">←</button>
              <span className="flex size-10 items-center justify-center rounded-full bg-[#474797] text-sm text-white">{initialsOf(selected.otherPerson.name)}</span>
              <div><p className="font-semibold text-[#f7f7f8]">{selected.otherPerson.name}</p><p className="text-xs text-[#7f7f8a]">Conversa privada</p></div>
            </header>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 lg:p-6">
              {messages.length === 0 ? <p className="m-auto text-center text-sm text-[#7f7f8a]">Envie a primeira mensagem desta conversa.</p> : null}
              {messages.map((message) => {
                const own = message.senderId === session?.id;
                return <div key={message.id} className={"flex " + (own ? "justify-end" : "justify-start")}><div className={(own ? "bg-[#474797] text-white" : "bg-[#1c1c1c] text-[#e4e4e7]") + " max-w-[78%] rounded-[14px] px-4 py-2.5"}><p className="whitespace-pre-wrap text-sm leading-5">{message.text}</p><time className={"mt-1 block text-[10px] " + (own ? "text-white/60" : "text-[#7f7f8a]")}>{new Date(message.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</time></div></div>;
              })}
            </div>
            {error ? <p role="alert" className="px-5 pb-2 text-sm text-[#e0716e]">{error}</p> : null}
            <form onSubmit={submit} className="flex gap-3 border-t border-[#313135] p-3 lg:p-4">
              <input value={draft} onChange={(event) => setDraft(event.currentTarget.value)} maxLength={2000} placeholder="Digite uma mensagem..." className="min-w-0 flex-1 rounded-[10px] border border-[#494950] bg-[#1c1c1c] px-4 py-3 text-sm text-[#f7f7f8] outline-none focus:border-[#474797]" />
              <button type="submit" disabled={!draft.trim() || sending} className="rounded-[10px] bg-[#474797] px-5 text-sm font-semibold text-white disabled:bg-[#2c2c4a] disabled:text-[#8a8a9e]">{sending ? "Enviando…" : "Enviar"}</button>
            </form>
          </>
        ) : <div className="m-auto text-center"><p className="font-semibold text-[#c4c4c9]">Suas mensagens diretas</p><p className="mt-2 text-sm text-[#7f7f8a]">Selecione ou inicie uma conversa.</p></div>}
      </main>
    </div>
  );
}

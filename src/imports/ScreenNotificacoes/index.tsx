import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, PageHeader } from "@/imports/_shared/ui";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
} from "@/lib/notifications";
import { initialsOf } from "@/lib/profile";

type Filter = "Todas" | "Não lidas";

function relativeDate(value: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "agora";
  if (seconds < 3600) return "há " + Math.floor(seconds / 60) + " min";
  if (seconds < 86400) return "há " + Math.floor(seconds / 3600) + " h";
  if (seconds < 604800) return "há " + Math.floor(seconds / 86400) + " d";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
}

export default function ScreenNotificacoes() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("Todas");
  const [notifications, setNotifications] = useState<Notification[]>();
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setError("");
    void listNotifications()
      .then(setNotifications)
      .catch(() => setError("Não foi possível carregar as notificações."));
  }, []);

  useEffect(load, [load]);

  const open = async (notification: Notification) => {
    await markNotificationRead(notification.id);
    navigate(notification.href);
  };

  const markAll = async () => {
    await markAllNotificationsRead();
    setNotifications((current) => current?.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() })));
  };

  const visible = notifications?.filter((item) => filter === "Todas" || !item.readAt);
  const unreadCount = notifications?.filter((item) => !item.readAt).length ?? 0;

  return (
    <PageShell active="notificacoes" maxWidth={680}>
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Notificações" subtitle={unreadCount ? unreadCount + (unreadCount === 1 ? " notificação não lida" : " notificações não lidas") : "Você está em dia."} />
        {unreadCount ? <button type="button" onClick={() => void markAll()} className="shrink-0 pt-2 text-[13px] font-semibold text-[#9a9ad0] hover:underline">Marcar todas como lidas</button> : null}
      </div>

      <div className="flex gap-2">
        {(["Todas", "Não lidas"] as const).map((option) => (
          <button key={option} type="button" onClick={() => setFilter(option)} className={"rounded-full px-4 py-2 text-[13px] font-medium " + (filter === option ? "bg-[#474797] text-white" : "border border-[#494950] bg-[#1c1c1c] text-[#c4c4c9]")}>{option}</button>
        ))}
      </div>

      {error ? <div role="alert" className="flex items-center justify-between rounded-[12px] border border-[#5c2b2a] p-4 text-sm text-[#e0716e]"><span>{error}</span><button type="button" onClick={load} className="font-semibold underline">Tentar novamente</button></div> : null}
      {notifications === undefined && !error ? <p className="py-12 text-center text-sm text-[#7f7f8a]">Carregando notificações…</p> : null}
      <div className="flex flex-col gap-2">
        {visible?.map((notification) => (
          <button key={notification.id} type="button" onClick={() => void open(notification)} className={"flex w-full items-start gap-3 rounded-[14px] border p-4 text-left transition-colors hover:bg-[#1c1c1c] " + (notification.readAt ? "border-[#313135] bg-[#141416]" : "border-[#474797]/70 bg-[#1b1b2b]")}>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#474797] text-sm font-semibold text-white">{initialsOf(notification.actorName)}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2"><strong className="text-sm text-[#f7f7f8]">{notification.title}</strong>{!notification.readAt ? <span className="size-2 shrink-0 rounded-full bg-[#e93e8f]" aria-label="Não lida" /> : null}</span>
              <span className="mt-1 block truncate text-[13px] text-[#c4c4c9]">{notification.body}</span>
              <time dateTime={notification.createdAt} className="mt-1 block text-xs text-[#7f7f8a]">{relativeDate(notification.createdAt)}</time>
            </span>
          </button>
        ))}
      </div>
      {visible?.length === 0 ? <div className="rounded-[16px] border border-[#313135] px-6 py-14 text-center"><p className="text-sm font-semibold text-[#c4c4c9]">{filter === "Não lidas" ? "Nenhuma notificação não lida" : "Nenhuma notificação por enquanto"}</p><p className="mt-2 text-[13px] text-[#7f7f8a]">Novas mensagens e interações aparecerão aqui.</p></div> : null}
    </PageShell>
  );
}

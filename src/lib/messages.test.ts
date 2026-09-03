import { describe, expect, it } from "vitest";
import { login, logout, register } from "@/lib/auth";
import { getMessages, sendMessage, startConversation } from "@/lib/messages";
import { listNotifications, markNotificationRead } from "@/lib/notifications";

describe("mensagens e notificações", () => {
  it("entrega uma mensagem e notifica o destinatário", async () => {
    const ana = await register({ name: "Ana", email: "ana@example.com", password: "12345678" });
    logout();
    const bia = await register({ name: "Bia", email: "bia@example.com", password: "12345678" });
    const conversation = await startConversation(ana.id);
    await sendMessage(conversation.id, "Olá, Ana!");
    logout();
    await login({ email: ana.email, password: "12345678" });
    expect((await getMessages(conversation.id))[0].text).toBe("Olá, Ana!");
    const notifications = await listNotifications();
    expect(notifications[0]).toMatchObject({ actorId: bia.id, type: "message", readAt: null });
    await markNotificationRead(notifications[0].id);
    expect((await listNotifications())[0].readAt).not.toBeNull();
  });
});

import { ID, Permission, Query, Role } from "appwrite";
import { APPWRITE_DATABASE_ID, tables } from "@/lib/appwrite";
import { getSession, type SessionUser } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export type Conversation = {
  id: string;
  participantIds: string[];
  createdAt: string;
  updatedAt: string;
};
export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  readBy: string[];
};
export type ConversationSummary = Conversation & {
  otherPerson: SessionUser;
  lastMessage?: Message;
  unreadCount: number;
};
type ConversationRow = Omit<Conversation, "id"> & {
  $id: string;
  memberA: string;
  memberB: string;
  pairKey: string;
};
type MessageRow = Omit<Message, "id"> & { $id: string };
type ProfileRow = { userId: string; name: string; joinedAt: string };

export class MessageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MessageError";
  }
}
function requireSession() {
  const session = getSession();
  if (!session) throw new MessageError("Entre na sua conta para acessar as mensagens.");
  return session;
}
const fromConversation = (row: ConversationRow): Conversation => ({
  id: row.$id,
  participantIds: row.participantIds,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});
const fromMessage = (row: MessageRow): Message => ({ ...row, id: row.$id });
const personFromProfile = (row: ProfileRow): SessionUser => ({
  id: row.userId,
  name: row.name,
  email: "",
  createdAt: row.joinedAt,
});
function participantPermissions(ids: string[]): string[] {
  return ids.flatMap((id) => [
    Permission.read(Role.user(id)),
    Permission.update(Role.user(id)),
    Permission.delete(Role.user(id)),
  ]);
}

async function conversationRows(): Promise<ConversationRow[]> {
  const session = requireSession();
  const [asA, asB] = await Promise.all([
    tables.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "conversations",
      queries: [Query.equal("memberA", session.id), Query.limit(100)],
    }),
    tables.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "conversations",
      queries: [Query.equal("memberB", session.id), Query.limit(100)],
    }),
  ]);
  return [...asA.rows, ...asB.rows] as unknown as ConversationRow[];
}

export async function availableContacts(): Promise<SessionUser[]> {
  const session = requireSession();
  const result = await tables.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "profiles",
    queries: [Query.notEqual("userId", session.id), Query.orderAsc("name"), Query.limit(100)],
  });
  return (result.rows as unknown as ProfileRow[]).map(personFromProfile);
}

export async function startConversation(otherPersonId: string): Promise<Conversation> {
  const session = requireSession();
  if (session.id === otherPersonId) throw new MessageError("Escolha outra pessoa para conversar.");
  const pair = [session.id, otherPersonId].sort();
  const pairKey = pair.join(":");
  const existing = await tables.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "conversations",
    queries: [Query.equal("pairKey", pairKey), Query.limit(1)],
  });
  if (existing.rows[0]) return fromConversation(existing.rows[0] as unknown as ConversationRow);
  const now = new Date().toISOString();
  const row = await tables.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "conversations",
    rowId: ID.unique(),
    data: {
      participantIds: pair,
      memberA: pair[0],
      memberB: pair[1],
      pairKey,
      createdAt: now,
      updatedAt: now,
    },
    permissions: participantPermissions(pair),
  });
  return fromConversation(row as unknown as ConversationRow);
}

export async function listConversations(): Promise<ConversationSummary[]> {
  const session = requireSession();
  const rows = await conversationRows();
  const otherIds = rows
    .map((row) => row.participantIds.find((id) => id !== session.id)!)
    .filter(Boolean);
  const profiles = otherIds.length
    ? await tables.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "profiles",
        queries: [Query.equal("userId", otherIds), Query.limit(100)],
      })
    : { rows: [] };
  const people = new Map(
    (profiles.rows as unknown as ProfileRow[]).map((row) => [row.userId, personFromProfile(row)]),
  );
  const summaries = await Promise.all(
    rows.map(async (row) => {
      const result = await tables.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "messages",
        queries: [
          Query.equal("conversationId", row.$id),
          Query.orderDesc("createdAt"),
          Query.limit(100),
        ],
      });
      const messages = (result.rows as unknown as MessageRow[]).map(fromMessage);
      const otherId = row.participantIds.find((id) => id !== session.id)!;
      return {
        ...fromConversation(row),
        otherPerson: people.get(otherId) ?? {
          id: otherId,
          name: "Pessoa da comunidade",
          email: "",
          createdAt: row.createdAt,
        },
        lastMessage: messages[0],
        unreadCount: messages.filter(
          (message) => message.senderId !== session.id && !message.readBy.includes(session.id),
        ).length,
      };
    }),
  );
  return summaries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const session = requireSession();
  const conversation = (await tables.getRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "conversations",
    rowId: conversationId,
  })) as unknown as ConversationRow;
  if (!conversation.participantIds.includes(session.id))
    throw new MessageError("Conversa não encontrada.");
  const result = await tables.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "messages",
    queries: [
      Query.equal("conversationId", conversationId),
      Query.orderAsc("createdAt"),
      Query.limit(100),
    ],
  });
  return (result.rows as unknown as MessageRow[]).map(fromMessage);
}

export async function sendMessage(conversationId: string, value: string): Promise<Message> {
  const session = requireSession();
  const text = value.trim();
  if (!text) throw new MessageError("Digite uma mensagem.");
  if (text.length > 2000) throw new MessageError("A mensagem pode ter no máximo 2.000 caracteres.");
  const conversation = (await tables.getRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "conversations",
    rowId: conversationId,
  })) as unknown as ConversationRow;
  if (!conversation.participantIds.includes(session.id))
    throw new MessageError("Conversa não encontrada.");
  const now = new Date().toISOString();
  const row = await tables.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "messages",
    rowId: ID.unique(),
    data: { conversationId, senderId: session.id, text, createdAt: now, readBy: [session.id] },
    permissions: participantPermissions(conversation.participantIds),
  });
  await tables.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "conversations",
    rowId: conversationId,
    data: { updatedAt: now },
  });
  const recipientId = conversation.participantIds.find((id) => id !== session.id);
  if (recipientId)
    await createNotification({
      recipientId,
      actorId: session.id,
      actorName: session.name,
      type: "message",
      title: `${session.name} enviou uma mensagem`,
      body: text.length > 90 ? `${text.slice(0, 87)}…` : text,
      href: `/mensagens/${conversationId}`,
    });
  return fromMessage(row as unknown as MessageRow);
}

export async function markConversationRead(conversationId: string): Promise<void> {
  const session = requireSession();
  const messages = await getMessages(conversationId);
  await Promise.all(
    messages
      .filter((message) => !message.readBy.includes(session.id))
      .map((message) =>
        tables.updateRow({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: "messages",
          rowId: message.id,
          data: { readBy: [...message.readBy, session.id] },
        }),
      ),
  );
}

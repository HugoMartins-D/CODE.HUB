import { ID, Permission, Query, Role } from "appwrite";
import { APPWRITE_DATABASE_ID, tables } from "@/lib/appwrite";
import { getSession } from "@/lib/auth";

export type NotificationType = "message" | "reaction" | "comment" | "follow";
export type Notification = {
  id: string;
  recipientId: string;
  actorId: string;
  actorName: string;
  type: NotificationType;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  readAt: string | null;
};
type NotificationRow = Omit<Notification, "id"> & { $id: string };
const fromRow = (row: NotificationRow): Notification => ({ ...row, id: row.$id });

export async function createNotification(
  input: Omit<Notification, "id" | "createdAt" | "readAt">,
): Promise<Notification> {
  const row = await tables.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "notifications",
    rowId: ID.unique(),
    data: { ...input, createdAt: new Date().toISOString(), readAt: null },
    permissions: [
      Permission.read(Role.user(input.recipientId)),
      Permission.update(Role.user(input.recipientId)),
      Permission.delete(Role.user(input.recipientId)),
    ],
  });
  return fromRow(row as unknown as NotificationRow);
}

export async function listNotifications(): Promise<Notification[]> {
  const session = getSession();
  if (!session) return [];
  const result = await tables.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "notifications",
    queries: [
      Query.equal("recipientId", session.id),
      Query.orderDesc("createdAt"),
      Query.limit(100),
    ],
  });
  return (result.rows as unknown as NotificationRow[]).map(fromRow);
}

export async function markNotificationRead(id: string): Promise<void> {
  const session = getSession();
  if (!session) return;
  const notification = (await tables.getRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "notifications",
    rowId: id,
  })) as unknown as NotificationRow;
  if (notification.recipientId !== session.id || notification.readAt) return;
  await tables.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "notifications",
    rowId: id,
    data: { readAt: new Date().toISOString() },
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  const unread = (await listNotifications()).filter((item) => !item.readAt);
  await Promise.all(unread.map((item) => markNotificationRead(item.id)));
}

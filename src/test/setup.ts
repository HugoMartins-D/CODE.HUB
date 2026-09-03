import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

vi.mock("@/lib/appwrite", () => {
  type Row = Record<string, unknown> & { $id: string };
  const users = new Map<string, Record<string, unknown>>();
  const rows = new Map<string, Map<string, Row>>();
  let currentId: string | null = null;
  const table = (id: string) => {
    if (!rows.has(id)) rows.set(id, new Map());
    return rows.get(id)!;
  };
  const account = {
    create: vi.fn(async ({ userId, email, password, name }: Record<string, string>) => {
      const id = userId === "unique()" ? crypto.randomUUID() : userId;
      const user = { $id: id, email, password, name, $createdAt: new Date().toISOString() };
      users.set(id, user);
      return user;
    }),
    createEmailPasswordSession: vi.fn(async ({ email, password }: Record<string, string>) => {
      const found = [...users.values()].find(
        (user) => user.email === email && user.password === password,
      );
      if (!found) throw new Error("invalid credentials");
      currentId = found.$id as string;
      return { $id: crypto.randomUUID() };
    }),
    get: vi.fn(async () => {
      if (!currentId || !users.has(currentId)) throw new Error("no session");
      return users.get(currentId)!;
    }),
    deleteSession: vi.fn(async () => {
      currentId = null;
      return {};
    }),
    createOAuth2Session: vi.fn(() => undefined),
  };
  const tables = {
    createRow: vi.fn(
      async ({ tableId, rowId, data }: { tableId: string; rowId: string; data: Row }) => {
        const id = rowId === "unique()" ? crypto.randomUUID() : rowId;
        const row = { ...data, $id: id } as Row;
        table(tableId).set(id, row);
        return row;
      },
    ),
    getRow: vi.fn(async ({ tableId, rowId }: { tableId: string; rowId: string }) => {
      const row = table(tableId).get(rowId);
      if (!row) throw Object.assign(new Error("not found"), { code: 404 });
      return row;
    }),
    updateRow: vi.fn(
      async ({ tableId, rowId, data }: { tableId: string; rowId: string; data: Row }) => {
        const row = { ...table(tableId).get(rowId), ...data, $id: rowId } as Row;
        table(tableId).set(rowId, row);
        return row;
      },
    ),
    deleteRow: vi.fn(async ({ tableId, rowId }: { tableId: string; rowId: string }) => {
      table(tableId).delete(rowId);
      return {};
    }),
    listRows: vi.fn(async ({ tableId, queries = [] }: { tableId: string; queries?: string[] }) => {
      let result = [...table(tableId).values()];
      let offset = 0;
      let limit = 25;
      for (const encoded of queries) {
        const query = JSON.parse(encoded) as {
          method: string;
          attribute?: string;
          values?: unknown[];
        };
        if (query.method === "equal" && query.attribute) {
          const values = (query.values ?? []).flat();
          result = result.filter((row) => values.includes(row[query.attribute!]));
        }
        if (query.method === "offset") offset = Number(query.values?.[0] ?? 0);
        if (query.method === "limit") limit = Number(query.values?.[0] ?? 25);
        if (query.method === "orderDesc" && query.attribute) {
          result.sort((a, b) =>
            String(b[query.attribute!]).localeCompare(String(a[query.attribute!])),
          );
        }
      }
      const total = result.length;
      return { rows: result.slice(offset, offset + limit), total };
    }),
  };
  const storage = {
    createFile: vi.fn(async () => ({ $id: crypto.randomUUID() })),
    deleteFile: vi.fn(async () => ({})),
    getFileView: vi.fn(({ fileId }: { fileId: string }) => `https://files.test/${fileId}`),
  };
  return {
    account,
    tables,
    storage,
    APPWRITE_DATABASE_ID: "codehub",
    APPWRITE_POST_MEDIA_BUCKET_ID: "post-media",
  };
});

afterEach(async () => {
  cleanup();
  const [{ resetAuthStore }, { resetProfile }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/profile"),
  ]);
  resetAuthStore();
  resetProfile();
  localStorage.clear();
  await new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase("codehub");
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
    request.onblocked = () => resolve();
  });
});

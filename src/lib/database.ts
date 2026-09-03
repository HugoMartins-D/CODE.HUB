const DATABASE_NAME = "codehub";
const DATABASE_VERSION = 3;

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("posts")) {
        const posts = db.createObjectStore("posts", { keyPath: "id" });
        posts.createIndex("createdAt", "createdAt");
        posts.createIndex("authorId", "authorId");
      }
      if (!db.objectStoreNames.contains("conversations")) {
        const conversations = db.createObjectStore("conversations", { keyPath: "id" });
        conversations.createIndex("participantIds", "participantIds", { multiEntry: true });
        conversations.createIndex("updatedAt", "updatedAt");
      }
      if (!db.objectStoreNames.contains("messages")) {
        const messages = db.createObjectStore("messages", { keyPath: "id" });
        messages.createIndex("conversationId", "conversationId");
        messages.createIndex("createdAt", "createdAt");
      }
      if (!db.objectStoreNames.contains("notifications")) {
        const notifications = db.createObjectStore("notifications", { keyPath: "id" });
        notifications.createIndex("recipientId", "recipientId");
        notifications.createIndex("createdAt", "createdAt");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Não foi possível abrir o armazenamento."));
  });
}

export async function storeRequest<T>(
  storeName: "posts" | "conversations" | "messages" | "notifications",
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const request = operation(transaction.objectStore(storeName));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Falha ao acessar o armazenamento."));
    transaction.oncomplete = () => db.close();
    transaction.onabort = () => db.close();
  });
}

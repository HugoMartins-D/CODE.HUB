import { AppwriteException, ID, Permission, Query, Role } from "appwrite";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_POST_MEDIA_BUCKET_ID,
  storage,
  tables,
} from "@/lib/appwrite";
import { getSession } from "@/lib/auth";

export const MAX_POST_CHARS = 500;
export const MAX_POST_IMAGES = 4;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type PostMedia = { id: string; name: string; type: string; url: string };
export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorHeadline: string;
  text: string;
  media: PostMedia[];
  createdAt: string;
};

type PostRow = {
  $id: string;
  authorId: string;
  text?: string;
  mediaFileIds?: string[];
  createdAt: string;
};
type AuthorRow = { userId: string; name: string; headline?: string };

export class PostError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PostError";
  }
}

function ownerPermissions(userId: string): string[] {
  return [Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))];
}

function mediaFromIds(ids: string[] = []): PostMedia[] {
  return ids.map((id) => ({
    id,
    name: id,
    type: "image/*",
    url: storage.getFileView({ bucketId: APPWRITE_POST_MEDIA_BUCKET_ID, fileId: id }),
  }));
}

async function hydrate(rows: PostRow[]): Promise<Post[]> {
  const ids = [...new Set(rows.map((row) => row.authorId))];
  const response = ids.length
    ? await tables.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "profiles",
        queries: [Query.equal("userId", ids), Query.limit(Math.min(ids.length, 100))],
      })
    : { rows: [] };
  const authors = new Map(
    response.rows.map((row) => {
      const author = row as unknown as AuthorRow;
      return [author.userId, author];
    }),
  );
  return rows.map((row) => {
    const author = authors.get(row.authorId);
    const active = getSession();
    return {
      id: row.$id,
      authorId: row.authorId,
      authorName:
        author?.name ?? (active?.id === row.authorId ? active.name : "Pessoa da comunidade"),
      authorHeadline: author?.headline ?? "",
      text: row.text ?? "",
      media: mediaFromIds(row.mediaFileIds),
      createdAt: row.createdAt,
    };
  });
}

export async function createPost(input: { text: string; images: File[] }): Promise<Post> {
  const session = getSession();
  if (!session) throw new PostError("Entre na sua conta para publicar.");
  const text = input.text.trim();
  if (!text && input.images.length === 0)
    throw new PostError("Escreva algo ou adicione uma imagem.");
  if (text.length > MAX_POST_CHARS)
    throw new PostError(`Use no máximo ${MAX_POST_CHARS} caracteres.`);
  if (input.images.length > MAX_POST_IMAGES)
    throw new PostError(`Adicione no máximo ${MAX_POST_IMAGES} imagens.`);
  if (input.images.some((image) => !image.type.startsWith("image/")))
    throw new PostError("Envie apenas arquivos de imagem.");
  if (input.images.some((image) => image.size > MAX_IMAGE_BYTES))
    throw new PostError("Cada imagem pode ter no máximo 5 MB.");

  const uploaded: string[] = [];
  try {
    for (const image of input.images) {
      const file = await storage.createFile({
        bucketId: APPWRITE_POST_MEDIA_BUCKET_ID,
        fileId: ID.unique(),
        file: image,
        permissions: ownerPermissions(session.id),
      });
      uploaded.push(file.$id);
    }
    const now = new Date().toISOString();
    const row = await tables.createRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "posts",
      rowId: ID.unique(),
      data: { authorId: session.id, text: text || null, mediaFileIds: uploaded, createdAt: now },
      permissions: ownerPermissions(session.id),
    });
    return (await hydrate([row as unknown as PostRow]))[0];
  } catch {
    await Promise.allSettled(
      uploaded.map((fileId) =>
        storage.deleteFile({ bucketId: APPWRITE_POST_MEDIA_BUCKET_ID, fileId }),
      ),
    );
    throw new PostError("Não foi possível criar a publicação.");
  }
}

export type FeedPage = { items: Post[]; hasMore: boolean };

export async function listFeedPage({
  offset = 0,
  limit = 5,
}: { offset?: number; limit?: number } = {}): Promise<FeedPage> {
  try {
    const result = await tables.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "posts",
      queries: [Query.orderDesc("createdAt"), Query.offset(offset), Query.limit(limit + 1)],
    });
    const rows = result.rows as unknown as PostRow[];
    return { items: await hydrate(rows.slice(0, limit)), hasMore: rows.length > limit };
  } catch {
    throw new PostError("Não foi possível carregar as publicações.");
  }
}

export async function listPosts(): Promise<Post[]> {
  return (await listFeedPage({ limit: 100 })).items;
}

export async function getPost(postId: string): Promise<Post | null> {
  try {
    const row = await tables.getRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "posts",
      rowId: postId,
    });
    return (await hydrate([row as unknown as PostRow]))[0];
  } catch (error) {
    if (
      error instanceof AppwriteException
        ? error.code === 404
        : (error as { code?: number })?.code === 404
    )
      return null;
    throw new PostError("Não foi possível carregar a publicação.");
  }
}

export async function deletePost(postId: string): Promise<void> {
  const session = getSession();
  const post = await getPost(postId);
  if (!post || !session || post.authorId !== session.id)
    throw new PostError("Você não pode excluir esta publicação.");
  await tables.deleteRow({ databaseId: APPWRITE_DATABASE_ID, tableId: "posts", rowId: postId });
  await Promise.allSettled(
    post.media.map((media) =>
      storage.deleteFile({ bucketId: APPWRITE_POST_MEDIA_BUCKET_ID, fileId: media.id }),
    ),
  );
}

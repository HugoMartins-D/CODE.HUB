import { AppwriteException, ID, Permission, Query, Role } from "appwrite";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_PROFILE_MEDIA_BUCKET_ID,
  storage,
  tables,
} from "@/lib/appwrite";
import { getSession } from "@/lib/auth";

export type ProfileStats = { posts: number; followers: number; following: number };
export type Profile = {
  userId: string;
  name: string;
  username: string;
  avatarFileId: string;
  avatarUrl: string;
  bannerFileId: string;
  bannerUrl: string;
  headline: string;
  location: string;
  website: string;
  bio: string;
  skills: string[];
  stats: ProfileStats;
  joinedAt: string;
};

type ProfileRow = {
  $id: string;
  userId: string;
  username: string;
  name: string;
  headline?: string;
  location?: string;
  website?: string;
  bio?: string;
  skills?: string[];
  avatarFileId?: string;
  bannerFileId?: string;
  joinedAt: string;
};

const EMPTY_STATS: ProfileStats = { posts: 0, followers: 0, following: 0 };
export const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;
let cachedProfile: Profile | null = null;
const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "codehub",
  "code.hub",
  "suporte",
  "support",
  "api",
  "www",
  "login",
  "cadastro",
  "perfil",
  "feed",
  "mensagens",
  "notificacoes",
  "termos",
  "privacidade",
]);

export class ProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileError";
  }
}

const SAFE_URL_SCHEMES = new Set(["http:", "https:"]);

/**
 * Reduz um endereço informado pela Pessoa a uma URL http(s) absoluta.
 * Devolve "" para qualquer coisa que não seja navegável com segurança —
 * `javascript:`, `data:`, `vbscript:` e lixo que não parseia. O campo é
 * renderizado como `href` no Perfil público, então o valor cru nunca deve
 * chegar ao DOM: o React neutraliza `javascript:` hoje, mas isso é uma
 * garantia do framework, não desta aplicação.
 */
export function sanitizeWebsite(value: string): string {
  const raw = value.trim();
  if (!raw) return "";
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return "";
  }
  return SAFE_URL_SCHEMES.has(url.protocol) ? url.toString() : "";
}

export function validateWebsite(value: string): string {
  const url = sanitizeWebsite(value);
  if (value.trim() && !url)
    throw new ProfileError("Use um endereço da web válido, começando com http:// ou https://.");
  return url;
}

export function normalizeUsername(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@+/, "")
    .replace(/[^a-z0-9._]/g, "");
}

export function validateUsername(value: string): string {
  const username = normalizeUsername(value);
  if (username.length < 3 || username.length > 30)
    throw new ProfileError("O @ deve ter entre 3 e 30 caracteres.");
  if (username.startsWith(".") || username.endsWith(".") || username.includes(".."))
    throw new ProfileError("O @ não pode começar, terminar ou repetir pontos.");
  if (RESERVED_USERNAMES.has(username)) throw new ProfileError("Este @ é reservado pela CODE.HUB.");
  return username;
}

function fallbackProfile(): Profile {
  const session = getSession();
  return {
    userId: session?.id ?? "",
    name: session?.name ?? "",
    username: session?.id ?? "eu",
    avatarFileId: "",
    avatarUrl: "",
    bannerFileId: "",
    bannerUrl: "",
    headline: "",
    location: "",
    website: "",
    bio: "",
    skills: [],
    stats: { ...EMPTY_STATS },
    joinedAt: session?.createdAt ?? new Date().toISOString(),
  };
}

function slugify(name: string, suffix: string): string {
  const base =
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 24) || "pessoa";
  return `${base}_${suffix.slice(-6).toLowerCase()}`;
}

function mediaUrl(fileId?: string): string {
  return fileId ? storage.getFileView({ bucketId: APPWRITE_PROFILE_MEDIA_BUCKET_ID, fileId }) : "";
}

function fromRow(row: ProfileRow, stats: ProfileStats): Profile {
  return {
    userId: row.userId,
    name: row.name,
    username: row.username,
    avatarFileId: row.avatarFileId ?? "",
    avatarUrl: mediaUrl(row.avatarFileId),
    bannerFileId: row.bannerFileId ?? "",
    bannerUrl: mediaUrl(row.bannerFileId),
    headline: row.headline ?? "",
    location: row.location ?? "",
    website: sanitizeWebsite(row.website ?? ""),
    bio: row.bio ?? "",
    skills: row.skills ?? [],
    stats,
    joinedAt: row.joinedAt,
  };
}

async function loadStats(userId: string): Promise<ProfileStats> {
  const [posts, followers, following] = await Promise.all([
    tables.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "posts",
      queries: [Query.equal("authorId", userId), Query.limit(1)],
    }),
    tables.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "connections",
      queries: [Query.equal("followingId", userId), Query.limit(1)],
    }),
    tables.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "connections",
      queries: [Query.equal("followerId", userId), Query.limit(1)],
    }),
  ]);
  return { posts: posts.total, followers: followers.total, following: following.total };
}

export async function loadMyProfile(): Promise<Profile> {
  const session = getSession();
  if (!session) return fallbackProfile();
  try {
    const [row, stats] = await Promise.all([
      tables.getRow({ databaseId: APPWRITE_DATABASE_ID, tableId: "profiles", rowId: session.id }),
      loadStats(session.id),
    ]);
    cachedProfile = fromRow(row as unknown as ProfileRow, stats);
  } catch (error) {
    if (!(error instanceof AppwriteException) || error.code !== 404) throw error;
    const row = await tables.createRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "profiles",
      rowId: session.id,
      data: {
        userId: session.id,
        username: slugify(session.name, session.id),
        name: session.name,
        joinedAt: session.createdAt,
      },
      permissions: [
        Permission.update(Role.user(session.id)),
        Permission.delete(Role.user(session.id)),
      ],
    });
    cachedProfile = fromRow(row as unknown as ProfileRow, { ...EMPTY_STATS });
  }
  return cachedProfile;
}

export function getProfile(): Profile {
  return cachedProfile ?? fallbackProfile();
}

export async function isUsernameAvailable(value: string, currentUserId?: string): Promise<boolean> {
  const username = validateUsername(value);
  const result = await tables.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "profiles",
    queries: [Query.equal("username", username), Query.limit(1)],
  });
  const owner = result.rows[0] as unknown as ProfileRow | undefined;
  return !owner || owner.userId === currentUserId;
}

export async function loadProfileByUsername(value: string): Promise<Profile | null> {
  if (value === "eu") return loadMyProfile();
  const username = normalizeUsername(value);
  const result = await tables.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: "profiles",
    queries: [Query.equal("username", username), Query.limit(1)],
  });
  const row = result.rows[0] as unknown as ProfileRow | undefined;
  if (!row) return null;
  return fromRow(row, await loadStats(row.userId));
}

type ProfileMediaChanges = { avatar?: File | null; banner?: File | null };

function validateImage(file: File): void {
  if (!file.type.startsWith("image/")) throw new ProfileError("Envie apenas arquivos de imagem.");
  if (file.size > MAX_PROFILE_IMAGE_BYTES)
    throw new ProfileError("Cada imagem pode ter no máximo 5 MB.");
}

export async function saveProfile(
  patch: Partial<Profile>,
  media: ProfileMediaChanges = {},
): Promise<Profile> {
  const session = getSession();
  if (!session) throw new Error("Entre na sua conta para editar o perfil.");
  const username = patch.username === undefined ? undefined : validateUsername(patch.username);
  if (username && !(await isUsernameAvailable(username, session.id)))
    throw new ProfileError("Este @ já está sendo usado.");
  if (media.avatar instanceof File) validateImage(media.avatar);
  if (media.banner instanceof File) validateImage(media.banner);
  const uploaded: string[] = [];
  const permissions = [
    Permission.update(Role.user(session.id)),
    Permission.delete(Role.user(session.id)),
  ];
  const upload = async (file: File) => {
    const result = await storage.createFile({
      bucketId: APPWRITE_PROFILE_MEDIA_BUCKET_ID,
      fileId: ID.unique(),
      file,
      permissions,
    });
    uploaded.push(result.$id);
    return result.$id;
  };
  let avatarFileId: string | null | undefined;
  let bannerFileId: string | null | undefined;
  try {
    avatarFileId =
      media.avatar instanceof File
        ? await upload(media.avatar)
        : media.avatar === null
          ? null
          : undefined;
    bannerFileId =
      media.banner instanceof File
        ? await upload(media.banner)
        : media.banner === null
          ? null
          : undefined;
  } catch {
    await Promise.allSettled(
      uploaded.map((fileId) =>
        storage.deleteFile({ bucketId: APPWRITE_PROFILE_MEDIA_BUCKET_ID, fileId }),
      ),
    );
    throw new ProfileError("Não foi possível enviar a imagem.");
  }
  const allowed = {
    ...(username !== undefined && { username }),
    ...(patch.name !== undefined && { name: patch.name }),
    ...(patch.headline !== undefined && { headline: patch.headline }),
    ...(patch.location !== undefined && { location: patch.location }),
    ...(patch.website !== undefined && { website: validateWebsite(patch.website) || null }),
    ...(patch.bio !== undefined && { bio: patch.bio }),
    ...(patch.skills !== undefined && { skills: patch.skills }),
    ...(avatarFileId !== undefined && { avatarFileId }),
    ...(bannerFileId !== undefined && { bannerFileId }),
  };
  let row;
  try {
    row = await tables.updateRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "profiles",
      rowId: session.id,
      data: allowed,
    });
  } catch (error) {
    await Promise.allSettled(
      uploaded.map((fileId) =>
        storage.deleteFile({ bucketId: APPWRITE_PROFILE_MEDIA_BUCKET_ID, fileId }),
      ),
    );
    if (error instanceof AppwriteException && error.code === 409)
      throw new ProfileError("Este @ já está sendo usado.");
    throw error;
  }
  const obsolete = [
    avatarFileId !== undefined ? cachedProfile?.avatarFileId : "",
    bannerFileId !== undefined ? cachedProfile?.bannerFileId : "",
  ].filter(Boolean) as string[];
  await Promise.allSettled(
    obsolete.map((fileId) =>
      storage.deleteFile({ bucketId: APPWRITE_PROFILE_MEDIA_BUCKET_ID, fileId }),
    ),
  );
  cachedProfile = fromRow(row as unknown as ProfileRow, cachedProfile?.stats ?? { ...EMPTY_STATS });
  return cachedProfile;
}

export function resetProfile(): void {
  cachedProfile = null;
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

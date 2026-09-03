import { AppwriteException, ID, OAuthProvider } from "appwrite";
import { account } from "@/lib/appwrite";

export type SessionUser = { id: string; name: string; email: string; createdAt: string };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let currentSession: SessionUser | null = null;
let knownUsers: SessionUser[] = [];

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function asSession(user: {
  $id: string;
  name: string;
  email: string;
  $createdAt: string;
}): SessionUser {
  return { id: user.$id, name: user.name, email: user.email, createdAt: user.$createdAt };
}

function authMessage(error: unknown, fallback: string): string {
  if (!(error instanceof AppwriteException)) return fallback;
  if (error.code === 401) return "Email ou senha incorretos.";
  if (error.code === 409) return "Já existe uma conta com esse email.";
  if (error.code === 429) return "Muitas tentativas. Aguarde um pouco e tente novamente.";
  return error.message || fallback;
}

export async function initializeAuth(): Promise<SessionUser | null> {
  try {
    currentSession = asSession(await account.get());
    knownUsers = [...knownUsers.filter((user) => user.id !== currentSession?.id), currentSession];
  } catch {
    currentSession = null;
  }
  return currentSession;
}

export function getSession(): SessionUser | null {
  return currentSession;
}

export async function logout(): Promise<void> {
  currentSession = null;
  try {
    await account.deleteSession({ sessionId: "current" });
  } catch {
    // A sessão local termina mesmo se a revogação remota falhar.
  }
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}): Promise<SessionUser> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  if (!name) throw new AuthError("Informe seu nome completo.");
  if (!EMAIL_RE.test(email)) throw new AuthError("Digite um email válido.");
  if (input.password.length < 8) throw new AuthError("A senha precisa ter no mínimo 8 caracteres.");
  if (input.confirmPassword !== undefined && input.confirmPassword !== input.password) {
    throw new AuthError("As senhas não coincidem.");
  }
  try {
    await account.create({ userId: ID.unique(), email, password: input.password, name });
    await account.createEmailPasswordSession({ email, password: input.password });
    currentSession = asSession(await account.get());
    knownUsers = [...knownUsers.filter((user) => user.id !== currentSession?.id), currentSession];
    return currentSession;
  } catch (error) {
    throw new AuthError(authMessage(error, "Não foi possível criar a conta."));
  }
}

export async function login(input: { email: string; password: string }): Promise<SessionUser> {
  const email = normalizeEmail(input.email);
  if (!EMAIL_RE.test(email)) throw new AuthError("Digite um email válido.");
  if (!input.password) throw new AuthError("Digite sua senha.");
  try {
    await account.createEmailPasswordSession({ email, password: input.password });
    currentSession = asSession(await account.get());
    knownUsers = [...knownUsers.filter((user) => user.id !== currentSession?.id), currentSession];
    return currentSession;
  } catch (error) {
    throw new AuthError(authMessage(error, "Não foi possível entrar."));
  }
}

export function loginWithGithub(): void {
  const origin = window.location.origin;
  const redirect = account.createOAuth2Session({
    provider: OAuthProvider.Github,
    success: `${origin}/feed`,
    failure: `${origin}/login?oauth=failed`,
    scopes: ["read:user", "user:email"],
  });
  if (typeof redirect === "string") window.location.assign(redirect);
}

// Mensagens ainda são locais e ficam fora da integração do MVP.
export function listUsers(): SessionUser[] {
  return knownUsers;
}

export function resetAuthStore(): void {
  currentSession = null;
  knownUsers = [];
}

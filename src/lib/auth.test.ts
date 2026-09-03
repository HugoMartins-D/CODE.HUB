import { describe, expect, it } from "vitest";
import {
  AuthError,
  getSession,
  login,
  loginWithGithub,
  normalizeEmail,
  register,
} from "@/lib/auth";
import { account } from "@/lib/appwrite";
import { initialsOf, normalizeUsername, validateUsername } from "@/lib/profile";

describe("autenticação", () => {
  it("normaliza email e cria uma sessão sem credenciais", async () => {
    const session = await register({
      name: "  Ana Silva  ",
      email: " ANA@EXAMPLE.COM ",
      password: "12345678",
    });
    expect(normalizeEmail(" ANA@EXAMPLE.COM ")).toBe("ana@example.com");
    expect(session).toMatchObject({ name: "Ana Silva", email: "ana@example.com" });
    expect(getSession()).not.toHaveProperty("passwordHash");
  });

  it("rejeita senha incorreta", async () => {
    await register({ name: "Ana", email: "ana@example.com", password: "12345678" });
    await expect(
      login({ email: "ana@example.com", password: "senha-errada" }),
    ).rejects.toBeInstanceOf(AuthError);
  });

  it("calcula iniciais para nomes simples e compostos", () => {
    expect(initialsOf("Hugo Martins")).toBe("HM");
    expect(initialsOf("Codehub")).toBe("CO");
  });

  it("normaliza identificadores públicos sem diferenciar maiúsculas", () => {
    expect(normalizeUsername(" @Hugo.Martins ")).toBe("hugo.martins");
    expect(validateUsername("HUGO_01")).toBe("hugo_01");
  });

  it("rejeita identificadores inválidos ou reservados", () => {
    expect(() => validateUsername("ab")).toThrow("entre 3 e 30");
    expect(() => validateUsername("admin")).toThrow("reservado");
    expect(() => validateUsername("hugo..martins")).toThrow("repetir pontos");
  });

  it("inicia o OAuth do GitHub com retornos seguros para a aplicação", () => {
    loginWithGithub();
    expect(account.createOAuth2Session).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "github",
        success: expect.stringMatching(/\/feed$/),
        failure: expect.stringMatching(/\/login\?oauth=failed$/),
      }),
    );
  });
});

import { describe, expect, it } from "vitest";
import { ProfileError, sanitizeWebsite, validateWebsite } from "@/lib/profile";

describe("sanitizeWebsite", () => {
  it("descarta esquemas que executam script", () => {
    expect(sanitizeWebsite("javascript:alert(document.domain)")).toBe("");
    expect(sanitizeWebsite("JaVaScRiPt:alert(1)")).toBe("");
    expect(sanitizeWebsite("data:text/html,<script>alert(1)</script>")).toBe("");
    expect(sanitizeWebsite("vbscript:msgbox(1)")).toBe("");
  });

  it("assume https para um domínio sem esquema", () => {
    expect(sanitizeWebsite("codehub.dev")).toBe("https://codehub.dev/");
    expect(sanitizeWebsite("  codehub.dev/bruno  ")).toBe("https://codehub.dev/bruno");
  });

  it("preserva http e https", () => {
    expect(sanitizeWebsite("https://codehub.dev/bruno")).toBe("https://codehub.dev/bruno");
    expect(sanitizeWebsite("http://codehub.dev")).toBe("http://codehub.dev/");
  });

  it("trata vazio como ausência de site", () => {
    expect(sanitizeWebsite("")).toBe("");
    expect(sanitizeWebsite("   ")).toBe("");
  });
});

describe("validateWebsite", () => {
  it("recusa um endereço que não é navegável", () => {
    expect(() => validateWebsite("javascript:alert(1)")).toThrow(ProfileError);
  });

  it("aceita vazio", () => {
    expect(validateWebsite("")).toBe("");
  });
});

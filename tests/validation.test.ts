import { describe, expect, it } from "vitest";
import { emptyPostValues, plainText, validatePost } from "../src/utils/validation";

const disciplines = [{ _id: "science", isActive: true }];
const statuses = [{ _id: "draft", isActive: true }];

describe("post form validation", () => {
  it("accepts the existing required fields and optional series/image", () => {
    const errors = validatePost(
      {
        ...emptyPostValues,
        title: "Um título válido",
        summary: "Um resumo de conteúdo válido",
        content: "Texto com mais de dez caracteres",
        disciplineId: "science",
        statusId: "draft",
        semester: "1",
      },
      disciplines,
      statuses,
    );

    expect(errors).toEqual({});
  });

  it("enforces text lengths, semester, and active catalog choices", () => {
    const errors = validatePost(
      {
        ...emptyPostValues,
        title: "abc",
        summary: "curto",
        content: "curto",
        disciplineId: "inactive",
        statusId: "absent",
      },
      [{ _id: "inactive", isActive: false }],
      [{ _id: "missing", isActive: false }],
    );

    expect(errors.title).toBe("Informe um título com 5 a 100 caracteres.");
    expect(errors.summary).toBe("Informe um resumo com 10 a 300 caracteres.");
    expect(errors.content).toBe("Escreva um conteúdo com pelo menos 10 caracteres.");
    expect(errors.semester).toBe("Informe o semestre letivo.");
    expect(errors.disciplineId).toBe("Selecione uma disciplina disponível.");
    expect(errors.statusId).toBe("Selecione um status disponível.");
  });

  it("validates cover image URLs and removes markup before API submission", () => {
    const errors = validatePost(
      {
        ...emptyPostValues,
        title: "Título com tamanho",
        summary: "Resumo com pelo menos dez caracteres",
        content: "Conteúdo com pelo menos dez caracteres",
        disciplineId: "science",
        statusId: "draft",
        semester: "1",
        imageUrl: "javascript:alert(1)",
      },
      disciplines,
      statuses,
    );

    expect(errors.imageUrl).toContain("http:// ou https://");
    expect(plainText("<script>alert(1)</script><b>Texto</b>")).toBe("Texto");
  });

  it("requires active status ids for submission", () => {
    const errors = validatePost(
      {
        ...emptyPostValues,
        title: "Título com tamanho",
        summary: "Resumo com pelo menos dez caracteres",
        content: "Conteúdo com pelo menos dez caracteres",
        disciplineId: "science",
        statusId: "draft",
        semester: "1",
      },
      disciplines,
      [{ _id: "draft", isActive: false }],
    );

    expect(errors.statusId).toBe("Selecione um status disponível.");
  });

  it("rejects archived status even when it exists in the catalog", () => {
    const errors = validatePost(
      {
        ...emptyPostValues,
        title: "Título com tamanho",
        summary: "Resumo com pelo menos dez caracteres",
        content: "Conteúdo com pelo menos dez caracteres",
        disciplineId: "science",
        statusId: "archived",
        semester: "1",
      },
      disciplines,
      [{ _id: "archived", label: "Arquivado", isActive: true }],
    );

    expect(errors.statusId).toBe("Selecione um status disponível.");
  });
});

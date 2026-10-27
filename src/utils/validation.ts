import type { PostValues } from "../types/models";

export type FormField = keyof PostValues;
export type FieldErrors = Partial<Record<FormField, string>>;

export const emptyPostValues: PostValues = {
  title: "",
  summary: "",
  content: "",
  disciplineId: "",
  statusId: "",
  semester: "",
  series: "",
  imageUrl: "",
  isFeatured: false,
};

export function plainText(value: string) {
  return value
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

export function validatePost(
  values: PostValues,
  disciplines: { _id: string; isActive: boolean }[],
  statuses: { _id: string; isActive?: boolean; label?: string }[],
): FieldErrors {
  const errors: FieldErrors = {};
  const titleLength = plainText(values.title).length;
  const summaryLength = plainText(values.summary).length;

  if (titleLength < 5 || titleLength > 100) {
    errors.title = "Informe um título com 5 a 100 caracteres.";
  }
  if (summaryLength < 10 || summaryLength > 300) {
    errors.summary = "Informe um resumo com 10 a 300 caracteres.";
  }
  if (plainText(values.content).length < 10) {
    errors.content = "Escreva um conteúdo com pelo menos 10 caracteres.";
  }
  if (!values.semester.trim()) {
    errors.semester = "Informe o semestre letivo.";
  }
  if (
    !disciplines.some(
      (item) => item._id === values.disciplineId && item.isActive,
    )
  ) {
    errors.disciplineId = "Selecione uma disciplina disponível.";
  }
  const selectedStatus = statuses.find(
    (item) => item._id === values.statusId && item.isActive,
  );
  const isArchivedStatus =
    selectedStatus?.label?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim() === "arquivado";
  if (!selectedStatus || isArchivedStatus) {
    errors.statusId = "Selecione um status disponível.";
  }
  if (values.imageUrl.trim()) {
    try {
      const url = new URL(values.imageUrl.trim());
      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Protocolo inválido");
      }
    } catch {
      errors.imageUrl =
        "Informe uma URL de imagem válida, começando com http:// ou https://.";
    }
  }
  return errors;
}

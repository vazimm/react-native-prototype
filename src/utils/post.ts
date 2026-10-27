import { jwtDecode } from "jwt-decode";
import type { Post } from "../types/models";

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function isPublishedPost(post: Post) {
  return normalizeText(post.status.label) === "publicado";
}

export function isDraftPost(post: Post) {
  return normalizeText(post.status.label) === "rascunho";
}

export function isTokenExpired(token: string) {
  try {
    const payload = jwtDecode<{ exp?: number }>(token);
    return !payload.exp || Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function filterTeacherPosts(
  posts: Post[],
  userId: string,
  email: string,
  searchTerm: string,
  discipline: string,
  status: "todos" | "publicado" | "rascunho",
) {
  const search = normalizeText(searchTerm);
  return posts
    .filter((post) => post.author._id === userId || post.author.email === email)
    .filter((post) => !search || normalizeText(post.title).includes(search))
    .filter((post) => !discipline || post.discipline.label === discipline)
    .filter((post) => {
      if (status === "publicado") return isPublishedPost(post);
      if (status === "rascunho") return !isPublishedPost(post);
      return true;
    })
    .sort(
      (left, right) =>
        new Date(right.createDate).getTime() -
        new Date(left.createDate).getTime(),
    );
}

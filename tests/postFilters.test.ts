import { describe, expect, it } from "vitest";
import { filterTeacherPosts } from "../src/utils/post";
import type { Post } from "../src/types/models";

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    _id: "post-1",
    title: "Ciência e educação",
    content: "Conteúdo educacional completo.",
    summary: "Resumo da publicação.",
    imageUrl: "",
    series: "",
    semester: "1",
    discipline: { _id: "science", label: "Ciências", order: 1 },
    author: {
      _id: "teacher-1",
      email: "teacher@example.com",
      name: "Teacher",
      username: "teacher",
    },
    status: { _id: "draft", label: "Rascunho", order: 1 },
    isFeatured: false,
    createDate: "2026-01-01T00:00:00.000Z",
    updateDate: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("teacher post filtering", () => {
  it("scopes posts to the signed-in teacher and filters title, discipline, and status", () => {
    const posts = [
      makePost(),
      makePost({
        _id: "post-2",
        title: "História",
        status: { _id: "published", label: "Publicado", order: 2 },
      }),
      makePost({
        _id: "other",
        author: {
          _id: "someone-else",
          email: "other@example.com",
          name: "Other",
          username: "other",
        },
      }),
    ];

    expect(
      filterTeacherPosts(posts, "teacher-1", "teacher@example.com", "CIENCIA", "Ciências", "rascunho")
        .map((post) => post._id),
    ).toEqual(["post-1"]);
  });

  it("sorts matching teacher posts newest first", () => {
    const posts = [
      makePost(),
      makePost({
        _id: "newer",
        createDate: "2026-02-01T00:00:00.000Z",
      }),
    ];

    expect(
      filterTeacherPosts(posts, "teacher-1", "teacher@example.com", "", "", "todos")
        .map((post) => post._id),
    ).toEqual(["newer", "post-1"]);
  });
});

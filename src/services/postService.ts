import api from "./api";
import type {
  ApiData,
  Discipline,
  Post,
  PostStatus,
  PostValues,
} from "../types/models";

export async function getTeacherPostsRequest() {
  const response = await api.get<ApiData<Post[]>>("/posts/all");
  return response.data.data;
}

export async function getPostByIdRequest(id: string) {
  const response = await api.get<ApiData<Post>>(`/posts/${id}`);
  return response.data.data;
}

export async function getDisciplinesRequest() {
  const response = await api.get<ApiData<Discipline[]>>(
    "/catalog/disciplines",
  );
  return response.data.data;
}

export async function getPostStatusesRequest() {
  const response = await api.get<ApiData<PostStatus[]>>("/catalog/status");
  return response.data.data;
}

export async function createTeacherPostRequest(payload: PostValues) {
  const response = await api.post<ApiData<Post>>("/posts", payload);
  return response.data.data;
}

export async function updateTeacherPostRequest(
  id: string,
  payload: PostValues,
) {
  const response = await api.put<ApiData<Post>>(`/posts/${id}`, payload);
  return response.data.data;
}

export async function deletePostRequest(id: string) {
  await api.delete(`/posts/${id}`);
}

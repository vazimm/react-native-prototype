export type UserRole = "PROFESSOR" | "ALUNO" | "ADM";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface Discipline {
  _id: string;
  label: string;
  order: number;
  isActive: boolean;
}

export interface PostStatus {
  _id: string;
  label: string;
  order: number;
  isActive?: boolean;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  series: string;
  semester: string;
  discipline: Pick<Discipline, "_id" | "label" | "order">;
  author: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
  status: PostStatus;
  isFeatured: boolean;
  createDate: string;
  updateDate: string;
}

export interface PostValues {
  title: string;
  summary: string;
  content: string;
  disciplineId: string;
  statusId: string;
  semester: string;
  series: string;
  imageUrl: string;
  isFeatured: boolean;
}

export interface LoginResponse {
  data: {
    token: string;
    user: User;
  };
}

export interface ApiData<T> {
  data: T;
}

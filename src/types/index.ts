export type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Column = {
  id: string;
  projectId: string;
  name: string;
  order: number;
};

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  id: string;
  projectId: string;
  columnId: string;
  title: string;
  description: string | null;
  assignee: string | null;
  priority: Priority;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Developer = {
  id: string;
  name: string;
  avatar?: string;
};
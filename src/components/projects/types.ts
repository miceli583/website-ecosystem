export type ProjectWithMeta = {
  id: number;
  name: string;
  description: string | null;
  status: string;
  isArchived: boolean;
  clientId: number;
  accountManagerId: string | null;
  assignedDeveloperId: string | null;
  createdAt: Date;
  updatedAt: Date;
  client: { id: number; name: string; slug: string } | null;
  accountManager: { id: string; name: string } | null;
  assignedDeveloper: { id: string; name: string } | null;
  _count: { tasks: number; doneTasks: number };
};

export type TaskWithMeta = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  projectId: number | null;
  clientId: number | null;
  ownerId: string | null;
  accountManagerId: string | null;
  assignedDeveloperId: string | null;
  dueDate: string | null;
  createdAt: Date;
  updatedAt: Date;
  project: { id: number; name: string } | null;
  client: { id: number; name: string; slug: string } | null;
  owner: { id: string; name: string } | null;
  accountManager: { id: string; name: string } | null;
  assignedDeveloper: { id: string; name: string } | null;
};

export type FilterState = {
  clientId?: number;
  accountManagerId?: string;
  developerId?: string;
  ownerId?: string;
  status?: string;
  priority?: string;
  search?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  companyRoles: string[] | null;
};

export type ClientOption = {
  id: number;
  name: string;
  slug: string;
};

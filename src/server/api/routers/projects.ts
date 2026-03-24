import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
  accountManagerProcedure,
  fullAccessProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  clientProjects,
  projectTasks,
  clients,
  portalUsers,
} from "~/server/db/schema";
import { eq, desc, asc, and, ilike, or, count, sql, isNull } from "drizzle-orm";
import { isFullAccess } from "~/lib/permissions";
import { TRPCError } from "@trpc/server";

const projectStatusEnum = z.enum(["active", "completed", "on-hold", "paused"]);
const taskStatusEnum = z.enum(["todo", "in-progress", "done"]);
const taskPriorityEnum = z.enum(["low", "medium", "high", "urgent"]);

export const projectsRouter = createTRPCRouter({
  // ─── PROJECT PROCEDURES ────────────────────────────────────────────

  list: adminProcedure
    .input(
      z.object({
        clientId: z.number().optional(),
        accountManagerId: z.string().optional(),
        developerId: z.string().optional(),
        status: projectStatusEnum.optional(),
        search: z.string().optional(),
        sortBy: z
          .enum(["name", "createdAt", "updatedAt", "status"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];

      // Role-based scoping
      const roles = (ctx.profile.companyRoles ?? []) as string[];
      if (!isFullAccess(roles)) {
        if (roles.includes("account_manager")) {
          conditions.push(eq(clientProjects.accountManagerId, ctx.profile.id));
        } else if (roles.includes("developer")) {
          conditions.push(
            eq(clientProjects.assignedDeveloperId, ctx.profile.id)
          );
        }
      }

      if (input.clientId) {
        conditions.push(eq(clientProjects.clientId, input.clientId));
      }
      if (input.accountManagerId) {
        conditions.push(
          eq(clientProjects.accountManagerId, input.accountManagerId)
        );
      }
      if (input.developerId) {
        conditions.push(
          eq(clientProjects.assignedDeveloperId, input.developerId)
        );
      }
      if (input.status) {
        conditions.push(eq(clientProjects.status, input.status));
      }
      if (input.search) {
        conditions.push(
          or(
            ilike(clientProjects.name, `%${input.search}%`),
            ilike(clientProjects.description, `%${input.search}%`)
          )
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const sortCol =
        input.sortBy === "name"
          ? clientProjects.name
          : input.sortBy === "updatedAt"
            ? clientProjects.updatedAt
            : input.sortBy === "status"
              ? clientProjects.status
              : clientProjects.createdAt;
      const orderBy =
        input.sortOrder === "asc" ? [asc(sortCol)] : [desc(sortCol)];

      const [items, totalResult] = await Promise.all([
        db.query.clientProjects.findMany({
          where,
          orderBy,
          limit: input.pageSize,
          offset: (input.page - 1) * input.pageSize,
          with: {
            client: { columns: { id: true, name: true, slug: true } },
            accountManager: { columns: { id: true, name: true } },
            assignedDeveloper: { columns: { id: true, name: true } },
            tasks: { columns: { id: true, status: true } },
          },
        }),
        db.select({ count: count() }).from(clientProjects).where(where),
      ]);

      // Compute task counts
      const itemsWithCounts = items.map((item: (typeof items)[number]) => {
        const taskCount = item.tasks.length;
        const doneTasks = item.tasks.filter(
          (t: { status: string }) => t.status === "done"
        ).length;
        const { tasks: _tasks, ...project } = item;
        return { ...project, _count: { tasks: taskCount, doneTasks } };
      });

      return {
        items: itemsWithCounts,
        total: totalResult[0]?.count ?? 0,
        page: input.page,
        pageSize: input.pageSize,
        hasMore: input.page * input.pageSize < (totalResult[0]?.count ?? 0),
      };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const project = await db.query.clientProjects.findFirst({
        where: eq(clientProjects.id, input.id),
        with: {
          client: { columns: { id: true, name: true, slug: true } },
          accountManager: { columns: { id: true, name: true, email: true } },
          assignedDeveloper: {
            columns: { id: true, name: true, email: true },
          },
          tasks: {
            orderBy: [desc(projectTasks.createdAt)],
            with: {
              owner: { columns: { id: true, name: true } },
              accountManager: { columns: { id: true, name: true } },
              assignedDeveloper: { columns: { id: true, name: true } },
            },
          },
          updates: { orderBy: [desc(sql`created_at`)] },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      // Role-scoping: AM/dev can only see their assigned projects
      const roles = (ctx.profile.companyRoles ?? []) as string[];
      if (!isFullAccess(roles)) {
        if (
          roles.includes("account_manager") &&
          project.accountManagerId !== ctx.profile.id
        ) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        if (
          roles.includes("developer") &&
          project.assignedDeveloperId !== ctx.profile.id
        ) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
      }

      return project;
    }),

  create: accountManagerProcedure
    .input(
      z.object({
        clientId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        status: projectStatusEnum.default("active"),
        accountManagerId: z.string().uuid().optional(),
        assignedDeveloperId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Auto-populate AM/dev from client if not provided
      let amId = input.accountManagerId ?? null;
      let devId = input.assignedDeveloperId ?? null;

      if (!amId || !devId) {
        const client = await db.query.clients.findFirst({
          where: eq(clients.id, input.clientId),
          columns: { accountManagerId: true, assignedDeveloperId: true },
        });
        if (client) {
          if (!amId) amId = client.accountManagerId;
          if (!devId) devId = client.assignedDeveloperId;
        }
      }

      const [project] = await db
        .insert(clientProjects)
        .values({
          clientId: input.clientId,
          name: input.name,
          description: input.description ?? null,
          status: input.status,
          accountManagerId: amId,
          assignedDeveloperId: devId,
        })
        .returning();

      return project;
    }),

  update: accountManagerProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().nullish(),
        status: projectStatusEnum.optional(),
        accountManagerId: z.string().uuid().nullish(),
        assignedDeveloperId: z.string().uuid().nullish(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...fields } = input;
      const updates: Record<string, unknown> = { updatedAt: new Date() };

      if (fields.name !== undefined) updates.name = fields.name;
      if (fields.description !== undefined)
        updates.description = fields.description;
      if (fields.status !== undefined) updates.status = fields.status;
      if (fields.accountManagerId !== undefined)
        updates.accountManagerId = fields.accountManagerId;
      if (fields.assignedDeveloperId !== undefined)
        updates.assignedDeveloperId = fields.assignedDeveloperId;

      const [project] = await db
        .update(clientProjects)
        .set(updates)
        .where(eq(clientProjects.id, id))
        .returning();

      return project;
    }),

  delete: fullAccessProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(clientProjects).where(eq(clientProjects.id, input.id));
      return { success: true };
    }),

  // ─── TASK PROCEDURES ───────────────────────────────────────────────

  listTasks: adminProcedure
    .input(
      z.object({
        projectId: z.number().optional(),
        clientId: z.number().optional(),
        status: taskStatusEnum.optional(),
        priority: taskPriorityEnum.optional(),
        ownerId: z.string().optional(),
        accountManagerId: z.string().optional(),
        developerId: z.string().optional(),
        search: z.string().optional(),
        unassigned: z.boolean().optional(), // tasks without a project
        sortBy: z
          .enum(["title", "priority", "dueDate", "createdAt", "status"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];

      // Role-based scoping
      const roles = (ctx.profile.companyRoles ?? []) as string[];
      if (!isFullAccess(roles)) {
        if (roles.includes("account_manager")) {
          conditions.push(eq(projectTasks.accountManagerId, ctx.profile.id));
        } else if (roles.includes("developer")) {
          conditions.push(eq(projectTasks.assignedDeveloperId, ctx.profile.id));
        }
      }

      if (input.projectId) {
        conditions.push(eq(projectTasks.projectId, input.projectId));
      }
      if (input.clientId) {
        conditions.push(eq(projectTasks.clientId, input.clientId));
      }
      if (input.status) {
        conditions.push(eq(projectTasks.status, input.status));
      }
      if (input.priority) {
        conditions.push(eq(projectTasks.priority, input.priority));
      }
      if (input.ownerId) {
        conditions.push(eq(projectTasks.ownerId, input.ownerId));
      }
      if (input.accountManagerId) {
        conditions.push(
          eq(projectTasks.accountManagerId, input.accountManagerId)
        );
      }
      if (input.developerId) {
        conditions.push(
          eq(projectTasks.assignedDeveloperId, input.developerId)
        );
      }
      if (input.search) {
        conditions.push(
          or(
            ilike(projectTasks.title, `%${input.search}%`),
            ilike(projectTasks.description, `%${input.search}%`)
          )
        );
      }
      if (input.unassigned) {
        conditions.push(isNull(projectTasks.projectId));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      // Priority sorting uses custom order
      const priorityOrder = sql`CASE ${projectTasks.priority}
        WHEN 'urgent' THEN 1 WHEN 'high' THEN 2
        WHEN 'medium' THEN 3 WHEN 'low' THEN 4 END`;

      const sortCol =
        input.sortBy === "title"
          ? projectTasks.title
          : input.sortBy === "dueDate"
            ? projectTasks.dueDate
            : input.sortBy === "status"
              ? projectTasks.status
              : input.sortBy === "priority"
                ? priorityOrder
                : projectTasks.createdAt;

      const orderBy =
        input.sortBy === "priority"
          ? input.sortOrder === "desc"
            ? [desc(priorityOrder)]
            : [asc(priorityOrder)]
          : input.sortOrder === "asc"
            ? [asc(sortCol)]
            : [desc(sortCol)];

      const [items, totalResult] = await Promise.all([
        db.query.projectTasks.findMany({
          where,
          orderBy,
          limit: input.pageSize,
          offset: (input.page - 1) * input.pageSize,
          with: {
            project: { columns: { id: true, name: true } },
            client: { columns: { id: true, name: true, slug: true } },
            owner: { columns: { id: true, name: true } },
            accountManager: { columns: { id: true, name: true } },
            assignedDeveloper: { columns: { id: true, name: true } },
          },
        }),
        db.select({ count: count() }).from(projectTasks).where(where),
      ]);

      return {
        items,
        total: totalResult[0]?.count ?? 0,
        page: input.page,
        pageSize: input.pageSize,
        hasMore: input.page * input.pageSize < (totalResult[0]?.count ?? 0),
      };
    }),

  createTask: accountManagerProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        status: taskStatusEnum.default("todo"),
        priority: taskPriorityEnum.default("medium"),
        projectId: z.number().optional(),
        clientId: z.number().optional(),
        ownerId: z.string().uuid().optional(),
        accountManagerId: z.string().uuid().optional(),
        assignedDeveloperId: z.string().uuid().optional(),
        dueDate: z.string().optional(), // ISO date string
      })
    )
    .mutation(async ({ input }) => {
      let clientId = input.clientId ?? null;
      let amId = input.accountManagerId ?? null;
      let devId = input.assignedDeveloperId ?? null;

      // Auto-populate from project if set
      if (input.projectId) {
        const project = await db.query.clientProjects.findFirst({
          where: eq(clientProjects.id, input.projectId),
          columns: {
            clientId: true,
            accountManagerId: true,
            assignedDeveloperId: true,
          },
        });
        if (project) {
          if (!clientId) clientId = project.clientId;
          if (!amId) amId = project.accountManagerId;
          if (!devId) devId = project.assignedDeveloperId;
        }
      }

      // If still no AM/dev, try client
      if (clientId && (!amId || !devId)) {
        const client = await db.query.clients.findFirst({
          where: eq(clients.id, clientId),
          columns: { accountManagerId: true, assignedDeveloperId: true },
        });
        if (client) {
          if (!amId) amId = client.accountManagerId;
          if (!devId) devId = client.assignedDeveloperId;
        }
      }

      const [task] = await db
        .insert(projectTasks)
        .values({
          title: input.title,
          description: input.description ?? null,
          status: input.status,
          priority: input.priority,
          projectId: input.projectId ?? null,
          clientId: clientId,
          ownerId: input.ownerId ?? null,
          accountManagerId: amId,
          assignedDeveloperId: devId,
          dueDate: input.dueDate ?? null,
        })
        .returning();

      return task;
    }),

  updateTask: accountManagerProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().nullish(),
        status: taskStatusEnum.optional(),
        priority: taskPriorityEnum.optional(),
        projectId: z.number().nullish(),
        clientId: z.number().nullish(),
        ownerId: z.string().uuid().nullish(),
        accountManagerId: z.string().uuid().nullish(),
        assignedDeveloperId: z.string().uuid().nullish(),
        dueDate: z.string().nullish(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...fields } = input;
      const updates: Record<string, unknown> = { updatedAt: new Date() };

      if (fields.title !== undefined) updates.title = fields.title;
      if (fields.description !== undefined)
        updates.description = fields.description;
      if (fields.status !== undefined) updates.status = fields.status;
      if (fields.priority !== undefined) updates.priority = fields.priority;
      if (fields.projectId !== undefined) updates.projectId = fields.projectId;
      if (fields.clientId !== undefined) updates.clientId = fields.clientId;
      if (fields.ownerId !== undefined) updates.ownerId = fields.ownerId;
      if (fields.accountManagerId !== undefined)
        updates.accountManagerId = fields.accountManagerId;
      if (fields.assignedDeveloperId !== undefined)
        updates.assignedDeveloperId = fields.assignedDeveloperId;
      if (fields.dueDate !== undefined) updates.dueDate = fields.dueDate;

      const [task] = await db
        .update(projectTasks)
        .set(updates)
        .where(eq(projectTasks.id, id))
        .returning();

      return task;
    }),

  deleteTask: accountManagerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(projectTasks).where(eq(projectTasks.id, input.id));
      return { success: true };
    }),

  moveTaskStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: taskStatusEnum,
      })
    )
    .mutation(async ({ input }) => {
      const [task] = await db
        .update(projectTasks)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(projectTasks.id, input.id))
        .returning();
      return task;
    }),

  // ─── PORTAL PROCEDURES ─────────────────────────────────────────────

  portalProjects: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        status: projectStatusEnum.optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });
      if (!profile?.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }
      if (profile.role === "client" && profile.clientSlug !== input.slug) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.slug),
        columns: { id: true },
      });
      if (!client) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      }

      const conditions = [eq(clientProjects.clientId, client.id)];
      if (input.status) {
        conditions.push(eq(clientProjects.status, input.status));
      }
      if (input.search) {
        conditions.push(ilike(clientProjects.name, `%${input.search}%`));
      }

      const projects = await db.query.clientProjects.findMany({
        where: and(...conditions),
        orderBy: [desc(clientProjects.createdAt)],
        with: {
          accountManager: { columns: { id: true, name: true } },
          assignedDeveloper: { columns: { id: true, name: true } },
          tasks: { columns: { id: true, status: true } },
        },
      });

      return projects.map((p: (typeof projects)[number]) => {
        const taskCount = p.tasks.length;
        const doneTasks = p.tasks.filter(
          (t: { status: string }) => t.status === "done"
        ).length;
        const { tasks: _tasks, ...project } = p;
        return { ...project, _count: { tasks: taskCount, doneTasks } };
      });
    }),

  portalTasks: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        projectId: z.number().optional(),
        status: taskStatusEnum.optional(),
        priority: taskPriorityEnum.optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });
      if (!profile?.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }
      if (profile.role === "client" && profile.clientSlug !== input.slug) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.slug),
        columns: { id: true },
      });
      if (!client) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      }

      const conditions = [eq(projectTasks.clientId, client.id)];
      if (input.projectId) {
        conditions.push(eq(projectTasks.projectId, input.projectId));
      }
      if (input.status) {
        conditions.push(eq(projectTasks.status, input.status));
      }
      if (input.priority) {
        conditions.push(eq(projectTasks.priority, input.priority));
      }
      if (input.search) {
        conditions.push(ilike(projectTasks.title, `%${input.search}%`));
      }

      return db.query.projectTasks.findMany({
        where: and(...conditions),
        orderBy: [desc(projectTasks.createdAt)],
        with: {
          project: { columns: { id: true, name: true } },
          owner: { columns: { id: true, name: true } },
          accountManager: { columns: { id: true, name: true } },
          assignedDeveloper: { columns: { id: true, name: true } },
        },
      });
    }),

  portalUpdateTaskStatus: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        taskId: z.number(),
        status: taskStatusEnum,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });
      if (!profile?.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }
      if (profile.role === "client" && profile.clientSlug !== input.slug) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      // Verify the task belongs to this client
      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.slug),
        columns: { id: true },
      });
      if (!client) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      }

      const task = await db.query.projectTasks.findFirst({
        where: and(
          eq(projectTasks.id, input.taskId),
          eq(projectTasks.clientId, client.id)
        ),
      });
      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
      }

      const [updated] = await db
        .update(projectTasks)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(projectTasks.id, input.taskId))
        .returning();

      return updated;
    }),
});

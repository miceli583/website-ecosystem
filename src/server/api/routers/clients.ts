import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  clients,
  clientProjects,
  clientUpdates,
  clientAgreements,
  masterCrm,
} from "~/server/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { sendEmail } from "~/lib/email";
import { ClientUpdateEmail } from "~/lib/email-templates/client-update";

export const clientsRouter = createTRPCRouter({
  // Get distinct company names for picker
  getCompanyOptions: protectedProcedure.query(async () => {
    const result = await db.execute(
      sql`SELECT DISTINCT company FROM clients WHERE company IS NOT NULL AND company != '' ORDER BY company`
    );
    const crmResult = await db.execute(
      sql`SELECT DISTINCT company FROM master_crm WHERE company IS NOT NULL AND company != '' ORDER BY company`
    );
    const all = new Set<string>();
    for (const row of result as unknown as { company: string }[]) all.add(row.company);
    for (const row of crmResult as unknown as { company: string }[]) all.add(row.company);
    return [...all].sort();
  }),

  // List all clients
  list: protectedProcedure.query(async () => {
    return db.query.clients.findMany({
      orderBy: [desc(clients.createdAt)],
      with: {
        projects: true,
      },
    });
  }),

  // Get single client by ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.query.clients.findFirst({
        where: eq(clients.id, input.id),
        with: {
          projects: {
            with: {
              updates: {
                orderBy: [desc(clientUpdates.createdAt)],
              },
            },
          },
          agreements: {
            orderBy: [desc(clientAgreements.createdAt)],
          },
        },
      });
    }),

  // Get client by slug (used for client portal)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.query.clients.findFirst({
        where: eq(clients.slug, input.slug),
        with: {
          projects: {
            with: {
              updates: {
                orderBy: [desc(clientUpdates.createdAt)],
              },
            },
          },
          agreements: {
            orderBy: [desc(clientAgreements.createdAt)],
          },
        },
      });
    }),

  // Create client (auto-links to master CRM)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        slug: z.string().min(1),
        company: z.string().optional(),
        notes: z.string().optional(),
        accountManagerId: z.string().uuid().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Look up or create master CRM record
      const existingCrm = await db
        .select({ id: masterCrm.id })
        .from(masterCrm)
        .where(eq(masterCrm.email, input.email))
        .limit(1);

      let crmId: string;

      if (existingCrm[0]) {
        crmId = existingCrm[0].id;
        await db
          .update(masterCrm)
          .set({ status: "client", updatedAt: new Date() })
          .where(eq(masterCrm.id, crmId));
      } else {
        const [newCrm] = await db
          .insert(masterCrm)
          .values({
            email: input.email,
            name: input.name,
            source: "portal",
            status: "client",
          })
          .returning({ id: masterCrm.id });
        crmId = newCrm!.id;
      }

      const [client] = await db
        .insert(clients)
        .values({
          crmId,
          name: input.name,
          email: input.email,
          slug: input.slug,
          company: input.company ?? null,
          notes: input.notes ?? null,
          accountManagerId: input.accountManagerId ?? null,
        })
        .returning();
      return client;
    }),

  // Update client
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        status: z.enum(["active", "inactive"]).optional(),
        company: z.string().nullable().optional(),
        notes: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [updated] = await db
        .update(clients)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(clients.id, id))
        .returning();
      return updated;
    }),

  // Create project for a client
  createProject: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [project] = await db
        .insert(clientProjects)
        .values({
          clientId: input.clientId,
          name: input.name,
          description: input.description ?? null,
        })
        .returning();
      return project;
    }),

  // Push update to a project (also sends email notification)
  pushUpdate: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        title: z.string().min(1),
        content: z.string().min(1),
        type: z.enum(["demo", "proposal", "update", "invoice"]).default("update"),
      })
    )
    .mutation(async ({ input }) => {
      const [update] = await db
        .insert(clientUpdates)
        .values({
          projectId: input.projectId,
          title: input.title,
          content: input.content,
          type: input.type,
        })
        .returning();

      // Look up project -> client for email notification
      const project = await db.query.clientProjects.findFirst({
        where: eq(clientProjects.id, input.projectId),
        with: {
          client: true,
        },
      });

      if (project?.client) {
        const portalUrl = `https://clients.miraclemind.dev/client/${project.client.slug}`;
        void sendEmail({
          to: project.client.email,
          subject: `New ${input.type} from Miracle Mind: ${input.title}`,
          react: ClientUpdateEmail({
            clientName: project.client.name,
            updateTitle: input.title,
            updateType: input.type,
            projectName: project.name,
            portalUrl,
          }),
        });
      }

      return update;
    }),

  // Create agreement
  createAgreement: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        projectId: z.number().optional(),
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const [agreement] = await db
        .insert(clientAgreements)
        .values({
          clientId: input.clientId,
          projectId: input.projectId,
          title: input.title,
          content: input.content,
        })
        .returning();
      return agreement;
    }),
});

import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { stripeLive } from "~/lib/stripe-live";
import {
  masterCrm,
  banyanEarlyAccess,
  contactSubmissions,
  personalContactSubmissions,
  clients,
  portalUsers,
} from "~/server/db/schema";
import { and, count, desc, eq, sql, ilike, or, gte, inArray } from "drizzle-orm";

/**
 * CRM Router
 *
 * Admin-only procedures for the master CRM dashboard.
 * Manages contacts across all sources: personal site, miracle mind, banyan waitlist.
 */
export const crmRouter = createTRPCRouter({
  /**
   * Get pipeline stats by status
   */
  getPipelineStats: adminProcedure.query(async () => {
    const statuses = await db
      .select({
        status: masterCrm.status,
        count: count(),
      })
      .from(masterCrm)
      .groupBy(masterCrm.status);

    const pipeline: Record<string, number> = {
      lead: 0,
      prospect: 0,
      client: 0,
      inactive: 0,
      churned: 0,
    };

    for (const row of statuses) {
      pipeline[row.status] = row.count;
    }

    const total = Object.values(pipeline).reduce((sum, n) => sum + n, 0);

    return { ...pipeline, total };
  }),

  /**
   * List all master CRM contacts with optional search/filter.
   * Enriches each contact with submission sources and portal client link.
   */
  getContacts: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.string().optional(),
        source: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const conditions = [];

      if (input.search) {
        conditions.push(
          or(
            ilike(masterCrm.name, `%${input.search}%`),
            ilike(masterCrm.email, `%${input.search}%`)
          )
        );
      }
      if (input.status) {
        conditions.push(eq(masterCrm.status, input.status));
      }
      if (input.source) {
        conditions.push(eq(masterCrm.source, input.source));
      }

      const where =
        conditions.length > 0
          ? sql`${sql.join(
              conditions.map((c) => sql`(${c})`),
              sql` AND `
            )}`
          : undefined;

      const [contactRows, totalResult] = await Promise.all([
        db
          .select()
          .from(masterCrm)
          .where(where)
          .orderBy(desc(masterCrm.lastContactAt))
          .limit(input.limit)
          .offset(input.offset),
        db.select({ count: count() }).from(masterCrm).where(where),
      ]);

      // Enrich with submission sources + portal client links
      const contactIds = contactRows.map((c: { id: string }) => c.id);

      if (contactIds.length === 0) {
        return {
          contacts: [] as Array<typeof contactRows[number] & { submissionSources: string[]; portalClient: { id: number; slug: string; name: string } | null }>,
          total: totalResult[0]?.count ?? 0,
          hasMore: false,
        };
      }

      // Collect account manager IDs for batch lookup
      const amIds = contactRows
        .map((c: { accountManagerId: string | null }) => c.accountManagerId)
        .filter((id: string | null): id is string => id !== null);

      const [mmIds, personalIds, banyanIds, linkedClients, accountManagers] = await Promise.all([
        db
          .select({ crmId: contactSubmissions.crmId })
          .from(contactSubmissions)
          .where(inArray(contactSubmissions.crmId, contactIds))
          .groupBy(contactSubmissions.crmId),
        db
          .select({ crmId: personalContactSubmissions.crmId })
          .from(personalContactSubmissions)
          .where(inArray(personalContactSubmissions.crmId, contactIds))
          .groupBy(personalContactSubmissions.crmId),
        db
          .select({ crmId: banyanEarlyAccess.crmId })
          .from(banyanEarlyAccess)
          .where(inArray(banyanEarlyAccess.crmId, contactIds))
          .groupBy(banyanEarlyAccess.crmId),
        db
          .select({
            crmId: clients.crmId,
            id: clients.id,
            slug: clients.slug,
            name: clients.name,
            company: clients.company,
          })
          .from(clients)
          .where(inArray(clients.crmId, contactIds)),
        amIds.length > 0
          ? db
              .select({ id: portalUsers.id, name: portalUsers.name })
              .from(portalUsers)
              .where(inArray(portalUsers.id, amIds))
          : Promise.resolve([]),
      ]);

      const mmSet = new Set(mmIds.map((r: { crmId: string | null }) => r.crmId));
      const personalSet = new Set(personalIds.map((r: { crmId: string | null }) => r.crmId));
      const banyanSet = new Set(banyanIds.map((r: { crmId: string | null }) => r.crmId));
      const clientMap = new Map<string | null, { id: number; slug: string; name: string; company: string | null }>(
        linkedClients.map((c: { crmId: string | null; id: number; slug: string; name: string; company: string | null }) => [c.crmId, { id: c.id, slug: c.slug, name: c.name, company: c.company }])
      );
      const amMap = new Map<string, string>(
        accountManagers.map((am: { id: string; name: string }) => [am.id, am.name])
      );

      const CRM_SOURCE_LABELS: Record<string, string> = {
        referral: "Referral",
        portal: "Portal",
      };

      const contacts = contactRows.map((contact: typeof contactRows[number]) => {
        const submissionSources: string[] = [];
        if (mmSet.has(contact.id)) submissionSources.push("Contact Form · miraclemind.dev/contact");
        if (personalSet.has(contact.id)) submissionSources.push("Contact Form · matthewmiceli.com");
        if (banyanSet.has(contact.id)) submissionSources.push("Early Access Form · miraclemind.dev/banyan");

        // Include the CRM source if it's not already represented by a form submission
        const sourceLabel = CRM_SOURCE_LABELS[contact.source];
        if (sourceLabel && !submissionSources.includes(sourceLabel)) {
          submissionSources.push(sourceLabel);
        }

        const portalClient = clientMap.get(contact.id) ?? null;

        const accountManagerName = contact.accountManagerId
          ? amMap.get(contact.accountManagerId) ?? null
          : null;

        return {
          ...contact,
          name: portalClient?.name ?? contact.name,
          company: portalClient?.company ?? contact.company,
          submissionSources,
          portalClient,
          accountManagerName,
        };
      });

      return {
        contacts,
        total: totalResult[0]?.count ?? 0,
        hasMore: input.offset + input.limit < (totalResult[0]?.count ?? 0),
      };
    }),

  /**
   * Get single contact with related submissions + portal client
   */
  getContact: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const contact = await db
        .select()
        .from(masterCrm)
        .where(eq(masterCrm.id, input.id))
        .limit(1);

      if (!contact[0]) return null;

      const [mmSubmissions, personalSubmissions, banyanSignups, linkedClient, referrer, accountManager] =
        await Promise.all([
          db
            .select()
            .from(contactSubmissions)
            .where(eq(contactSubmissions.crmId, input.id))
            .orderBy(desc(contactSubmissions.createdAt)),
          db
            .select()
            .from(personalContactSubmissions)
            .where(eq(personalContactSubmissions.crmId, input.id))
            .orderBy(desc(personalContactSubmissions.createdAt)),
          db
            .select()
            .from(banyanEarlyAccess)
            .where(eq(banyanEarlyAccess.crmId, input.id))
            .orderBy(desc(banyanEarlyAccess.createdAt)),
          db
            .select()
            .from(clients)
            .where(eq(clients.crmId, input.id))
            .limit(1),
          contact[0].referredBy
            ? db
                .select({ id: masterCrm.id, name: masterCrm.name })
                .from(masterCrm)
                .where(eq(masterCrm.id, contact[0].referredBy))
                .limit(1)
            : Promise.resolve([]),
          contact[0].accountManagerId
            ? db
                .select({ id: portalUsers.id, name: portalUsers.name, email: portalUsers.email, phone: portalUsers.phone })
                .from(portalUsers)
                .where(eq(portalUsers.id, contact[0].accountManagerId))
                .limit(1)
            : Promise.resolve([]),
        ]);

      const portalClient = linkedClient[0] ?? null;

      // Fetch Stripe lifetime spend if client has a Stripe customer ID
      let stripeLifetimeSpend: { totalCents: number; chargeCount: number } | null = null;
      if (portalClient?.stripeCustomerId && stripeLive) {
        try {
          let totalCents = 0;
          let chargeCount = 0;
          let hasMore = true;
          let startingAfter: string | undefined;

          while (hasMore) {
            const charges = await stripeLive.charges.list({
              customer: portalClient.stripeCustomerId,
              limit: 100,
              ...(startingAfter ? { starting_after: startingAfter } : {}),
            });
            for (const charge of charges.data) {
              if (charge.status === "succeeded") {
                totalCents += charge.amount;
                chargeCount++;
              }
            }
            hasMore = charges.has_more;
            if (charges.data.length > 0) {
              startingAfter = charges.data[charges.data.length - 1]!.id;
            }
          }

          stripeLifetimeSpend = { totalCents, chargeCount };
        } catch {
          // Stripe unavailable — return null
        }
      }

      return {
        ...contact[0],
        name: portalClient?.name ?? contact[0].name,
        company: portalClient?.company ?? contact[0].company,
        submissions: {
          miracleMind: mmSubmissions,
          personal: personalSubmissions,
          banyan: banyanSignups,
        },
        portalClient,
        referrer: referrer[0] ?? null,
        accountManager: accountManager[0] ?? null,
        stripeLifetimeSpend,
      };
    }),

  /**
   * Get all distinct tags used across contacts (for tag picker)
   */
  getTagOptions: adminProcedure.query(async () => {
    const result = await db.execute(
      sql`SELECT DISTINCT t as tag FROM master_crm, unnest(tags) AS t WHERE tags IS NOT NULL ORDER BY t`
    );
    return (result as unknown as { tag: string }[]).map((r) => r.tag);
  }),

  getCompanyOptions: adminProcedure.query(async () => {
    const crmResult = await db.execute(
      sql`SELECT DISTINCT company FROM master_crm WHERE company IS NOT NULL AND company != '' ORDER BY company`
    );
    const clientResult = await db.execute(
      sql`SELECT DISTINCT company FROM clients WHERE company IS NOT NULL AND company != '' ORDER BY company`
    );
    const all = new Set<string>();
    for (const row of crmResult as unknown as { company: string }[]) all.add(row.company);
    for (const row of clientResult as unknown as { company: string }[]) all.add(row.company);
    return [...all].sort();
  }),

  /**
   * Create a new master CRM contact (auto-sets createdBy from session)
   */
  createContact: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().nullable().optional(),
        company: z.string().nullable().optional(),
        status: z
          .enum(["lead", "prospect", "client", "inactive", "churned"])
          .default("lead"),
        source: z.string().default("referral"),
        referredBy: z.string().uuid().nullable().optional(),
        referredByExternal: z.string().nullable().optional(),
        accountManagerId: z.string().uuid().nullable().optional(),
        tags: z.array(z.string()).optional(),
        notes: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [created] = await db
        .insert(masterCrm)
        .values({
          ...input,
          createdBy: (ctx as unknown as { profile: { name: string } }).profile.name,
        })
        .returning();
      return created;
    }),

  /**
   * Update a master CRM contact
   */
  updateContact: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z
          .enum(["lead", "prospect", "client", "inactive", "churned"])
          .optional(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().nullable().optional(),
        company: z.string().nullable().optional(),
        source: z.string().optional(),
        referredBy: z.string().uuid().nullable().optional(),
        referredByExternal: z.string().nullable().optional(),
        accountManagerId: z.string().uuid().nullable().optional(),
        createdBy: z.string().nullable().optional(),
        tags: z.array(z.string()).optional(),
        notes: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [updated] = await db
        .update(masterCrm)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(masterCrm.id, id))
        .returning();

      // Sync contact-info fields to linked client (CRM is source of truth)
      const syncFields = ["name", "email", "company", "accountManagerId"] as const;
      const hasSyncField = syncFields.some((f) => f in data);
      if (hasSyncField) {
        const linkedClient = await db
          .select({ id: clients.id })
          .from(clients)
          .where(eq(clients.crmId, id))
          .limit(1);

        if (linkedClient[0]) {
          const clientUpdate: Record<string, unknown> = { updatedAt: new Date() };
          for (const f of syncFields) {
            if (f in data) clientUpdate[f] = data[f as keyof typeof data];
          }
          await db
            .update(clients)
            .set(clientUpdate)
            .where(eq(clients.id, linkedClient[0].id));
        }
      }

      return updated;
    }),

  /**
   * Get leads: Banyan early access signups + contact form submissions
   */
  getLeads: adminProcedure.query(async () => {
    const [banyanLeads, mmLeads, personalLeads] = await Promise.all([
      db
        .select()
        .from(banyanEarlyAccess)
        .orderBy(desc(banyanEarlyAccess.createdAt))
        .limit(50),
      db
        .select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.createdAt))
        .limit(50),
      db
        .select()
        .from(personalContactSubmissions)
        .orderBy(desc(personalContactSubmissions.createdAt))
        .limit(50),
    ]);

    return {
      banyan: banyanLeads,
      miracleMind: mmLeads,
      personal: personalLeads,
    };
  }),

  /**
   * Get source breakdown
   */
  getSourceBreakdown: adminProcedure.query(async () => {
    const sources = await db
      .select({
        source: masterCrm.source,
        count: count(),
      })
      .from(masterCrm)
      .groupBy(masterCrm.source)
      .orderBy(desc(count()));

    return sources;
  }),

  /**
   * Lightweight contact list for dropdowns (e.g. "referred by")
   */
  getContactOptions: adminProcedure.query(async () => {
    return db
      .select({ id: masterCrm.id, name: masterCrm.name, email: masterCrm.email })
      .from(masterCrm)
      .orderBy(masterCrm.name);
  }),

  /**
   * Get company team members (for account manager dropdowns)
   */
  getCompanyTeam: adminProcedure.query(async () => {
    return db
      .select({
        id: portalUsers.id,
        name: portalUsers.name,
        email: portalUsers.email,
        phone: portalUsers.phone,
        companyRoles: portalUsers.companyRoles,
      })
      .from(portalUsers)
      .where(eq(portalUsers.isCompanyMember, true))
      .orderBy(portalUsers.name);
  }),

  /**
   * List team members with optional search and pagination
   */
  getTeamMembers: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const conditions = [eq(portalUsers.isCompanyMember, true)];

      if (input.search) {
        conditions.push(
          or(
            ilike(portalUsers.name, `%${input.search}%`),
            ilike(portalUsers.email, `%${input.search}%`)
          )!
        );
      }

      const where = and(...conditions);

      const [memberRows, totalResult] = await Promise.all([
        db
          .select()
          .from(portalUsers)
          .where(where)
          .orderBy(portalUsers.name)
          .limit(input.limit)
          .offset(input.offset),
        db.select({ count: count() }).from(portalUsers).where(where),
      ]);

      return {
        members: memberRows,
        total: totalResult[0]?.count ?? 0,
        hasMore: input.offset + input.limit < (totalResult[0]?.count ?? 0),
      };
    }),

  /**
   * Create a new team member (company member portal user)
   */
  createTeamMember: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().nullable().optional(),
        companyRoles: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [created] = await db
        .insert(portalUsers)
        .values({
          name: input.name,
          email: input.email,
          phone: input.phone ?? null,
          role: "admin",
          isCompanyMember: true,
          companyRoles: input.companyRoles ?? [],
        })
        .returning();
      return created;
    }),

  /**
   * Update a team member
   */
  updateTeamMember: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().nullable().optional(),
        companyRoles: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [updated] = await db
        .update(portalUsers)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(portalUsers.id, id))
        .returning();
      return updated;
    }),

  /**
   * Mark a Banyan early access lead as contacted
   */
  markBanyanContacted: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(banyanEarlyAccess)
        .set({ contacted: true, updatedAt: new Date() })
        .where(eq(banyanEarlyAccess.id, input.id))
        .returning();
      return updated;
    }),

  /**
   * Monthly contact growth (last 6 months)
   */
  getContactGrowth: adminProcedure.query(async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthly = await db
      .select({
        month: sql<string>`to_char(${masterCrm.createdAt}, 'YYYY-MM')`,
        count: count(),
      })
      .from(masterCrm)
      .where(gte(masterCrm.createdAt, sixMonthsAgo))
      .groupBy(sql`to_char(${masterCrm.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${masterCrm.createdAt}, 'YYYY-MM')`);

    return monthly;
  }),

  /**
   * Mark a contact submission as read
   */
  markSubmissionRead: adminProcedure
    .input(
      z.object({
        id: z.number(),
        type: z.enum(["miracleMind", "personal"]),
      })
    )
    .mutation(async ({ input }) => {
      if (input.type === "miracleMind") {
        const [updated] = await db
          .update(contactSubmissions)
          .set({ read: true })
          .where(eq(contactSubmissions.id, input.id))
          .returning();
        return updated;
      } else {
        const [updated] = await db
          .update(personalContactSubmissions)
          .set({ read: true })
          .where(eq(personalContactSubmissions.id, input.id))
          .returning();
        return updated;
      }
    }),

  /**
   * Check if a CRM contact has a linked client portal record
   */
  checkClientStatus: adminProcedure
    .input(z.object({ crmId: z.string().uuid() }))
    .query(async ({ input }) => {
      const linkedClient = await db
        .select({
          id: clients.id,
          slug: clients.slug,
          status: clients.status,
          name: clients.name,
        })
        .from(clients)
        .where(eq(clients.crmId, input.crmId))
        .limit(1);

      return {
        hasClient: linkedClient.length > 0,
        client: linkedClient[0] ?? undefined,
      };
    }),

  /**
   * Promote a CRM contact to a portal client — creates client record + sets CRM status
   */
  promoteToClient: adminProcedure
    .input(
      z.object({
        crmId: z.string().uuid(),
        slug: z.string().min(1),
        company: z.string().optional(),
        accountManagerId: z.string().uuid().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const contact = await db
        .select()
        .from(masterCrm)
        .where(eq(masterCrm.id, input.crmId))
        .limit(1);

      if (!contact[0]) {
        throw new Error("CRM contact not found");
      }

      // Guard against duplicate client by email
      const existingClient = await db
        .select({ id: clients.id })
        .from(clients)
        .where(eq(clients.email, contact[0].email))
        .limit(1);

      if (existingClient[0]) {
        throw new Error("A client with this email already exists");
      }

      // Create client record
      const [newClient] = await db
        .insert(clients)
        .values({
          crmId: input.crmId,
          name: contact[0].name,
          email: contact[0].email,
          slug: input.slug,
          company: input.company ?? contact[0].company ?? undefined,
          accountManagerId: input.accountManagerId ?? contact[0].accountManagerId ?? undefined,
        })
        .returning();

      // Set CRM status to client
      await db
        .update(masterCrm)
        .set({ status: "client", updatedAt: new Date() })
        .where(eq(masterCrm.id, input.crmId));

      return newClient;
    }),

  /**
   * Demote a client contact — handles portal cleanup + CRM status update
   */
  demoteClient: adminProcedure
    .input(
      z.object({
        crmId: z.string().uuid(),
        newStatus: z.enum(["lead", "prospect", "inactive", "churned"]),
        portalAction: z.enum(["archive", "remove"]),
      })
    )
    .mutation(async ({ input }) => {
      const linkedClient = await db
        .select({ id: clients.id })
        .from(clients)
        .where(eq(clients.crmId, input.crmId))
        .limit(1);

      if (linkedClient[0]) {
        if (input.portalAction === "archive") {
          await db
            .update(clients)
            .set({ status: "inactive", updatedAt: new Date() })
            .where(eq(clients.id, linkedClient[0].id));
        } else {
          await db
            .delete(clients)
            .where(eq(clients.id, linkedClient[0].id));
        }
      }

      const [updated] = await db
        .update(masterCrm)
        .set({ status: input.newStatus, updatedAt: new Date() })
        .where(eq(masterCrm.id, input.crmId))
        .returning();

      return updated;
    }),

  /**
   * Sync portal clients to CRM: link by email, create CRM records for unlinked clients
   */
  syncClientsToCrm: adminProcedure.mutation(async () => {
    const allClients = await db.select().from(clients);

    let linked = 0;
    let created = 0;

    for (const client of allClients) {
      if (client.crmId) continue; // Already linked

      const existing = await db
        .select()
        .from(masterCrm)
        .where(eq(masterCrm.email, client.email))
        .limit(1);

      if (existing[0]) {
        // Link and update status
        await Promise.all([
          db
            .update(clients)
            .set({ crmId: existing[0].id, updatedAt: new Date() })
            .where(eq(clients.id, client.id)),
          db
            .update(masterCrm)
            .set({ status: "client", updatedAt: new Date() })
            .where(eq(masterCrm.id, existing[0].id)),
        ]);
        linked++;
      } else {
        // Create CRM record
        const [newCrm] = await db
          .insert(masterCrm)
          .values({
            email: client.email,
            name: client.name,
            source: "portal",
            status: "client",
          })
          .returning({ id: masterCrm.id });

        if (newCrm) {
          await db
            .update(clients)
            .set({ crmId: newCrm.id, updatedAt: new Date() })
            .where(eq(clients.id, client.id));
          created++;
        }
      }
    }

    return { linked, created, total: allClients.length };
  }),
});

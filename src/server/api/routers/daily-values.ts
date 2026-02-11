import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  coreValues,
  supportingValues,
  quotes,
  authors,
  coreValueQuotes,
  quotePosts,
  pendingPosts,
} from "~/server/db/schema";
import { eq, desc, asc, count, sql, and } from "drizzle-orm";

export const dailyValuesRouter = createTRPCRouter({
  // ============================================================================
  // HEALTH CHECK - Test database connectivity
  // ============================================================================

  healthCheck: publicProcedure.query(async () => {
    try {
      // Simple query to test database connection
      const result = await db.select().from(supportingValues).limit(1);
      return {
        status: "ok",
        database: "connected",
        recordCount: result.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Health check failed:", error);
      throw new Error(
        `Database health check failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }),

  // ============================================================================
  // SUPPORTING VALUES - Full CRUD
  // ============================================================================

  getAllSupportingValues: publicProcedure.query(async () => {
    return await db
      .select()
      .from(supportingValues)
      .orderBy(asc(supportingValues.value));
  }),

  getSupportingValueById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(supportingValues)
        .where(eq(supportingValues.id, input.id))
        .limit(1);
      return result[0];
    }),

  createSupportingValue: protectedProcedure
    .input(
      z.object({
        value: z.string().min(1, "Value name is required"),
      })
    )
    .mutation(async ({ input }) => {
      // Check if value already exists
      const existing = await db
        .select()
        .from(supportingValues)
        .where(eq(supportingValues.value, input.value))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("This value already exists in Supporting Values");
      }

      const id = `sv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const result = await db
        .insert(supportingValues)
        .values({
          id,
          value: input.value,
        })
        .returning();

      return result[0];
    }),

  updateSupportingValue: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        value: z.string().min(1, "Value name is required"),
      })
    )
    .mutation(async ({ input }) => {
      // Check if new value name already exists (excluding current record)
      const existing = await db
        .select()
        .from(supportingValues)
        .where(
          and(
            eq(supportingValues.value, input.value),
            sql`${supportingValues.id} != ${input.id}`
          )
        )
        .limit(1);

      if (existing.length > 0) {
        throw new Error("This value name already exists");
      }

      const result = await db
        .update(supportingValues)
        .set({
          value: input.value,
          updatedAt: new Date(),
        })
        .where(eq(supportingValues.id, input.id))
        .returning();

      return result[0];
    }),

  deleteSupportingValue: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Check if this Supporting Value is used as a Core Value
      const supportingValue = await db
        .select()
        .from(supportingValues)
        .where(eq(supportingValues.id, input.id))
        .limit(1);

      if (!supportingValue[0]) {
        throw new Error("Supporting Value not found");
      }

      const coreValueExists = await db
        .select()
        .from(coreValues)
        .where(eq(coreValues.value, supportingValue[0].value))
        .limit(1);

      if (coreValueExists.length > 0) {
        // Return info about the core value so frontend can show warning
        return {
          requiresConfirmation: true,
          coreValueId: coreValueExists[0].id,
          message: `This value is currently used as a Core Value. Deleting it will also delete the Core Value and all associated quotes and posts. Are you sure?`,
        };
      }

      // Safe to delete
      await db
        .delete(supportingValues)
        .where(eq(supportingValues.id, input.id));

      return { requiresConfirmation: false, deleted: true };
    }),

  confirmDeleteSupportingValue: protectedProcedure
    .input(z.object({ id: z.string(), coreValueId: z.string() }))
    .mutation(async ({ input }) => {
      // Delete Core Value first (cascade will handle quotes and posts)
      await db.delete(coreValues).where(eq(coreValues.id, input.coreValueId));

      // Then delete Supporting Value
      await db
        .delete(supportingValues)
        .where(eq(supportingValues.id, input.id));

      return { deleted: true };
    }),

  // ============================================================================
  // CORE VALUES - Full CRUD
  // ============================================================================

  getAllCoreValues: publicProcedure.query(async () => {
    return await db.select().from(coreValues).orderBy(asc(coreValues.value));
  }),

  getCoreValueById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(coreValues)
        .where(eq(coreValues.id, input.id))
        .limit(1);
      return result[0];
    }),

  createCoreValue: protectedProcedure
    .input(
      z.object({
        value: z.string().min(1, "Value name is required"),
        description: z
          .string()
          .min(10, "Description must be at least 10 characters"),
        fromSupportingValueId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Check if value already exists as Core Value
      const existingCore = await db
        .select()
        .from(coreValues)
        .where(eq(coreValues.value, input.value))
        .limit(1);

      if (existingCore.length > 0) {
        throw new Error("This value already exists as a Core Value");
      }

      // If creating from Supporting Value, use that value
      // Otherwise, create new Supporting Value first
      if (!input.fromSupportingValueId) {
        // Check if value exists in Supporting Values
        const existingSupporting = await db
          .select()
          .from(supportingValues)
          .where(eq(supportingValues.value, input.value))
          .limit(1);

        if (existingSupporting.length === 0) {
          // Create new Supporting Value
          const svId = `sv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await db.insert(supportingValues).values({
            id: svId,
            value: input.value,
          });
        }
      }

      // Create Core Value
      const id = `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const result = await db
        .insert(coreValues)
        .values({
          id,
          value: input.value,
          description: input.description,
        })
        .returning();

      return result[0];
    }),

  updateCoreValue: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        value: z.string().min(1, "Value name is required").optional(),
        description: z
          .string()
          .min(10, "Description must be at least 10 characters")
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updates: Partial<{
        value: string;
        description: string;
        updatedAt: Date;
      }> = {
        updatedAt: new Date(),
      };

      if (input.value) {
        // Check if new value name already exists (excluding current record)
        const existing = await db
          .select()
          .from(coreValues)
          .where(
            and(
              eq(coreValues.value, input.value),
              sql`${coreValues.id} != ${input.id}`
            )
          )
          .limit(1);

        if (existing.length > 0) {
          throw new Error("This value name already exists as a Core Value");
        }

        updates.value = input.value;
      }

      if (input.description) {
        updates.description = input.description;
      }

      const result = await db
        .update(coreValues)
        .set(updates)
        .where(eq(coreValues.id, input.id))
        .returning();

      return result[0];
    }),

  deleteCoreValue: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Cascade delete will handle coreValueQuotes and quotePosts
      await db.delete(coreValues).where(eq(coreValues.id, input.id));
      return { deleted: true };
    }),

  // Get Supporting Values that are NOT already Core Values (for dropdown)
  getAvailableSupportingValues: publicProcedure.query(async () => {
    const allSupporting = await db
      .select()
      .from(supportingValues)
      .orderBy(asc(supportingValues.value));

    const allCore = await db.select().from(coreValues);

    const coreValueNames = new Set(
      allCore.map((cv: typeof coreValues.$inferSelect) => cv.value)
    );

    return allSupporting.filter(
      (sv: typeof supportingValues.$inferSelect) =>
        !coreValueNames.has(sv.value)
    );
  }),

  // ============================================================================
  // AUTHORS - Full CRUD
  // ============================================================================

  getAllAuthors: publicProcedure.query(async () => {
    return await db.select().from(authors).orderBy(asc(authors.name));
  }),

  getAuthorsWithQuoteCounts: publicProcedure.query(async () => {
    const authorsWithCounts = await db
      .select({
        id: authors.id,
        name: authors.name,
        quoteCount: count(quotes.id),
      })
      .from(authors)
      .leftJoin(quotes, eq(quotes.authorId, authors.id))
      .groupBy(authors.id)
      .orderBy(asc(authors.name));

    return authorsWithCounts;
  }),

  getAuthorById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(authors)
        .where(eq(authors.id, input.id))
        .limit(1);
      return result[0];
    }),

  createAuthor: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Author name is required"),
      })
    )
    .mutation(async ({ input }) => {
      const id = `au_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const result = await db
        .insert(authors)
        .values({
          id,
          name: input.name,
        })
        .returning();

      return result[0];
    }),

  updateAuthor: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Author name is required"),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db
        .update(authors)
        .set({
          name: input.name,
          updatedAt: new Date(),
        })
        .where(eq(authors.id, input.id))
        .returning();

      return result[0];
    }),

  deleteAuthor: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Check if author has quotes
      const quotesCount = await db
        .select({ count: count() })
        .from(quotes)
        .where(eq(quotes.authorId, input.id));

      if (quotesCount[0] && quotesCount[0].count > 0) {
        throw new Error(
          `Cannot delete author with ${quotesCount[0].count} quotes. Delete quotes first.`
        );
      }

      await db.delete(authors).where(eq(authors.id, input.id));
      return { deleted: true };
    }),

  // ============================================================================
  // QUOTES - Full CRUD with Core Value associations
  // ============================================================================

  getAllQuotes: publicProcedure.query(async () => {
    const result = await db
      .select({
        id: quotes.id,
        text: quotes.text,
        source: quotes.source,
        category: quotes.category,
        tags: quotes.tags,
        createdAt: quotes.createdAt,
        updatedAt: quotes.updatedAt,
        authorId: quotes.authorId,
        authorName: authors.name,
      })
      .from(quotes)
      .leftJoin(authors, eq(quotes.authorId, authors.id))
      .orderBy(desc(quotes.createdAt));

    return result;
  }),

  getQuoteById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: quotes.id,
          text: quotes.text,
          source: quotes.source,
          category: quotes.category,
          tags: quotes.tags,
          createdAt: quotes.createdAt,
          updatedAt: quotes.updatedAt,
          authorId: quotes.authorId,
          authorName: authors.name,
        })
        .from(quotes)
        .leftJoin(authors, eq(quotes.authorId, authors.id))
        .where(eq(quotes.id, input.id))
        .limit(1);

      return result[0];
    }),

  createQuote: protectedProcedure
    .input(
      z.object({
        text: z.string().min(5, "Quote text must be at least 5 characters"),
        authorId: z.string().optional(),
        source: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        coreValueIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const id = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const result = await db
        .insert(quotes)
        .values({
          id,
          text: input.text,
          authorId: input.authorId ?? null,
          source: input.source ?? null,
          category: input.category ?? null,
          tags: input.tags ?? null,
        })
        .returning();

      // Associate with Core Values if provided
      if (input.coreValueIds && input.coreValueIds.length > 0) {
        const associations = input.coreValueIds.map((coreValueId) => ({
          id: `cvq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          coreValueId,
          quoteId: id,
        }));

        await db.insert(coreValueQuotes).values(associations);
      }

      return result[0];
    }),

  updateQuote: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z
          .string()
          .min(5, "Quote text must be at least 5 characters")
          .optional(),
        authorId: z.string().nullable().optional(),
        source: z.string().nullable().optional(),
        category: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updates: Partial<{
        text: string;
        authorId: string | null;
        source: string | null;
        category: string | null;
        tags: string[] | null;
        updatedAt: Date;
      }> = {
        updatedAt: new Date(),
      };

      if (input.text) updates.text = input.text;
      if (input.authorId !== undefined) updates.authorId = input.authorId;
      if (input.source !== undefined) updates.source = input.source;
      if (input.category !== undefined) updates.category = input.category;
      if (input.tags !== undefined) updates.tags = input.tags;

      const result = await db
        .update(quotes)
        .set(updates)
        .where(eq(quotes.id, input.id))
        .returning();

      return result[0];
    }),

  deleteQuote: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Cascade delete will handle coreValueQuotes and quotePosts
      await db.delete(quotes).where(eq(quotes.id, input.id));
      return { deleted: true };
    }),

  // Associate/Disassociate Quote with Core Values
  associateQuoteWithCoreValue: protectedProcedure
    .input(
      z.object({
        quoteId: z.string(),
        coreValueId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Check if association already exists
      const existing = await db
        .select()
        .from(coreValueQuotes)
        .where(
          and(
            eq(coreValueQuotes.quoteId, input.quoteId),
            eq(coreValueQuotes.coreValueId, input.coreValueId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return existing[0];
      }

      const id = `cvq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const result = await db
        .insert(coreValueQuotes)
        .values({
          id,
          quoteId: input.quoteId,
          coreValueId: input.coreValueId,
        })
        .returning();

      return result[0];
    }),

  disassociateQuoteFromCoreValue: protectedProcedure
    .input(
      z.object({
        quoteId: z.string(),
        coreValueId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .delete(coreValueQuotes)
        .where(
          and(
            eq(coreValueQuotes.quoteId, input.quoteId),
            eq(coreValueQuotes.coreValueId, input.coreValueId)
          )
        );

      return { deleted: true };
    }),

  // Get Core Values associated with a Quote
  getCoreValuesByQuote: publicProcedure
    .input(z.object({ quoteId: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: coreValues.id,
          value: coreValues.value,
          description: coreValues.description,
        })
        .from(coreValueQuotes)
        .innerJoin(coreValues, eq(coreValueQuotes.coreValueId, coreValues.id))
        .where(eq(coreValueQuotes.quoteId, input.quoteId));

      return result;
    }),

  // Update Core Value associations for a Quote (replaces all associations)
  updateQuoteCoreValues: protectedProcedure
    .input(
      z.object({
        quoteId: z.string(),
        coreValueIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      // Delete all existing associations
      await db
        .delete(coreValueQuotes)
        .where(eq(coreValueQuotes.quoteId, input.quoteId));

      // Add new associations
      if (input.coreValueIds.length > 0) {
        const associations = input.coreValueIds.map((coreValueId) => ({
          id: `cvq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          coreValueId,
          quoteId: input.quoteId,
        }));

        await db.insert(coreValueQuotes).values(associations);
      }

      return { success: true };
    }),

  // ============================================================================
  // LEGACY QUERIES (Updated for new schema)
  // ============================================================================

  getQuotesByCore: publicProcedure
    .input(z.object({ coreValueId: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: quotes.id,
          text: quotes.text,
          authorName: authors.name,
        })
        .from(coreValueQuotes)
        .innerJoin(quotes, eq(coreValueQuotes.quoteId, quotes.id))
        .leftJoin(authors, eq(quotes.authorId, authors.id))
        .where(eq(coreValueQuotes.coreValueId, input.coreValueId));

      return result;
    }),

  getPostQueue: publicProcedure.query(async () => {
    const result = await db
      .select({
        id: quotePosts.id,
        coreValueId: quotePosts.coreValueId,
        quoteId: quotePosts.quoteId,
        isPublished: quotePosts.isPublished,
        publishedAt: quotePosts.publishedAt,
        scheduledFor: quotePosts.scheduledFor,
        queuePosition: quotePosts.queuePosition,
        caption: quotePosts.caption,
        imageUrl: quotePosts.imageUrl,
        createdAt: quotePosts.createdAt,
      })
      .from(quotePosts)
      .orderBy(asc(quotePosts.queuePosition));

    return result;
  }),

  getStats: publicProcedure.query(async () => {
    const [coreValuesCount] = await db
      .select({ count: count() })
      .from(coreValues);

    const [supportingValuesCount] = await db
      .select({ count: count() })
      .from(supportingValues);

    const [quotesCount] = await db.select({ count: count() }).from(quotes);

    const [authorsCount] = await db.select({ count: count() }).from(authors);

    const [queueCount] = await db
      .select({ count: count() })
      .from(quotePosts)
      .where(eq(quotePosts.isPublished, "false"));

    return {
      coreValues: Number(coreValuesCount?.count ?? 0),
      supportingValues: Number(supportingValuesCount?.count ?? 0),
      quotes: Number(quotesCount?.count ?? 0),
      authors: Number(authorsCount?.count ?? 0),
      queueSize: Number(queueCount?.count ?? 0),
    };
  }),

  getRandomCombination: publicProcedure.query(async () => {
    // Get all core values
    const allCoreValues = await db.select().from(coreValues);

    if (allCoreValues.length === 0) {
      throw new Error("No core values found");
    }

    // Pick a random core value
    const randomCoreValue =
      allCoreValues[Math.floor(Math.random() * allCoreValues.length)];

    // Get quotes related to this core value
    let relatedQuotes = await db
      .select({
        id: quotes.id,
        text: quotes.text,
        authorId: quotes.authorId,
        source: quotes.source,
        category: quotes.category,
        tags: quotes.tags,
        authorName: authors.name,
      })
      .from(coreValueQuotes)
      .innerJoin(quotes, eq(coreValueQuotes.quoteId, quotes.id))
      .leftJoin(authors, eq(quotes.authorId, authors.id))
      .where(eq(coreValueQuotes.coreValueId, randomCoreValue!.id));

    // If no related quotes, fall back to any quote
    let selectedQuote;
    if (relatedQuotes.length > 0) {
      selectedQuote =
        relatedQuotes[Math.floor(Math.random() * relatedQuotes.length)];
    } else {
      const allQuotes = await db
        .select({
          id: quotes.id,
          text: quotes.text,
          authorId: quotes.authorId,
          source: quotes.source,
          category: quotes.category,
          tags: quotes.tags,
          authorName: authors.name,
        })
        .from(quotes)
        .leftJoin(authors, eq(quotes.authorId, authors.id));

      if (allQuotes.length === 0) {
        throw new Error("No quotes found");
      }

      selectedQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    }

    return {
      coreValue: randomCoreValue,
      quote: selectedQuote,
    };
  }),

  // ============================================================================
  // QUEUE MANAGEMENT ENDPOINTS
  // ============================================================================

  /**
   * Fill Queue - Add random posts to fill up to 10 items
   * Prevents duplicate quotes and exact duplicates
   */
  fillQueue: protectedProcedure.mutation(async () => {
    const QUEUE_LIMIT = 10;

    // Get current queue
    const currentQueue = await db
      .select()
      .from(quotePosts)
      .orderBy(asc(quotePosts.queuePosition));

    const spotsToFill = QUEUE_LIMIT - currentQueue.length;

    if (spotsToFill <= 0) {
      return {
        success: false,
        message: "Queue is already full",
        filled: 0,
      };
    }

    // Get existing quote IDs to prevent duplicates
    const existingQuoteIds = new Set(
      currentQueue.map((p: { quoteId: string }) => p.quoteId)
    );

    // Get all available core values and quotes
    const allCoreValues = await db.select().from(coreValues);
    const allQuotes = await db
      .select({
        id: quotes.id,
        text: quotes.text,
        authorId: quotes.authorId,
      })
      .from(quotes)
      .leftJoin(authors, eq(quotes.authorId, authors.id));

    if (allCoreValues.length === 0 || allQuotes.length === 0) {
      throw new Error("No core values or quotes available");
    }

    // Filter out quotes already in queue
    const availableQuotes = allQuotes.filter(
      (q: { id: string }) => !existingQuoteIds.has(q.id)
    );

    if (availableQuotes.length < spotsToFill) {
      throw new Error(
        `Not enough unique quotes. Need ${spotsToFill}, have ${availableQuotes.length}`
      );
    }

    // Generate random combinations
    const newPosts = [];
    const usedQuoteIds = new Set<string>();

    for (let i = 0; i < spotsToFill; i++) {
      // Pick random core value
      const randomCoreValue =
        allCoreValues[Math.floor(Math.random() * allCoreValues.length)];

      // Pick random quote that hasn't been used yet
      let randomQuote;
      let attempts = 0;
      do {
        randomQuote =
          availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
        attempts++;
        if (attempts > 100) {
          throw new Error("Could not find unique quote combination");
        }
      } while (usedQuoteIds.has(randomQuote!.id));

      usedQuoteIds.add(randomQuote!.id);

      // Create post with Black and Gold theme as default
      const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const queuePosition = String(currentQueue.length + i + 1).padStart(
        2,
        "0"
      );

      newPosts.push({
        id: postId,
        coreValueId: randomCoreValue!.id,
        quoteId: randomQuote!.id,
        isPublished: "false",
        queuePosition,
        caption: null,
        imageUrl: null,
        publishedAt: null,
        scheduledFor: null,
        metaPostId: null,
      });
    }

    // Insert all new posts
    if (newPosts.length > 0) {
      await db.insert(quotePosts).values(newPosts);
    }

    return {
      success: true,
      message: `Added ${newPosts.length} posts to queue`,
      filled: newPosts.length,
    };
  }),

  /**
   * Pop Queue - Remove first item and reorder remaining
   */
  popQueue: protectedProcedure.mutation(async () => {
    // Get first item in queue
    const firstItem = await db
      .select()
      .from(quotePosts)
      .orderBy(asc(quotePosts.queuePosition))
      .limit(1);

    if (firstItem.length === 0) {
      return {
        success: false,
        message: "Queue is empty",
      };
    }

    // Delete first item
    await db.delete(quotePosts).where(eq(quotePosts.id, firstItem[0]!.id));

    // Get remaining items
    const remaining = await db
      .select()
      .from(quotePosts)
      .orderBy(asc(quotePosts.queuePosition));

    // Update positions (shift down)
    for (let i = 0; i < remaining.length; i++) {
      await db
        .update(quotePosts)
        .set({ queuePosition: String(i + 1).padStart(2, "0") })
        .where(eq(quotePosts.id, remaining[i]!.id));
    }

    return {
      success: true,
      message: "Popped first item from queue",
      poppedId: firstItem[0]!.id,
    };
  }),

  /**
   * Enqueue - Add one random item to end (if < 10)
   */
  enqueuePost: protectedProcedure.mutation(async () => {
    const QUEUE_LIMIT = 10;

    // Get current queue
    const currentQueue = await db
      .select()
      .from(quotePosts)
      .orderBy(asc(quotePosts.queuePosition));

    if (currentQueue.length >= QUEUE_LIMIT) {
      return {
        success: false,
        message: "Queue is full (10 items)",
      };
    }

    // Get existing quote IDs to prevent duplicates
    const existingQuoteIds = new Set(
      currentQueue.map((p: { quoteId: string }) => p.quoteId)
    );

    // Get all available core values and quotes
    const allCoreValues = await db.select().from(coreValues);
    const allQuotes = await db.select().from(quotes);

    if (allCoreValues.length === 0 || allQuotes.length === 0) {
      throw new Error("No core values or quotes available");
    }

    // Filter out quotes already in queue
    const availableQuotes = allQuotes.filter(
      (q: { id: string }) => !existingQuoteIds.has(q.id)
    );

    if (availableQuotes.length === 0) {
      throw new Error("No unique quotes available");
    }

    // Pick random core value and quote
    const randomCoreValue =
      allCoreValues[Math.floor(Math.random() * allCoreValues.length)];
    const randomQuote =
      availableQuotes[Math.floor(Math.random() * availableQuotes.length)];

    // Create new post
    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const queuePosition = String(currentQueue.length + 1).padStart(2, "0");

    await db.insert(quotePosts).values({
      id: postId,
      coreValueId: randomCoreValue!.id,
      quoteId: randomQuote!.id,
      isPublished: "false",
      queuePosition,
      caption: null,
      imageUrl: null,
      publishedAt: null,
      scheduledFor: null,
      metaPostId: null,
    });

    return {
      success: true,
      message: "Added item to queue",
      postId,
    };
  }),

  /**
   * Rotate Queue - Pop first item and enqueue new one
   */
  rotateQueue: protectedProcedure.mutation(async () => {
    const QUEUE_LIMIT = 10;

    // Get first item
    const firstItem = await db
      .select()
      .from(quotePosts)
      .orderBy(asc(quotePosts.queuePosition))
      .limit(1);

    if (firstItem.length === 0) {
      return {
        success: false,
        message: "Queue is empty, cannot rotate",
      };
    }

    // Delete first item
    await db.delete(quotePosts).where(eq(quotePosts.id, firstItem[0]!.id));

    // Get remaining items
    const remaining = await db
      .select()
      .from(quotePosts)
      .orderBy(asc(quotePosts.queuePosition));

    // Update positions (shift down)
    for (let i = 0; i < remaining.length; i++) {
      await db
        .update(quotePosts)
        .set({ queuePosition: String(i + 1).padStart(2, "0") })
        .where(eq(quotePosts.id, remaining[i]!.id));
    }

    // Now enqueue a new item
    const currentQueue = await db
      .select()
      .from(quotePosts)
      .orderBy(asc(quotePosts.queuePosition));

    if (currentQueue.length >= QUEUE_LIMIT) {
      return {
        success: true,
        message: "Rotated queue (popped but queue full, did not enqueue)",
        poppedId: firstItem[0]!.id,
      };
    }

    // Get existing quote IDs to prevent duplicates
    const existingQuoteIds = new Set(
      currentQueue.map((p: { quoteId: string }) => p.quoteId)
    );

    // Get all available core values and quotes
    const allCoreValues = await db.select().from(coreValues);
    const allQuotes = await db.select().from(quotes);

    // Filter out quotes already in queue
    const availableQuotes = allQuotes.filter(
      (q: { id: string }) => !existingQuoteIds.has(q.id)
    );

    if (availableQuotes.length === 0) {
      return {
        success: true,
        message: "Rotated queue (popped but no unique quotes available)",
        poppedId: firstItem[0]!.id,
      };
    }

    // Pick random core value and quote
    const randomCoreValue =
      allCoreValues[Math.floor(Math.random() * allCoreValues.length)];
    const randomQuote =
      availableQuotes[Math.floor(Math.random() * availableQuotes.length)];

    // Create new post
    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const queuePosition = String(currentQueue.length + 1).padStart(2, "0");

    await db.insert(quotePosts).values({
      id: postId,
      coreValueId: randomCoreValue!.id,
      quoteId: randomQuote!.id,
      isPublished: "false",
      queuePosition,
      caption: null,
      imageUrl: null,
      publishedAt: null,
      scheduledFor: null,
      metaPostId: null,
    });

    return {
      success: true,
      message: "Rotated queue successfully",
      poppedId: firstItem[0]!.id,
      enqueuedId: postId,
    };
  }),

  /**
   * Delete Queue Item - Delete specific item and reorder
   */
  deleteQueueItem: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Delete the item
      await db.delete(quotePosts).where(eq(quotePosts.id, input.id));

      // Get remaining items
      const remaining = await db
        .select()
        .from(quotePosts)
        .orderBy(asc(quotePosts.queuePosition));

      // Update positions
      for (let i = 0; i < remaining.length; i++) {
        await db
          .update(quotePosts)
          .set({ queuePosition: String(i + 1).padStart(2, "0") })
          .where(eq(quotePosts.id, remaining[i]!.id));
      }

      return {
        success: true,
        message: "Item deleted from queue",
      };
    }),

  /**
   * Clear Queue - Delete all items in queue
   */
  clearQueue: protectedProcedure.mutation(async () => {
    await db.delete(quotePosts);

    return {
      success: true,
      message: "Queue cleared successfully",
    };
  }),

  /**
   * Update Queue Item - Update value/quote for a specific queue item
   */
  updateQueueItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        coreValueId: z.string().optional(),
        quoteId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: {
        coreValueId?: string;
        quoteId?: string;
      } = {};

      if (input.coreValueId) updateData.coreValueId = input.coreValueId;
      if (input.quoteId) updateData.quoteId = input.quoteId;

      await db
        .update(quotePosts)
        .set(updateData)
        .where(eq(quotePosts.id, input.id));

      return {
        success: true,
        message: "Queue item updated",
      };
    }),

  // ============================================================================
  // PENDING POSTS - Buffer station for scheduled Instagram posts
  // ============================================================================

  /**
   * Get Current Pending Post - Retrieve the active pending post
   */
  getCurrentPendingPost: publicProcedure.query(async () => {
    const result = await db
      .select()
      .from(pendingPosts)
      .where(eq(pendingPosts.id, "current"))
      .limit(1);

    return result[0] ?? null;
  }),

  /**
   * Upsert Pending Post - Create or update the pending post (singleton pattern)
   */
  upsertPendingPost: protectedProcedure
    .input(
      z.object({
        zapierPayload: z.string(), // JSON stringified payload
        scheduledFor: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      // Upsert with fixed id='current'
      const result = await db
        .insert(pendingPosts)
        .values({
          id: "current",
          zapierPayload: input.zapierPayload,
          scheduledFor: input.scheduledFor,
          status: "pending",
        })
        .onConflictDoUpdate({
          target: pendingPosts.id,
          set: {
            zapierPayload: input.zapierPayload,
            scheduledFor: input.scheduledFor,
            status: "pending",
            createdAt: new Date(),
            sentAt: null,
          },
        })
        .returning();

      return result[0];
    }),

  /**
   * Update Pending Post Status - Mark as sent/failed
   */
  updatePendingPostStatus: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "sent"]),
        sentAt: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: {
        status: string;
        sentAt?: Date | null;
      } = {
        status: input.status,
      };

      if (input.sentAt) {
        updateData.sentAt = input.sentAt;
      }

      const result = await db
        .update(pendingPosts)
        .set(updateData)
        .where(eq(pendingPosts.id, "current"))
        .returning();

      return result[0];
    }),

  /**
   * Delete Pending Post - Remove the current pending post
   */
  deletePendingPost: protectedProcedure.mutation(async () => {
    await db.delete(pendingPosts).where(eq(pendingPosts.id, "current"));
    return { success: true };
  }),
});

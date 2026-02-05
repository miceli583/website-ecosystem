import { postRouter } from "~/server/api/routers/post";
import { dailyValuesRouter } from "~/server/api/routers/dailyValues";
import { clientsRouter } from "~/server/api/routers/clients";
import { contactRouter } from "~/server/api/routers/contact";
import { portalRouter } from "~/server/api/routers/portal";
import { portalNotesRouter } from "~/server/api/routers/portalNotes";
import { financeRouter } from "~/server/api/routers/finance";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  dailyValues: dailyValuesRouter,
  clients: clientsRouter,
  contact: contactRouter,
  portal: portalRouter,
  portalNotes: portalNotesRouter,
  finance: financeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

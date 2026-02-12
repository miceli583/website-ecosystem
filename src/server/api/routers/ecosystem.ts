import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { promises as fs } from "fs";
import path from "path";

interface ScannedRoute {
  path: string;
  domain: "all" | "matthew" | "dev" | "live";
  access: "public" | "auth" | "admin";
  status: "live";
  type: "page" | "api";
}

const APP_DIR = path.join(process.cwd(), "src/app");

/**
 * Recursively scan src/app/ for page.tsx and route.ts files,
 * converting directory structure to Next.js route paths.
 */
async function scanAppDirectory(dir: string, basePath = ""): Promise<ScannedRoute[]> {
  const routes: ScannedRoute[] = [];

  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return routes;
  }

  const hasPage = entries.some((e) => e.isFile() && e.name === "page.tsx");
  const hasRoute = entries.some((e) => e.isFile() && e.name === "route.ts");

  if (hasPage) {
    routes.push({
      ...inferMetadata(basePath || "/"),
      path: basePath || "/",
      type: "page",
    });
  }

  if (hasRoute) {
    routes.push({
      ...inferMetadata(basePath || "/"),
      path: basePath || "/",
      type: "api",
    });
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    // Skip Next.js special dirs
    if (entry.name.startsWith("_")) continue;

    // Convert directory name to route segment
    const segment = entry.name
      .replace(/^\(.*\)$/, "") // remove route groups like (auth)
      .replace(/^\[{2}\.{3}(.*)\]{2}$/, "[[...$1]]") // catch-all
      .replace(/^\[\.{3}(.*)\]$/, "[...$1]") // rest params
      .replace(/^\[(.*)\]$/, "[$1]"); // dynamic segments

    // Route groups contribute no path segment
    const nextPath = segment === "" ? basePath : `${basePath}/${segment}`;
    const subRoutes = await scanAppDirectory(path.join(dir, entry.name), nextPath);
    routes.push(...subRoutes);
  }

  return routes;
}

/**
 * Infer domain, access, and status from the route path.
 */
function inferMetadata(routePath: string): Pick<ScannedRoute, "domain" | "access" | "status"> {
  // Admin routes
  if (routePath.startsWith("/admin")) {
    if (routePath === "/admin/login") {
      return { domain: "all", access: "public", status: "live" };
    }
    return { domain: "all", access: "admin", status: "live" };
  }

  // Portal routes
  if (routePath.startsWith("/portal")) {
    if (routePath === "/portal/set-password") {
      return { domain: "live", access: "public", status: "live" };
    }
    return { domain: "live", access: "auth", status: "live" };
  }

  // API routes
  if (routePath.startsWith("/api")) {
    return { domain: "all", access: "public", status: "live" };
  }

  // Miracle Mind dev routes
  const devRoutes = ["/services", "/stewardship", "/contact", "/blog", "/banyan"];
  if (devRoutes.some((r) => routePath === r || routePath.startsWith(r + "/"))) {
    return { domain: "dev", access: "public", status: "live" };
  }

  // Matthew personal routes
  const matthewRoutes = ["/playground", "/templates", "/resume", "/about"];
  if (matthewRoutes.some((r) => routePath === r || routePath.startsWith(r + "/"))) {
    return { domain: "matthew", access: "public", status: "live" };
  }

  // Auth routes
  if (routePath.startsWith("/auth")) {
    return { domain: "all", access: "public", status: "live" };
  }

  return { domain: "all", access: "public", status: "live" };
}

export const ecosystemRouter = createTRPCRouter({
  scanRoutes: adminProcedure.query(async () => {
    const scanned = await scanAppDirectory(APP_DIR);
    return scanned.sort((a, b) => a.path.localeCompare(b.path));
  }),
});

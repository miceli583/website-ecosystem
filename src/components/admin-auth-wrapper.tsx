/**
 * @deprecated This component is no longer needed.
 * Authentication is now handled globally by middleware (src/middleware.ts).
 * All /admin/* routes are automatically protected - no need to wrap pages.
 *
 * This file is kept for reference but should not be used in new code.
 */

import { createClient } from "~/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export async function AdminAuthWrapper({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}

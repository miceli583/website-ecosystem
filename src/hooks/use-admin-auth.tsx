"use client";

/**
 * @deprecated This hook is no longer needed.
 * Authentication is now handled globally by middleware (src/middleware.ts).
 * All /admin/* routes are automatically protected - no need to call this hook.
 *
 * This file is kept for reference but should not be used in new code.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "~/lib/supabase/client";

export function useAdminAuth() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);
}

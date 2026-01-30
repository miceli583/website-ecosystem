"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PortalClientPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  useEffect(() => {
    // Redirect to demos page (first tab)
    router.replace(`/portal/${slug}/demos?domain=live`);
  }, [slug, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
    </div>
  );
}

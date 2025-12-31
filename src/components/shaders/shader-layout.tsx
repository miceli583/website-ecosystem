"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useSearchParams, usePathname } from "next/navigation";

interface ShaderLayoutProps {
  children: React.ReactNode;
}

function ShaderLayoutContent({ children }: ShaderLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const domainParam = domain ? `?domain=${domain}` : "";

  // Detect if we're in admin or public shaders
  const isAdminShaders = pathname.startsWith("/admin/shaders");
  const backPath = isAdminShaders ? "/admin/shaders" : "/shaders";

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Fullscreen shader content */}
      {children}

      {/* Floating back button at top left */}
      <Link
        href={`${backPath}${domainParam}`}
        className="fixed top-6 left-6 z-50"
      >
        <Button
          size="lg"
          className="shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)',
            color: '#000000'
          }}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
      </Link>
    </div>
  );
}

export function ShaderLayout(props: ShaderLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ShaderLayoutContent {...props} />
    </Suspense>
  );
}

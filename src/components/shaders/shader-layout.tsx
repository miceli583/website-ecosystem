"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useSearchParams } from "next/navigation";

interface ShaderLayoutProps {
  children: React.ReactNode;
}

export function ShaderLayout({ children }: ShaderLayoutProps) {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const domainParam = domain ? `?domain=${domain}` : "";

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Fullscreen shader content */}
      {children}

      {/* Floating back button at bottom left */}
      <Link href={`/admin/shaders${domainParam}`} className="fixed bottom-8 left-8 z-50">
        <Button
          variant="secondary"
          size="lg"
          className="group shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:shadow-xl"
        >
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Back to Gallery
        </Button>
      </Link>
    </div>
  );
}

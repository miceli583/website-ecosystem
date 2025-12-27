"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface BackButtonProps {
  href?: string;
  label?: string;
}

function BackButtonContent({
  href = "/",
  label = "Back to Hub",
}: BackButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const domainParam = domain ? `?domain=${domain}` : "";

  const handleClick = () => {
    if (href) {
      router.push(`${href}${domainParam}`);
    } else {
      router.back();
    }
  };

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="fixed bottom-6 left-6 z-50 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
      aria-label={label}
    >
      <Home className="mr-2 h-5 w-5" />
      {label}
    </Button>
  );
}

export function BackButton(props: BackButtonProps) {
  return (
    <Suspense
      fallback={
        <Button
          size="lg"
          className="fixed bottom-6 left-6 z-50 shadow-xl"
          disabled
        >
          <Home className="mr-2 h-5 w-5" />
          {props.label || "Back to Hub"}
        </Button>
      }
    >
      <BackButtonContent {...props} />
    </Suspense>
  );
}

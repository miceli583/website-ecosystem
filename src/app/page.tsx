"use client";
import { Suspense } from "react";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDomainConfig, DOMAINS } from "~/lib/domains";
import { DomainLayout } from "~/components/domain-layout";
import { MatthewHomePage } from "~/components/pages/matthew-home";
import { MiracleMindLiveHomePage } from "~/components/pages/miraclemind-live-home";
import { MiracleMindDevHomePage } from "~/components/pages/miraclemind-dev-home";

function HomePageContent() {
  const [mounted, setMounted] = useState(false);
  const [hostname, setHostname] = useState("");
  const searchParams = useSearchParams();
  const domainParam = searchParams.get("domain");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setHostname(window.location.hostname);
    }
  }, []);

  if (!mounted) {
    return (
      <DomainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground animate-pulse">Loading...</div>
        </div>
      </DomainLayout>
    );
  }

  const domainConfig = getDomainConfig(hostname);

  // Determine which page to render based on domain
  function isMatthewDomain() {
    // Handle localhost with domain parameter
    if (hostname.includes("localhost")) {
      return !domainParam || domainParam === "matthew";
    }

    // Handle production domains
    return hostname.includes("matthewmiceli.com");
  }

  function renderDomainPage() {
    // Handle localhost with domain parameter
    if (hostname.includes("localhost")) {
      switch (domainParam) {
        case "matthew":
          return <MatthewHomePage />;
        case "live":
          return <MiracleMindLiveHomePage />; // Keep for testing
        case "dev":
          return <MiracleMindLiveHomePage />; // NOW SERVES COMPANY CONTENT
        default:
          return <MatthewHomePage />; // Default for localhost
      }
    }

    // Handle production domains
    if (hostname.includes("matthewmiceli.com")) {
      return <MatthewHomePage />;
    } else if (hostname.includes("miraclemind.live")) {
      return <MiracleMindLiveHomePage />; // Will redirect soon
    } else if (hostname.includes("miraclemind.dev")) {
      return <MiracleMindLiveHomePage />; // NOW SERVES COMPANY CONTENT
    }

    // Default fallback
    return <MatthewHomePage />;
  }

  // Matthew's personal page doesn't use the DomainLayout (no nav/footer)
  if (isMatthewDomain()) {
    return renderDomainPage();
  }

  // Other domains use the layout
  return <DomainLayout hostname={hostname}>{renderDomainPage()}</DomainLayout>;
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

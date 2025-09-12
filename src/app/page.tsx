"use client";

import { useEffect, useState } from "react";
import { getDomainConfig, DOMAINS } from "~/lib/domains";
import { DomainLayout } from "~/components/domain-layout";
import { MatthewHomePage } from "~/components/pages/matthew-home";
import { MiracleMindLiveHomePage } from "~/components/pages/miraclemind-live-home";
import { MiracleMindDevHomePage } from "~/components/pages/miraclemind-dev-home";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [hostname, setHostname] = useState("");

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
  function renderDomainPage() {
    // Handle localhost with domain parameter
    if (hostname.includes("localhost")) {
      const urlParams = new URLSearchParams(window.location.search);
      const domain = urlParams.get("domain");

      switch (domain) {
        case "matthew":
          return <MatthewHomePage />;
        case "live":
          return <MiracleMindLiveHomePage />;
        case "dev":
          return <MiracleMindDevHomePage />;
        default:
          return <MatthewHomePage />; // Default for localhost
      }
    }

    // Handle production domains
    if (hostname.includes("matthewmiceli.com")) {
      return <MatthewHomePage />;
    } else if (hostname.includes("miraclemind.live")) {
      return <MiracleMindLiveHomePage />;
    } else if (hostname.includes("miraclemind.dev")) {
      return <MiracleMindDevHomePage />;
    }

    // Default fallback
    return <MatthewHomePage />;
  }

  return <DomainLayout hostname={hostname}>{renderDomainPage()}</DomainLayout>;
}

"use client";

import { use } from "react";
import { Globe, LayoutDashboard } from "lucide-react";
import { DemoHubLayout, StagingCard } from "~/components/portal";

export default function CHW360DemoHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <DemoHubLayout
      slug={slug}
      title="CHW360 Website Build"
      subtitle="Preview your new high-converting website and admin dashboard"
      footerNote="These are design previews. Final implementation will include full functionality."
    >
      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
        <StagingCard
          href={`/portal/${slug}/demos/website/frontend`}
          icon={<Globe className="h-6 w-6" />}
          title="Website Frontend"
          description="Preview your public-facing landing page with modern design, compelling copy, and conversion-focused layout"
        />
        <StagingCard
          href={`/portal/${slug}/demos/website/admin`}
          icon={<LayoutDashboard className="h-6 w-6" />}
          title="Admin Dashboard"
          description="See how you'll manage signups, track analytics, and oversee your website performance"
        />
      </div>
    </DemoHubLayout>
  );
}

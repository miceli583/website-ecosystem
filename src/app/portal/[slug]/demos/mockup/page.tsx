"use client";

import { use } from "react";
import { Globe, Palette } from "lucide-react";
import { DemoHubLayout, StagingCard } from "~/components/portal";

export default function CHW360MockupHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <DemoHubLayout
      slug={slug}
      title="CHW360 Mockup Implementation"
      subtitle="Exact replica of the approved mockup design"
      footerNote="This is a design preview matching the approved mockup specifications."
    >
      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
        <StagingCard
          href={`/portal/${slug}/demos/mockup/frontend`}
          icon={<Globe className="h-6 w-6" />}
          title="View Mockup"
          description="Preview the CHW360 website design with all sections and interactions"
        />
        <StagingCard
          href={`/portal/${slug}/demos/mockup/assets`}
          icon={<Palette className="h-6 w-6" />}
          title="Brand Assets"
          description="Logo, colors, typography, and imagery used in the CHW360 design"
        />
      </div>
    </DemoHubLayout>
  );
}

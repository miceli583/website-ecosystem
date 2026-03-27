import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { api } from "~/trpc/server";
import { DemoRenderer } from "./demo-renderer";

// Prevent Next.js from caching this page — demo visibility can change at any time
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ token: string; path?: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;

  try {
    const demo = await api.portal.getPublicDemo({ token });
    const metadata = demo.metadata as Record<string, unknown> | null;
    const ogImage =
      (metadata?.ogImage as string) ??
      "https://www.miraclemind.dev/og/og-default.png";
    const description =
      demo.description ?? `Shared by ${demo.clientName} via Miracle Mind`;

    return {
      title: `${demo.title} — ${demo.clientName}`,
      description,
      openGraph: {
        title: demo.title,
        description,
        type: "website",
        siteName: "Miracle Mind",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: demo.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: demo.title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return { title: "Demo Not Available" };
  }
}

export default async function PublicDemoPage({ params }: PageProps) {
  const { token, path } = await params;

  let demo;
  try {
    demo = await api.portal.getPublicDemo({ token });
  } catch {
    notFound();
  }

  const metadata = demo.metadata as Record<string, unknown> | null;
  const demoComponent = metadata?.demoComponent as string | undefined;
  const subRoutes = metadata?.subRoutes as Record<string, string> | undefined;

  const basePath = `/s/${token}`;

  // If there's a path segment, resolve it to a subroute component
  if (path && path.length > 0) {
    const subKey = path[0]!;
    const componentKey = subRoutes?.[subKey] ?? null;

    if (!componentKey) {
      notFound();
    }

    return (
      <DemoRenderer
        demo={demo}
        componentKey={componentKey}
        basePath={basePath}
        backHref={basePath}
      />
    );
  }

  // No path — render hub or standalone
  return (
    <DemoRenderer
      demo={demo}
      componentKey={demoComponent ?? null}
      basePath={basePath}
    />
  );
}

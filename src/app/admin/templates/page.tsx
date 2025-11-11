import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { DomainLayout } from "~/components/domain-layout";
import { BackButton } from "~/components/back-button";
import Link from "next/link";
import {
  Rocket,
  User,
  Building,
  Briefcase,
  ExternalLink,
  Sparkles,
  Code,
} from "lucide-react";

const TEMPLATES = [
  {
    id: "developer-profile",
    title: "Developer Profile",
    description: "Portfolio template for developers and designers",
    icon: User,
    color: "blue",
    href: "/admin/templates/developer-profile",
    tags: ["Portfolio", "Personal"],
  },
  {
    id: "saas-business",
    title: "SaaS Business",
    description: "Professional landing page for SaaS products",
    icon: Building,
    color: "green",
    href: "/admin/templates/saas-business",
    tags: ["Business", "SaaS"],
  },
  {
    id: "startup",
    title: "Startup",
    description: "Modern startup landing page with animations",
    icon: Rocket,
    color: "purple",
    href: "/admin/templates/startup",
    tags: ["Startup", "Landing"],
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Personal portfolio with smooth animations",
    icon: Briefcase,
    color: "orange",
    href: "/admin/templates/portfolio",
    tags: ["Portfolio", "Creative"],
  },
];

/**
 * Template Gallery - Full-Page Template Showcase
 *
 * Authentication is handled by middleware (src/middleware.ts)
 * This route was moved from /templates to /admin/templates to restrict access
 */
export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const params = await searchParams;
  const domainParam = params.domain ? `?domain=${params.domain}` : "";
  return (
    <DomainLayout>
      <BackButton href="/admin" label="Back to Hub" />
      <div className="via-background dark:via-background min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400">
                Template Gallery
              </h1>
            </div>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Full-page templates for portfolios, startups, and business landing
              pages
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
              >
                <Code className="mr-1 h-3 w-3" />
                Production Ready
              </Badge>
              <Badge
                variant="secondary"
                className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Responsive
              </Badge>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <Link key={template.id} href={`${template.href}${domainParam}`} target="_blank">
                  <Card
                    className={`group h-full cursor-pointer border-${template.color}-200 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-${template.color}-800/50`}
                  >
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-4">
                        <div
                          className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-${template.color}-500 to-${template.color}-600`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">
                          {template.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                        {template.description}
                      </p>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {template.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                          <ExternalLink className="h-4 w-4" />
                          <span>Open Template</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="text-muted-foreground pt-8 text-center text-sm">
            <p>
              All templates open in a new window for immersive full-page
              previews. Built with Next.js, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </DomainLayout>
  );
}

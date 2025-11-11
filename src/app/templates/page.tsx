import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { DomainLayout } from "~/components/domain-layout";
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

/**
 * Public Template Gallery
 *
 * This is the public-facing version accessible from matthewmiceli.com
 * Unlike the admin version, this doesn't require authentication
 */

const TEMPLATES = [
  {
    id: "developer-profile",
    title: "Developer Profile",
    description:
      "Modern developer portfolio with project showcase and contact section",
    icon: User,
    color: "blue",
    href: "/templates/developer-profile",
    tags: ["Portfolio", "Developer"],
  },
  {
    id: "startup",
    title: "Startup Landing",
    description: "High-converting startup landing page with feature sections",
    icon: Rocket,
    color: "purple",
    href: "/templates/startup",
    tags: ["Landing", "Startup"],
  },
  {
    id: "saas-business",
    title: "SaaS Business",
    description:
      "Professional SaaS landing page with pricing and testimonials",
    icon: Building,
    color: "emerald",
    href: "/templates/saas-business",
    tags: ["SaaS", "Business"],
  },
  {
    id: "portfolio",
    title: "Creative Portfolio",
    description: "Elegant portfolio template for creative professionals",
    icon: Briefcase,
    color: "orange",
    href: "/templates/portfolio",
    tags: ["Portfolio", "Creative"],
  },
];

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const params = await searchParams;
  const domainParam = params.domain ? `?domain=${params.domain}` : "";
  return (
    <DomainLayout>
      <div className="via-background dark:via-background min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Code className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400">
                Template Gallery
              </h1>
            </div>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Beautiful, responsive templates built with Next.js, TypeScript,
              and Tailwind CSS
            </p>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((template) => {
              const Icon = template.icon;
              const colorMap: Record<string, { bg: string; text: string }> = {
                blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
                purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
                emerald: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400" },
                orange: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
              };

              const colors = colorMap[template.color] ?? colorMap.blue!;

              return (
                <Link
                  key={template.id}
                  href={`${template.href}${domainParam}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="group h-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}
                        >
                          <Icon className={`h-5 w-5 ${colors.text}`} />
                        </div>
                        <h3 className="text-lg font-semibold">
                          {template.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                        {template.description}
                      </p>
                      <div className="mb-4 flex flex-wrap gap-2">
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
                      <div className={`flex items-center gap-2 text-sm font-medium ${colors.text}`}>
                        <span>View Template</span>
                        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
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

"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookOpen, Edit, Eye, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface BlogSeed {
  slug: string;
  title: string;
  description: string;
  status: "published" | "draft" | "seed";
  category: string;
  estimatedReadTime?: string;
  keyPoints?: string[];
}

function BlogManagementContent() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const domainParam = domain ? `?domain=${domain}` : "";

  const blogSeeds: BlogSeed[] = [
    {
      slug: "honoring-our-humanity",
      title: "Honoring Our Humanity: Technology as Guardian, Not Replacement",
      description: "In an age where AI can outperform us in countless tasks, we must ask: what does it mean to be human? And how do we build technology that strengthens—rather than erodes—the connections that make us whole?",
      status: "published",
      category: "Technology & Humanity",
      estimatedReadTime: "8 min",
    },
    {
      slug: "what-is-the-new-earth",
      title: "What is the New Earth?",
      description: "Exploring the vision of New Earth—a world built on sovereignty, regeneration, authentic connection, and technologies that honor our humanity. Not a distant utopia, but an emerging reality being built by thousands of hands.",
      status: "seed",
      category: "New Earth Vision",
    },
    {
      slug: "web5-data-sovereignty",
      title: "Web5: Reclaiming Digital Sovereignty",
      description: "How Web5's decentralized architecture gives us true ownership over our data and digital identity through Decentralized Identifiers, Verifiable Credentials, and personal data stores—making surveillance capitalism technologically impossible.",
      status: "seed",
      category: "Technology",
    },
    {
      slug: "regenerative-land-systems",
      title: "Regenerative Land Systems: Technology Meets Ecology",
      description: "How regenerative agriculture, permaculture, and technology converge to heal ecosystems, reconnect humans to the land, and create abundance through restoration rather than extraction.",
      status: "seed",
      category: "Ecology & Systems",
    },
    {
      slug: "current-threats-modern-technology",
      title: "The Hidden Costs: Current Threats of Modern Technology",
      description: "An evidence-based deep dive into engineered addiction, surveillance capitalism, nervous system dysregulation, and the erosion of sovereignty—understanding what we're up against to build better alternatives.",
      status: "seed",
      category: "Technology & Humanity",
      keyPoints: [
        "The cortisol-dopamine trap: how chronic social media creates feedback loops between stress and reward",
        "Dunbar's number and social fragmentation beyond our cognitive limits",
        "Manufactured scarcity and AI-driven behavioral targeting",
        "Nature deficit disorder and severed connection to land",
        "Surveillance capitalism and the death of digital sovereignty",
        "Neurological parallels between social media and substance addiction"
      ],
    },
    {
      slug: "integrating-spirituality-technology",
      title: "Integrating Spirituality with Technology",
      description: "How can we build technology that honors the sacred? Exploring the intersection of ancient wisdom, energetic blueprints, and modern systems—creating tools that support spiritual growth rather than material consumption.",
      status: "seed",
      category: "Spirituality & Technology",
    },
    {
      slug: "how-to-be-modern-polymath",
      title: "How to Be a Modern Polymath",
      description: "In an age of hyperspecialization, the ability to integrate across disciplines becomes a superpower. Practical strategies for developing breadth without sacrificing depth, and synthesizing diverse knowledge into coherent wholes.",
      status: "seed",
      category: "Personal Development",
    },
    {
      slug: "meta-skills-meta-cognition",
      title: "Meta-Skills and Meta-Cognitive Abilities",
      description: "Beyond domain-specific knowledge: learning how to learn, thinking about thinking, and developing the foundational capacities that amplify all other skills. The infrastructure of human excellence.",
      status: "seed",
      category: "Personal Development",
    },
    {
      slug: "geometry-and-resonance",
      title: "Geometry and Resonance: The Mathematics of Harmony",
      description: "How sacred geometry, natural patterns, and resonance principles underlie everything from quantum mechanics to human relationships. Understanding the deep structures that create coherence in complex systems.",
      status: "seed",
      category: "Systems & Philosophy",
    },
    {
      slug: "foundations-good-systems",
      title: "Foundations of Good Systems",
      description: "What makes a system resilient, regenerative, and aligned with human flourishing? Core principles for designing technology, organizations, and communities that serve life rather than extract from it.",
      status: "seed",
      category: "Systems & Philosophy",
    },
    {
      slug: "yes-and-no-binary-reality",
      title: "Yes and No: The 1's and 0's of Your Reality",
      description: "How the simple act of saying yes or no shapes your entire life. Understanding boundaries, sovereignty, and choice as the fundamental building blocks of your lived experience and emergent reality.",
      status: "seed",
      category: "Personal Development",
    },
    {
      slug: "what-is-sovereignty-really",
      title: "What is Sovereignty, Really?",
      description: "Beyond political definitions: sovereignty as the foundation of human agency, self-determination, and authentic power. Exploring personal sovereignty, data sovereignty, and collective sovereignty in the context of building regenerative futures.",
      status: "seed",
      category: "Philosophy & Systems",
    },
  ];

  const getStatusColor = (status: BlogSeed["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400";
      case "draft":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400";
      case "seed":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400";
    }
  };

  const publishedPosts = blogSeeds.filter((post) => post.status === "published");
  const draftPosts = blogSeeds.filter((post) => post.status === "draft");
  const seedPosts = blogSeeds.filter((post) => post.status === "seed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white dark:from-black dark:via-neutral-950 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href={`/admin${domainParam}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-[#D4AF37] dark:text-neutral-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Development Hub
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1
                className="mb-2 text-5xl font-bold text-black dark:text-white"
                style={{
                  fontFamily: "var(--font-cinzel)",
                  letterSpacing: "0.1em",
                }}
              >
                Blog Management
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Manage blog posts, drafts, and content seeds
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                {publishedPosts.length} Published
              </Badge>
              <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                {draftPosts.length} Drafts
              </Badge>
              <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                {seedPosts.length} Seeds
              </Badge>
            </div>
          </div>
        </div>

        {/* Automation Reminder Card */}
        <Card className="mb-12 border-2 border-amber-500/30 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg dark:from-amber-950/20 dark:to-amber-900/20">
          <CardContent className="p-8">
            <div className="space-y-4">
              <h3
                className="flex items-center gap-2 text-xl font-bold text-amber-900 dark:text-amber-100"
                style={{
                  fontFamily: "var(--font-cinzel)",
                  letterSpacing: "0.05em",
                }}
              >
                <span className="text-2xl">⚡</span>
                TODO: Automation & Queue System
              </h3>
              <div className="space-y-3 rounded-lg border border-amber-500/30 bg-white/50 p-4 dark:bg-black/20">
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Implementation Priorities:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-sm leading-relaxed text-amber-800 dark:text-amber-200">
                  <li>Add Zapier automation for automatic posting to Substack when blog posts are published</li>
                  <li>Integrate email newsletter signup feature</li>
                  <li>Implement queue system for scheduled blog post publishing</li>
                  <li>Add cross-posting to social platforms (optional)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10 dark:from-green-500/10 dark:to-green-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Published</p>
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400">{publishedPosts.length}</p>
                </div>
                <BookOpen className="h-12 w-12 text-green-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 dark:from-yellow-500/10 dark:to-yellow-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Drafts</p>
                  <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{draftPosts.length}</p>
                </div>
                <Edit className="h-12 w-12 text-yellow-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-500/10 dark:from-purple-500/10 dark:to-purple-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Seeds</p>
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{seedPosts.length}</p>
                </div>
                <BookOpen className="h-12 w-12 text-purple-500/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blog Posts Grid */}
        <div className="space-y-4">
          {blogSeeds.map((post) => (
            <Card
              key={post.slug}
              className="group border-2 transition-all duration-300 hover:shadow-lg dark:border-neutral-800"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <h3
                        className="text-xl font-bold text-black dark:text-white"
                        style={{
                          fontFamily: "var(--font-cinzel)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {post.title}
                      </h3>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span className="font-medium" style={{ color: "#D4AF37" }}>
                        {post.category}
                      </span>
                      {post.estimatedReadTime && (
                        <>
                          <span>•</span>
                          <span>{post.estimatedReadTime}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {post.status === "published" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        asChild
                      >
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={post.status === "seed"}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    {post.status !== "published" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                        disabled={post.status === "seed"}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-6 border-2 border-[#D4AF37]/20 bg-gradient-to-br from-white to-neutral-50 shadow-lg dark:from-neutral-900 dark:to-black">
          <CardContent className="p-8">
            <div className="space-y-4">
              <h3
                className="text-xl font-bold text-black dark:text-white"
                style={{
                  fontFamily: "var(--font-cinzel)",
                  letterSpacing: "0.05em",
                }}
              >
                About Blog Seeds
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                Seeds are placeholder blog posts that outline future content. They serve as a roadmap for content creation and help organize ideas before writing begins. When you're ready to write a seed post, work with Claude to develop the full content, then update its status to "draft" for review before publishing.
              </p>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                These seeds can also help reduce density in existing posts by moving detailed content into dedicated topic-specific articles.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function BlogManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogManagementContent />
    </Suspense>
  );
}

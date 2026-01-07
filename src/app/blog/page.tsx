import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Matthew Miceli",
  description: "Thoughts on technology, humanity, and building systems that honor what makes us human.",
};

// Blog post data structure
interface BlogPostPreview {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

// Blog posts list
const blogPosts: BlogPostPreview[] = [
  {
    slug: "honoring-our-humanity",
    title: "Honoring Our Humanity: Technology as Guardian, Not Replacement",
    excerpt:
      "In an age where AI can outperform us in countless tasks, we must ask: what does it mean to be human? And how do we build technology that strengthens—rather than erodes—the connections that make us whole?",
    date: "January 6, 2026",
    readTime: "5 min read",
  },
];

export default function BlogIndex() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Neural Net Shader Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <iframe
          src="/shaders/neural-net/embed"
          className="h-full w-full border-0 opacity-15"
          title="Neural Network Background"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Gradient fade overlay */}
      <div className="absolute inset-0 z-[5] bg-gradient-to-b from-transparent via-transparent via-30% to-black to-70% pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Back Button */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm transition-colors hover:underline"
            style={{ color: '#D4AF37' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Page Header */}
          <header className="mb-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Writing
            </h1>
            <p className="text-lg text-gray-300 sm:text-xl">
              Thoughts on technology, humanity, and building systems that honor what makes us human.
            </p>
          </header>

          {/* Blog Posts Grid */}
          <div className="space-y-6">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="group cursor-pointer backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl" style={{
                  borderColor: 'rgba(212, 175, 55, 0.4)',
                  borderWidth: '1px',
                  background: 'linear-gradient(135deg, rgba(246, 230, 193, 0.08) 0%, rgba(107, 29, 54, 0.08) 100%)'
                }}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg shadow-lg" style={{ background: 'linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)', boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.3)' }}>
                        <BookOpen className="h-6 w-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xs text-gray-400">{post.date}</span>
                          <span className="text-xs" style={{ color: '#D4AF37' }}>•</span>
                          <span className="text-xs" style={{ color: '#D4AF37' }}>{post.readTime}</span>
                        </div>
                        <h2 className="mb-3 text-xl font-bold text-white group-hover:underline sm:text-2xl">
                          {post.title}
                        </h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-200 sm:text-base">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3" style={{ color: '#D4AF37' }}>
                          <span>Read article</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

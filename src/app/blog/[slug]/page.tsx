import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Metadata } from "next";

// Blog post data structure
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: React.ReactNode;
}

// Blog posts database
const blogPosts: Record<string, BlogPost> = {
  "honoring-our-humanity": {
    slug: "honoring-our-humanity",
    title: "Honoring Our Humanity: Technology as Guardian, Not Replacement",
    excerpt:
      "In an age where AI can outperform us in countless tasks, we must ask: what does it mean to be human? And how do we build technology that strengthens—rather than erodes—the connections that make us whole?",
    date: "January 6, 2026",
    content: (
      <>
        <p>
          We stand at an inflection point. Artificial intelligence can write, code, create art, and solve problems with inhuman speed. It&apos;s remarkable. It&apos;s powerful. And it&apos;s forcing us to confront an uncomfortable question:
        </p>
        <p className="italic font-medium">If AI can do it better, why should I bother?</p>
        <p>
          This question—this crisis of meaning—sits at the heart of our technological moment. And I believe answering it requires something radical: a massive collective purification.
        </p>

        <h2>The Great Purification</h2>
        <p>
          Let&apos;s sit with the premise for a moment. If AI can create art, write code, compose music—and arguably do it &quot;better&quot; (though what does &quot;better&quot; even mean?)—then we&apos;re faced with a profound reckoning.
        </p>
        <p>
          We can no longer create from validation. We can no longer create from comparison. We can no longer create from competition. We can no longer create to be &quot;better than.&quot;
        </p>
        <p>
          Those motivations are being stripped away. And in their absence, we&apos;re left with something infinitely more precious: the opportunity to create for the purest sake of creating.
        </p>
        <p>
          We get to create because we enjoy the creative process. We create to create. That&apos;s it. Because we like it. Because we love it. Because it makes us human.
        </p>
        <p>
          This purification shifts everything. It forces us to ask new questions—not about performance or output, but about choice and sovereignty:
        </p>
        <p className="italic font-medium">
          What do I want to create?<br />
          What do we collectively want to choose to create?
        </p>
        <p>
          And from there, a deeper question emerges: <span className="italic font-medium">What aspects of being human are worth preserving, protecting, and amplifying?</span>
        </p>
        <p>
          When I talk about &quot;honoring our humanity,&quot; I&apos;m talking about recognizing what makes us whole—and building technology that serves that wholeness rather than fragmenting it.
        </p>

        <h2>What We&apos;re Losing</h2>
        <p>The threats are already here, hiding in plain sight. Four patterns stand out:</p>

        <p>
          <strong>Engineered addiction and nervous system dysregulation.</strong> Social media platforms don&apos;t just capture our attention—they <span className="italic">program</span> our brains using <a href="https://journals.sagepub.com/doi/10.1177/17579139251331914" target="_blank" rel="noopener noreferrer">variable reward schedules</a> (the same mechanism as slot machines). <a href="https://sites.dartmouth.edu/dujs/2022/08/20/social-media-dopamine-and-stress-converging-pathways/" target="_blank" rel="noopener noreferrer">Research shows</a> chronic use creates feedback loops between stress hormones and reward neurotransmitters—we&apos;re running on activation without ever settling into regulation. You&apos;re not the customer. You&apos;re the product being trained.
        </p>

        <p>
          <strong>Social fragmentation beyond our limits.</strong> Humans evolved to maintain meaningful relationships with roughly <a href="https://theconversation.com/dunbars-number-why-my-theory-that-humans-can-only-maintain-150-friendships-has-withstood-30-years-of-scrutiny-160676" target="_blank" rel="noopener noreferrer">150 people</a>. When networks expand beyond this threshold, <a href="https://brainapps.io/blog/2025/02/understanding-dunbars-number-limits-and/" target="_blank" rel="noopener noreferrer">connection depth collapses</a>. We start treating humans as abstractions. Empathy shuts off. Community dissolves into isolation.
        </p>

        <p>
          <strong>Severed connection to land.</strong> We&apos;ve abstracted ourselves from the physical world. What researchers call <a href="https://www.ebsco.com/research-starters/psychology/nature-deficit-disorder" target="_blank" rel="noopener noreferrer">&quot;nature deficit disorder&quot;</a> isn&apos;t poetic—it&apos;s physiological. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2760412/" target="_blank" rel="noopener noreferrer">Visual contact with nature</a> reduces anxiety, stabilizes heart rate, improves cognition. We&apos;ve traded the horizon for the screen. Our bodies don&apos;t touch earth.
        </p>

        <p>
          <strong>The erosion of sovereignty.</strong> Harvard professor Shoshana Zuboff calls it <a href="https://news.harvard.edu/gazette/story/2019/03/harvard-professor-says-surveillance-capitalism-is-undermining-democracy/" target="_blank" rel="noopener noreferrer">&quot;surveillance capitalism&quot;</a>—the claiming of private human experience as raw material for <a href="https://www.project-syndicate.org/magazine/surveillance-capitalism-exploiting-behavioral-data-by-shoshana-zuboff-2020-01" target="_blank" rel="noopener noreferrer">behavioral modification at scale</a>. Tech companies don&apos;t just predict our behavior—they shape it. Without autonomy in action and thought, we lose our capacity for the moral judgment necessary for democracy itself.
        </p>

        <p className="text-sm italic" style={{ color: '#D4AF37' }}>
          For a deeper dive into these threats and the science behind them, see <span className="inline-flex items-center gap-1"><a href="/blog/current-threats-modern-technology" className="underline hover:no-underline">The Hidden Costs: Current Threats of Modern Technology</a> <span className="text-xs opacity-60">(Coming Soon)</span></span>.
        </p>

        <h2>What We&apos;re Building Toward</h2>
        <p>
          These patterns aren&apos;t inevitable—they&apos;re design choices. And here&apos;s what gives me hope: <span className="italic font-medium">technology itself isn&apos;t the problem</span>. It&apos;s technology built without reverence for what it means to be human.
        </p>
        <p>We can build differently. And people are already doing it.</p>

        <p>
          <strong>Technology that strengthens in-person connection.</strong> The <a href="https://ecovillage.org/" target="_blank" rel="noopener noreferrer">Global Ecovillage Network</a> connects <a href="https://ecovillage.org/sustainable-development-the-ecovillage-way/" target="_blank" rel="noopener noreferrer">6,000+ communities across 114 countries</a>—living laboratories for technology that facilitates gathering instead of replacing it. These aren&apos;t utopian fantasies. They&apos;re regenerative communities already functioning today.
        </p>

        <p>
          <strong>Technology that safeguards nervous system coherence.</strong> <a href="https://humanetech.com/" target="_blank" rel="noopener noreferrer">The Center for Humane Technology</a> has been developing design principles that protect attention and wellbeing since 2013. Products like <a href="https://www.thelightphone.com/" target="_blank" rel="noopener noreferrer">Light Phone</a>—designed to be used as little as possible—demonstrate viable alternatives to attention-hijacking interfaces. This means rejecting variable reward schedules, designing for focused attention rather than infinite scroll, and building systems that support our biology.
        </p>

        <p>
          <strong>Technology that reconnects us to land.</strong> <a href="https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2025.1545811/full" target="_blank" rel="noopener noreferrer">Regenerative agriculture</a> and <a href="https://acsess.onlinelibrary.wiley.com/doi/abs/10.1002/agj2.20814" target="_blank" rel="noopener noreferrer">permaculture</a> show how technology can support ecological healing rather than extraction. These are integrated systems that enhance biodiversity, enrich soils, and capture carbon while reconnecting humans to the living systems that sustain us.
        </p>

        <p>
          <strong>Technology that empowers true data sovereignty.</strong> Projects like <a href="https://developer.tbd.website/projects/web5/" target="_blank" rel="noopener noreferrer">Web5</a> are building decentralized platforms where users control their identity and data through self-sovereign systems. This isn&apos;t blockchain hype—it&apos;s infrastructure for a world where you own your data, control who accesses it, and can revoke that access at will. Where surveillance capitalism becomes technologically impossible.
        </p>

        <p>
          <strong>Technology that clarifies meaning.</strong> AI should free us from drudgery to pursue what only humans can do: create meaning, build relationships, ask better questions. The point isn&apos;t to compete with machines—it&apos;s to remember what machines can&apos;t replicate. Presence, intuition, love, wonder. This is the foundation for systems like <span className="font-semibold" style={{ color: '#D4AF37' }}>BANYAN</span>—AI that helps you integrate your life domains without dictating how you should live.
        </p>

        <p className="text-sm italic" style={{ color: '#D4AF37' }}>
          To explore these solutions in depth, see <span className="inline-flex items-center gap-1"><a href="/blog/web5-data-sovereignty" className="underline hover:no-underline">Web5: Reclaiming Digital Sovereignty</a> <span className="text-xs opacity-60">(Coming Soon)</span></span>, <span className="inline-flex items-center gap-1"><a href="/blog/regenerative-land-systems" className="underline hover:no-underline">Regenerative Land Systems</a> <span className="text-xs opacity-60">(Coming Soon)</span></span>, and <span className="inline-flex items-center gap-1"><a href="/blog/what-is-the-new-earth" className="underline hover:no-underline">What is the New Earth?</a> <span className="text-xs opacity-60">(Coming Soon)</span></span>
        </p>

        <h2>The Work Ahead</h2>
        <p>
          All around the world, people are building the future our hearts know is possible. Not in isolation, but as interconnected threads weaving a larger tapestry.
        </p>
        <p>
          Imagine what becomes possible when these pieces converge: data sovereignty, coherent life systems, regenerative land stewardship, and communities built on authentic resonance rather than algorithmic feeds.
        </p>
        <p>
          This is the work I&apos;ve dedicated myself to—building infrastructure for this emergence. Through <a href="https://miraclemind.dev" target="_blank" rel="noopener noreferrer">Miracle Mind</a>, we&apos;re developing technical solutions aligned with these principles. <span className="font-semibold" style={{ color: '#D4AF37' }}>BANYAN</span>, our AI-assisted Life Operating System, integrates habits, projects, finances, and wellbeing as interdependent elements—not to dictate how you should live, but to help you understand the systems at play so you can make more aligned choices. Technology in service of human agency and sovereignty.
        </p>
        <p>
          Through another project I co-founded, <a href="https://joinnewearthcollective.com" target="_blank" rel="noopener noreferrer">New Earth Collective</a>, we&apos;re stewarding spaces—both digital and physical—where people with shared vision can find each other, form micro-communities, and seed regenerative projects. Where energetic blueprints guide authentic connection. Where gathering in person becomes the foundation, not the exception. Where we remember what it means to belong to each other and to the land.
        </p>
        <p>
          Picture the convergence: Communities coordinating regenerative land stewardship while maintaining data sovereignty through <a href="https://developer.tbd.website/projects/web5/" target="_blank" rel="noopener noreferrer">Web5</a>. Individuals using systems like BANYAN to integrate personal growth with collective projects. Platforms like New Earth Collective connecting people not by engagement metrics but by genuine resonance and shared commitment to collective flourishing. Technology that facilitates in-person gathering rather than replacing it. <a href="https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2025.1545811/full" target="_blank" rel="noopener noreferrer">Regenerative agriculture</a> supported by tools that honor both soil and soul. All of it interwoven, supporting the emergence of ways of being we&apos;ve forgotten but our bodies still remember.
        </p>
        <p>
          Every line of code is a choice. Every interface is a statement about what we value. Every system we build either honors our humanity or diminishes it.
        </p>
        <p>
          The world our hearts know is possible isn&apos;t a fantasy—it&apos;s already being built by thousands of hands, one aligned choice at a time.
        </p>
        <p>And if you&apos;re reading this, yours might be among them.</p>

        <div className="mt-12 rounded-lg border p-6" style={{ borderColor: 'rgba(212, 175, 55, 0.3)', background: 'rgba(212, 175, 55, 0.05)' }}>
          <p className="text-gray-100">
            <strong>What are your thoughts?</strong> How do you think about technology&apos;s role in either supporting or eroding our humanity? I&apos;d love to hear from you.
          </p>
          <Button
            className="mt-4"
            style={{
              background: 'linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)',
              color: '#000000'
            }}
            asChild
          >
            <a href="/#contact">
              <Mail className="mr-2 h-4 w-4" />
              Get In Touch
            </a>
          </Button>
        </div>
      </>
    ),
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: `${post.title} | Matthew Miceli`,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

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
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Back Button */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm transition-colors hover:underline"
            style={{ color: '#D4AF37' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Article Header */}
          <header className="mb-8 sm:mb-12">
            <time className="text-sm text-gray-400">{post.date}</time>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-gray-300 sm:text-xl">
              {post.excerpt}
            </p>
          </header>

          {/* Article Content */}
          <article className="blog-prose prose-lg max-w-none">
            {post.content}
          </article>
        </div>
      </div>
    </div>
  );
}

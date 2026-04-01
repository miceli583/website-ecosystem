"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  Check,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Star,
} from "lucide-react";

export default function DemoLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              <Sparkles className="h-4 w-4 text-black" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Demo Landing Page
            </span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-white">
              Pricing
            </a>
            <a
              href="#testimonials"
              className="transition-colors hover:text-white"
            >
              Testimonials
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
          </div>
          <button
            className="rounded-lg px-4 py-2 text-sm font-medium text-black"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center md:py-36">
          <div
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm"
            style={{
              borderColor: "rgba(212, 175, 55, 0.3)",
              color: "#D4AF37",
            }}
          >
            <Zap className="h-3.5 w-3.5" />
            Built with modern web technology
          </div>
          <h1
            className="mx-auto max-w-3xl text-5xl leading-tight font-bold tracking-tight md:text-7xl"
            style={{ fontFamily: "'Quattrocento Sans', serif" }}
          >
            Build something{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              remarkable
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-400">
            A clean, modern landing page that showcases your product with
            clarity and confidence. Designed to convert visitors into customers.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-black"
              style={{
                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="border-y border-white/5 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-8 text-center text-xs font-medium tracking-widest text-gray-600 uppercase">
            Trusted by leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 text-gray-600">
            {["Acme Corp", "Globex", "Initech", "Umbrella", "Stark"].map(
              (name) => (
                <span
                  key={name}
                  className="text-sm font-semibold tracking-wider uppercase"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2
              className="text-3xl font-bold md:text-4xl"
              style={{ fontFamily: "'Quattrocento Sans', serif" }}
            >
              Everything you need
            </h2>
            <p className="mt-4 text-gray-400">
              Powerful features designed to help you grow faster.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Optimized performance with sub-second load times and instant interactions.",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "Bank-grade encryption, SOC 2 compliance, and role-based access controls.",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                desc: "Real-time dashboards, custom reports, and actionable insights.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border bg-white/[0.02] p-8 transition-colors hover:bg-white/5"
                style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
                  }}
                >
                  <feature.icon
                    className="h-6 w-6"
                    style={{ color: "#D4AF37" }}
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="border-y py-16"
        style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-4">
          {[
            { value: "99.9%", label: "Uptime" },
            { value: "2.5M+", label: "Users" },
            { value: "<100ms", label: "Response Time" },
            { value: "4.9/5", label: "Customer Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold" style={{ color: "#D4AF37" }}>
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2
              className="text-3xl font-bold md:text-4xl"
              style={{ fontFamily: "'Quattrocento Sans', serif" }}
            >
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-gray-400">
              No hidden fees. Cancel anytime.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$29",
                features: [
                  "Up to 1,000 users",
                  "Basic analytics",
                  "Email support",
                  "1 team member",
                ],
                popular: false,
              },
              {
                name: "Pro",
                price: "$79",
                features: [
                  "Up to 10,000 users",
                  "Advanced analytics",
                  "Priority support",
                  "5 team members",
                  "Custom integrations",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: [
                  "Unlimited users",
                  "Dedicated support",
                  "SLA guarantee",
                  "Unlimited team",
                  "Custom development",
                  "On-premise option",
                ],
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-8 ${
                  plan.popular ? "bg-white/5" : "bg-white/[0.02]"
                }`}
                style={{
                  borderColor: plan.popular
                    ? "rgba(212, 175, 55, 0.4)"
                    : "rgba(212, 175, 55, 0.15)",
                }}
              >
                {plan.popular && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium text-black"
                    style={{
                      background:
                        "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                    }}
                  >
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-sm text-gray-500">/month</span>
                  )}
                </p>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check
                        className="h-4 w-4 flex-shrink-0"
                        style={{ color: "#D4AF37" }}
                      />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full rounded-lg py-2.5 text-sm font-medium transition-colors ${
                    plan.popular
                      ? "text-black"
                      : "border text-gray-300 hover:bg-white/5"
                  }`}
                  style={
                    plan.popular
                      ? {
                          background:
                            "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                        }
                      : { borderColor: "rgba(212, 175, 55, 0.2)" }
                  }
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2
              className="text-3xl font-bold md:text-4xl"
              style={{ fontFamily: "'Quattrocento Sans', serif" }}
            >
              Loved by teams everywhere
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "This transformed how we operate. The ROI was visible within the first month.",
                name: "Sarah Chen",
                role: "CTO, Acme Corp",
              },
              {
                quote:
                  "The best investment we've made this year. Clean, fast, and the support is incredible.",
                name: "Marcus Rivera",
                role: "VP of Product, Globex",
              },
              {
                quote:
                  "We evaluated 12 solutions. This was the clear winner on every metric that mattered.",
                name: "Aisha Patel",
                role: "Director of Ops, Initech",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-xl border bg-white/[0.02] p-8"
                style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-current"
                      style={{ color: "#D4AF37" }}
                    />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-gray-300">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div
          className="mx-auto max-w-4xl rounded-2xl border p-12 text-center md:p-16"
          style={{
            borderColor: "rgba(212, 175, 55, 0.2)",
            background:
              "linear-gradient(180deg, rgba(212,175,55,0.05) 0%, transparent 100%)",
          }}
        >
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "'Quattrocento Sans', serif" }}
          >
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-gray-400">
            Join thousands of teams already building better products. Start your
            free trial today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-black"
              style={{
                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              Start Free Trial
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm text-gray-300 transition-colors hover:bg-white/5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-t py-24"
        style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2
                className="text-3xl font-bold"
                style={{ fontFamily: "'Quattrocento Sans', serif" }}
              >
                Get in touch
              </h2>
              <p className="mt-4 text-gray-400">
                Have a question? We&apos;d love to hear from you.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: Mail, text: "hello@example.com" },
                  { icon: Phone, text: "+1 (555) 123-4567" },
                  { icon: MapPin, text: "San Francisco, CA" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 text-sm text-gray-400"
                  >
                    <item.icon
                      className="h-4 w-4"
                      style={{ color: "#D4AF37" }}
                    />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="First name"
                  className="rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              />
              <textarea
                placeholder="Your message..."
                rows={4}
                className="w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              />
              <button
                className="w-full rounded-lg px-6 py-3 text-sm font-medium text-black"
                style={{
                  background:
                    "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded"
              style={{
                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              <Sparkles className="h-3 w-3 text-black" />
            </div>
            <span className="text-sm font-medium">Demo Landing Page</span>
          </div>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Demo Landing Page. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* Back to portal */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link
          href={`/portal/${slug}/demos`}
          className="inline-flex items-center gap-2 rounded-lg border bg-black/80 px-4 py-2 text-sm text-gray-400 backdrop-blur-sm transition-colors hover:text-white"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Demos
        </Link>
      </div>
    </div>
  );
}

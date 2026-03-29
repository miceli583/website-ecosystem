"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = api.contact.submitPersonal.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    },
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    contactMutation.mutate(form);
  };

  return (
    <section className="relative px-6 py-20 sm:py-28">
      <div ref={ref} className="mx-auto max-w-lg">
        {/* Divider */}
        <div className="mb-16">
          <div
            className="mx-auto h-px w-full max-w-xs"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
            }}
          />
        </div>

        <div
          className={`text-center transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h3
            className="mb-4 font-[family-name:var(--font-quattrocento-sans)] text-2xl font-bold tracking-[0.06em] sm:text-3xl"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Let&apos;s Talk
          </h3>
          <p className="mb-8 text-base text-white/50">
            If you&apos;re building something that matters -- regenerative
            systems, land technology, community infrastructure -- I&apos;d love
            to hear about it.
          </p>
        </div>

        {submitted ? (
          <div
            className={`rounded-xl border p-8 text-center transition-all duration-700 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{
              background: "rgba(212, 175, 55, 0.04)",
              borderColor: "rgba(212, 175, 55, 0.2)",
            }}
          >
            <CheckCircle className="mx-auto mb-3 h-8 w-8 text-[#D4AF37]" />
            <p className="text-base text-white/70">
              Message sent. I&apos;ll be in touch.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`space-y-4 transition-all duration-700 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="border-[rgba(212,175,55,0.15)] bg-white/[0.03] text-white placeholder:text-white/30 focus:border-[#D4AF37]/40"
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="border-[rgba(212,175,55,0.15)] bg-white/[0.03] text-white placeholder:text-white/30 focus:border-[#D4AF37]/40"
              required
            />
            <textarea
              placeholder="Tell me about your project..."
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              rows={4}
              className="w-full rounded-md border border-[rgba(212,175,55,0.15)] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/40 focus:outline-none"
              required
            />
            <Button
              type="submit"
              disabled={contactMutation.isPending}
              className="w-full bg-gradient-to-r from-[#F6E6C1] to-[#D4AF37] text-black hover:opacity-90"
            >
              {contactMutation.isPending ? (
                "Sending..."
              ) : (
                <span className="flex items-center gap-2">
                  Send Message <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
            {contactMutation.error && (
              <p className="text-center text-sm text-red-400">
                Something went wrong. Try emailing me directly.
              </p>
            )}
          </form>
        )}

        {/* Direct email fallback */}
        <div className="mt-6 text-center">
          <a
            href="mailto:mmicel583@gmail.com"
            className="inline-flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-[#D4AF37]"
          >
            <Mail className="h-4 w-4" />
            mmicel583@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}

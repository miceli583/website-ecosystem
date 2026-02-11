"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* ── Brand tokens (Wildflower Healing Co.) ─────────────────── */
const C = {
  dustyRose: "#c4a69f",
  cream: "#ede6da",
  camel: "#b48c76",
  chocolate: "#7a5c4f",
  chocolateDark: "#5a433a",
  gold: "#d4b483",
  goldDark: "#b8965c",
  warmGray: "#a8a39d",
  warmBrown: "#8b6b5c",
} as const;

const FONT_DISPLAY = "'Moontime', cursive";
const FONT_BODY = "'Glacial Indifference', sans-serif";

/* ── Content data ──────────────────────────────────────────── */
const PAIN_POINTS = [
  "You feel disconnected from your body, like you're watching life from a distance",
  "Being fully present feels unsafe, so you stay busy, distracted, or numbed",
  "You know you have gifts to share, but something keeps them locked inside",
  "You long for a sense of home within yourself, a place of true safety",
  "Your nervous system is always on alert, never quite at peace",
];

const MODULES = [
  { number: 1, title: "Creating Safety", description: "Building the foundation of nervous system regulation and establishing safety in your body" },
  { number: 2, title: "Expanding Capacity", description: "Increasing your ability to hold presence and integrate deeper levels of embodiment" },
  { number: 3, title: "Full Expression", description: "Stepping into your highest expression and speaking, creating, and moving from your truth" },
];

const INCLUDES = [
  "3 transformative modules",
  "24 guided lessons",
  "Somatic embodiment practices",
  "Guided meditations",
  "2 live calls per week",
  "Community support on Skool",
  "Lifetime access to materials",
];

const PRICING_TIERS = [
  { id: "standard", name: "Full Investment", priceDisplay: "$5,555", description: "The standard path to transformation", featured: true },
  { id: "contribution", name: "Extended Contribution", priceDisplay: "$7,777", description: "For those called to give more and support the mission", featured: false },
  { id: "discount", name: "Reduced Rate", priceDisplay: "$3,333", description: "A softer entry point", featured: false },
  { id: "scholarship", name: "Scholarship", priceDisplay: "$1,111", description: "For those who need accessibility", featured: false },
];

/* ── Shared sub-components ─────────────────────────────────── */
function SectionDividerImage({ src, fromColor, toColor }: { src: string; fromColor: string; toColor: string }) {
  return (
    <div style={{ position: "relative", height: "clamp(8rem, 15vw, 16rem)", overflow: "hidden" }}>
      <Image src={src} alt="" fill className="object-cover object-center" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, ${fromColor}, transparent, ${toColor})`,
        }}
      />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill={C.gold} viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

/* ── Main component ────────────────────────────────────────── */
interface WildflowerLandingProps {
  backHref?: string;
}

export function WildflowerLanding({ backHref }: WildflowerLandingProps) {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: FONT_BODY, color: C.chocolate, background: C.cream }}>
      {/* Font injection */}
      <style>{`
        @font-face { font-family: 'Moontime'; src: url('/wildflower/fonts/MoonTime-Regular.otf') format('opentype'); font-weight: normal; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Glacial Indifference'; src: url('/wildflower/fonts/GlacialIndifference-Regular.otf') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Glacial Indifference'; src: url('/wildflower/fonts/GlacialIndifference-Bold.otf') format('opentype'); font-weight: 700; font-style: normal; font-display: swap; }
        @font-face { font-family: 'Glacial Indifference'; src: url('/wildflower/fonts/GlacialIndifference-Italic.otf') format('opentype'); font-weight: 400; font-style: italic; font-display: swap; }
      `}</style>

      {/* ── Back button (MiracleMind chrome) ── */}
      {backHref && (
        <header className="border-b px-4 py-4 sm:px-6" style={{ borderColor: "rgba(212, 175, 55, 0.2)", background: "#000" }}>
          <div className="mx-auto max-w-5xl">
            <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Demos
            </Link>
          </div>
        </header>
      )}

      {/* ═══════ 1 · HERO ═══════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", background: C.dustyRose, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/wildflower/images/hero-hand.jpg" alt="" fill className="object-cover" style={{ opacity: 0.6 }} priority />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${C.cream}66, ${C.cream}33, ${C.cream}80)` }} />
        </div>

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "56rem", margin: "0 auto" }}>
          {/* Logo */}
          <div style={{ marginBottom: "3rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wildflower/brand/logo.svg" alt="WildFlower Healing Co." style={{ height: "80px", margin: "0 auto" }} />
          </div>

          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(6rem, 12vw, 12rem)", lineHeight: 0.9, marginBottom: "1.5rem", color: C.chocolateDark, textShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            HERE
          </h1>

          <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", letterSpacing: "0.3em", textTransform: "uppercase", color: `${C.chocolateDark}cc`, marginBottom: "2rem" }}>
            Where soul meets body
          </p>

          <p style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)", color: C.chocolateDark, maxWidth: "42rem", margin: "0 auto 3rem", lineHeight: 1.6 }}>
            A trauma-informed homecoming into the safety of the present moment
          </p>

          <button
            onClick={scrollToPricing}
            style={{ fontSize: "1.125rem", padding: "0.875rem 3rem", background: C.chocolateDark, color: C.cream, border: "none", borderRadius: "0.5rem", cursor: "pointer", fontWeight: 600, fontFamily: FONT_BODY }}
          >
            Begin Your Journey
          </button>

          <div style={{ marginTop: "4rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1rem", color: `${C.chocolateDark}b3`, fontStyle: "italic" }}>
            <span>Reclaim your gifts</span>
            <span style={{ color: C.chocolate }}>·</span>
            <span>Remember your power</span>
            <span style={{ color: C.chocolate }}>·</span>
            <span>Embody your highest expression</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)" }} className="animate-bounce">
          <svg className="w-6 h-6" style={{ color: `${C.chocolateDark}99` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ═══════ 2 · PAIN POINTS ═══════ */}
      <SectionDividerImage src="/wildflower/images/bloom.jpg" fromColor={`${C.warmBrown}33`} toColor={`${C.dustyRose}4d`} />

      <section style={{ background: C.dustyRose, padding: "4rem 1rem 5rem" }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(3rem, 6vw, 3.75rem)", marginBottom: "3rem", color: C.chocolateDark }}>
            I understand you...
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {PAIN_POINTS.map((point, i) => (
              <p key={i} style={{ fontSize: "clamp(1.125rem, 2vw, 1.25rem)", color: C.chocolateDark, lineHeight: 1.7 }}>
                {point}
              </p>
            ))}
          </div>

          <div style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: `1px solid ${C.chocolate}4d` }}>
            <p style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)", color: C.chocolateDark, fontStyle: "italic", lineHeight: 1.7 }}>
              What if there was a way to come home to yourself?
              <br />
              <strong style={{ color: C.chocolateDark }}>A way to be fully HERE.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ 3 · ABOUT KORÉ ═══════ */}
      <section style={{ background: C.cream, padding: "5rem 1rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "3rem", alignItems: "center" }}>
          <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <Image src="/wildflower/images/kore.jpg" alt="Koré - Founder of WildFlower Healing Co." fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(3rem, 6vw, 3.75rem)", color: C.chocolateDark }}>
              Meet Koré
            </h2>
            <p style={{ fontSize: "1.125rem", color: C.chocolate, lineHeight: 1.7 }}>
              As a trauma-informed somatic practitioner, I&apos;ve spent years understanding
              the intricate dance between our souls and our bodies. My own journey of
              healing taught me that true transformation happens when we create enough
              safety in our nervous system to be fully present.
            </p>
            <p style={{ fontSize: "1.125rem", color: C.chocolate, lineHeight: 1.7 }}>
              I&apos;ve witnessed countless women struggle with the same disconnection —
              brilliant, gifted souls who couldn&apos;t quite land in their bodies, couldn&apos;t
              quite access their full expression. That&apos;s why I created HERE.
            </p>
            <p style={{ fontSize: "1.125rem", color: C.chocolate, lineHeight: 1.7 }}>
              This isn&apos;t about fixing what&apos;s broken. It&apos;s about remembering what&apos;s
              always been whole. It&apos;s about expanding your capacity to hold presence,
              to feel safe in the now, and to finally embody the fullness of who you
              are.
            </p>
            <p style={{ fontSize: "1.25rem", color: C.chocolateDark, fontStyle: "italic", marginTop: "1rem", borderLeft: `4px solid ${C.gold}`, paddingLeft: "1rem" }}>
              &quot;I believe every woman deserves to feel at home in her body.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ 4 · COURSE OFFER ═══════ */}
      <SectionDividerImage src="/wildflower/images/texture-shadows.jpg" fromColor={`${C.dustyRose}66`} toColor={`${C.cream}99`} />

      <section style={{ background: C.cream, padding: "5rem 1rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(3rem, 6vw, 3.75rem)", marginBottom: "1.5rem", color: C.chocolateDark }}>
              What Awaits You
            </h2>
            <p style={{ fontSize: "1.25rem", color: C.chocolate, maxWidth: "42rem", margin: "0 auto" }}>
              A trauma-informed homecoming into the safety of the present moment
            </p>
          </div>

          {/* Modules */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "2rem", marginBottom: "4rem" }}>
            {MODULES.map((mod) => (
              <div key={mod.number} style={{ background: "#fff", borderRadius: "1rem", padding: "2rem", textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", border: `1px solid ${C.warmGray}33` }}>
                <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", background: C.chocolateDark, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: "1.875rem", color: C.cream }}>{mod.number}</span>
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: C.chocolateDark, marginBottom: "0.75rem" }}>{mod.title}</h3>
                <p style={{ color: C.chocolate }}>{mod.description}</p>
              </div>
            ))}
          </div>

          {/* What's Included */}
          <div style={{ background: C.chocolateDark, borderRadius: "1rem", padding: "clamp(2rem, 4vw, 3rem)" }}>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.875rem, 4vw, 2.5rem)", textAlign: "center", marginBottom: "2rem", color: C.cream }}>
              Everything Included
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1rem", maxWidth: "56rem", margin: "0 auto" }}>
              {INCLUDES.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: C.cream }}>
                  <CheckIcon />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 5 · PRICING ═══════ */}
      <SectionDividerImage src="/wildflower/images/bloom.jpg" fromColor={`${C.cream}99`} toColor={`${C.chocolateDark}66`} />

      <section id="pricing" style={{ background: C.chocolateDark, padding: "4rem 1rem 5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(3rem, 6vw, 3.75rem)", marginBottom: "1.5rem", color: C.cream }}>
              Investment Options
            </h2>
            <p style={{ fontSize: "1.25rem", color: `${C.cream}cc`, maxWidth: "42rem", margin: "0 auto" }}>
              Choose what feels right for you. Every option gives you full access to HERE.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1.5rem", maxWidth: "72rem", margin: "0 auto" }}>
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: tier.featured ? C.cream : `${C.cream}0d`,
                  borderRadius: "1rem",
                  padding: "2rem",
                  border: tier.featured ? `2px solid ${C.gold}` : `1px solid ${C.cream}1a`,
                }}
              >
                {tier.featured && (
                  <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: C.goldDark, fontWeight: 700, marginBottom: "0.5rem" }}>
                    Recommended
                  </span>
                )}
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: tier.featured ? C.chocolateDark : C.cream, marginBottom: "0.25rem" }}>
                  {tier.name}
                </h3>
                <p style={{ fontSize: "0.875rem", color: tier.featured ? C.chocolate : `${C.cream}99`, marginBottom: "1rem" }}>
                  {tier.description}
                </p>
                <div style={{ margin: "1rem 0", flex: 1 }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(2.5rem, 5vw, 3rem)", color: tier.featured ? C.chocolateDark : C.cream }}>
                    {tier.priceDisplay}
                  </span>
                </div>
                <button
                  style={{
                    width: "100%",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    cursor: "pointer",
                    fontFamily: FONT_BODY,
                    background: tier.featured ? C.chocolateDark : "transparent",
                    color: tier.featured ? C.cream : C.cream,
                    border: tier.featured ? "none" : `1px solid ${C.cream}33`,
                  }}
                >
                  Contact for Access
                </button>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: "3rem", color: `${C.cream}99`, fontSize: "0.875rem", maxWidth: "36rem", margin: "3rem auto 0" }}>
            Interested in enrolling? Reach out to discuss the best option for your journey.
          </p>
        </div>
      </section>

      {/* ═══════ 6 · FINAL CTA ═══════ */}
      <SectionDividerImage src="/wildflower/images/texture-shadows.jpg" fromColor={`${C.chocolateDark}66`} toColor={`${C.cream}99`} />

      <section style={{ background: C.cream, padding: "4rem 1rem 5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(3rem, 7vw, 4.5rem)", marginBottom: "2rem", color: C.chocolateDark }}>
            Your Homecoming Awaits
          </h2>

          <p style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)", color: C.chocolate, marginBottom: "2rem", lineHeight: 1.7 }}>
            You&apos;ve been searching for a way back to yourself. A way to feel safe in
            your body. A way to express the fullness of who you are.
          </p>

          <p style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)", color: C.chocolate, marginBottom: "3rem", lineHeight: 1.7 }}>
            <strong style={{ color: C.chocolateDark }}>This is it.</strong> This is your invitation
            to come home.
          </p>

          <button
            onClick={scrollToPricing}
            style={{ fontSize: "1.125rem", padding: "0.875rem 3rem", background: C.chocolateDark, color: C.cream, border: "none", borderRadius: "0.5rem", cursor: "pointer", fontFamily: FONT_BODY }}
          >
            I&apos;m Ready to Be HERE
          </button>

          <p style={{ marginTop: "2rem", color: `${C.chocolate}b3`, fontStyle: "italic" }}>
            &quot;The journey of a thousand miles begins with a single step.&quot;
          </p>
        </div>
      </section>

      {/* ═══════ 7 · FOOTER ═══════ */}
      <footer style={{ background: C.chocolate, color: `${C.cream}cc`, padding: "3rem 1rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/wildflower/brand/logo.svg" alt="WildFlower Healing Co." style={{ height: "40px", filter: "brightness(0) invert(1)", opacity: 0.8 }} />
              <p style={{ fontSize: "0.875rem", color: `${C.cream}99` }}>Guiding you home to yourself</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", fontSize: "0.875rem" }}>
              <span style={{ color: `${C.cream}cc` }}>hello@wildflowerhealingco.com</span>
            </div>
          </div>

          <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: `1px solid ${C.cream}1a`, textAlign: "center", fontSize: "0.875rem", color: `${C.cream}80` }}>
            <p>&copy; {new Date().getFullYear()} WildFlower Healing Co. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DemosSection } from "./demos-section";
import { CreativeSection } from "./creative-section";

function SectionDivider() {
  return (
    <div className="relative">
      <div
        className="mx-auto h-px w-full"
        style={{
          maxWidth: "80vw",
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.25), transparent)",
        }}
      />
    </div>
  );
}

export function ShowcasePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back button */}
      <Link
        href="/"
        className="fixed top-5 left-5 z-50 flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/50 backdrop-blur-md transition-colors hover:border-[rgba(212,175,55,0.3)] hover:text-white/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>

      <div className="pt-20">
        <DemosSection />
      </div>
      <SectionDivider />
      <CreativeSection />

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-white/20">
        &copy; {new Date().getFullYear()} Matthew Miceli / MiracleMind
      </footer>
    </div>
  );
}

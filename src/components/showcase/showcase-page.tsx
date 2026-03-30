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

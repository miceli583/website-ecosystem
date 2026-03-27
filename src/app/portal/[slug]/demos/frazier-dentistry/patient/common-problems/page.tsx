"use client";

import {
  FrazierPageShell,
  SectionCard,
} from "~/components/demos/frazier-page-shell";

const problems = [
  {
    title: "Tooth Decay",
    desc: "Caused by bacteria producing acids that erode enamel. Regular brushing, flossing, and dental visits help prevent cavities.",
  },
  {
    title: "Gum Disease",
    desc: "Ranges from gingivitis (inflammation) to periodontitis (bone loss). Early treatment prevents tooth loss.",
  },
  {
    title: "Tooth Sensitivity",
    desc: "Pain from hot, cold, or sweet foods may indicate exposed roots, worn enamel, or cavities.",
  },
  {
    title: "Toothache",
    desc: "Can signal decay, infection, or fracture. See us promptly — don't wait for the pain to worsen.",
  },
  {
    title: "Bad Breath",
    desc: "Often caused by bacteria on the tongue, gum disease, or dry mouth. Professional cleaning and good hygiene help.",
  },
  {
    title: "Teeth Grinding (Bruxism)",
    desc: "Often occurs during sleep. Can cause jaw pain, headaches, and worn teeth. Custom night guards help.",
  },
];

export default function CommonProblemsPage() {
  return (
    <FrazierPageShell
      title="Common Dental Problems"
      subtitle="Know the signs and when to seek care"
      accent
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {problems.map((p) => (
          <SectionCard key={p.title} title={p.title}>
            <p>{p.desc}</p>
          </SectionCard>
        ))}
      </div>
    </FrazierPageShell>
  );
}

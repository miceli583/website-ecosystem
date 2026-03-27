"use client";

import {
  FrazierPageShell,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

const faqs = [
  {
    q: "How often should I visit the dentist?",
    a: "We recommend visits every six months for routine cleanings and exams. Some patients with specific conditions may need more frequent visits.",
  },
  {
    q: "What should I do about bad breath?",
    a: "Bad breath can be caused by many factors including food, dry mouth, or gum disease. Regular brushing, flossing, and dental cleanings help. If it persists, schedule an appointment.",
  },
  {
    q: "How can I prevent cavities?",
    a: "Brush twice daily with fluoride toothpaste, floss daily, maintain a balanced diet, and visit us regularly for professional cleanings and exams.",
  },
  {
    q: "Are dental X-rays safe?",
    a: "Yes. Modern digital X-rays use very low levels of radiation. We use them only when necessary for proper diagnosis and treatment planning.",
  },
  {
    q: "What payment options do you offer?",
    a: "We accept cash, checks, debit cards, and most PPO insurance plans. We also offer low- and no-interest financing options.",
  },
  {
    q: "Do you see children?",
    a: "Yes! We recommend a child's first dental visit around their first birthday. We provide gentle, kid-friendly care.",
  },
];

export default function FaqPage() {
  return (
    <FrazierPageShell title="Frequently Asked Questions" accent>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="rounded-xl border p-5"
            style={{
              borderColor: FRAZIER_COLORS.beige,
              backgroundColor: "#fff",
            }}
          >
            <h3
              className="mb-2 font-bold"
              style={{ color: FRAZIER_COLORS.brown }}
            >
              {faq.q}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#5a5550" }}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </FrazierPageShell>
  );
}

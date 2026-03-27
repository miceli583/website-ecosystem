"use client";

import {
  FrazierPageShell,
  Prose,
  SectionCard,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

export default function PreventionPage() {
  return (
    <FrazierPageShell
      title="Prevention"
      subtitle="The best dental care starts at home"
      accent
    >
      <Prose>
        <p>
          Preventive dentistry is the practice of caring for your teeth to keep
          them healthy. This helps to avoid cavities, gum disease, enamel wear,
          and more.
        </p>
      </Prose>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SectionCard title="Daily Habits">
          <ul className="list-inside list-disc space-y-1">
            <li>Brush at least twice daily with fluoride toothpaste</li>
            <li>Floss daily to remove plaque between teeth</li>
            <li>Use mouthwash to reduce bacteria</li>
            <li>Replace your toothbrush every 3-4 months</li>
          </ul>
        </SectionCard>
        <SectionCard title="Diet & Nutrition">
          <ul className="list-inside list-disc space-y-1">
            <li>Limit sugary and acidic foods and drinks</li>
            <li>Drink plenty of water throughout the day</li>
            <li>Eat crunchy fruits and vegetables</li>
            <li>Avoid tobacco products</li>
          </ul>
        </SectionCard>
        <SectionCard title="Regular Visits">
          <p>
            Visit us every six months for professional cleanings and exams.
            Early detection of problems saves time, money, and discomfort.
          </p>
        </SectionCard>
        <SectionCard title="Protective Measures">
          <ul className="list-inside list-disc space-y-1">
            <li>Wear a mouthguard during sports</li>
            <li>Use a night guard if you grind your teeth</li>
            <li>Consider dental sealants for children</li>
          </ul>
        </SectionCard>
      </div>
    </FrazierPageShell>
  );
}

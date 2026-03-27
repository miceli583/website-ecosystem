"use client";

import {
  FrazierPageShell,
  Prose,
  SectionCard,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";
import { CheckCircle2 } from "lucide-react";

const insurancePlans = [
  "Aetna PPO",
  "Ameritas PPO",
  "Assurant PPO",
  "Cigna PPO",
  "Connection Dental PPO",
  "Delta Dental PPO",
  "GEHA Dental Connect",
  "Guardian PPO",
  "Humana PPO",
  "MetLife PPO",
  "Principal PPO",
  "United Concordia PPO",
  "United Health Care PPO",
];

export default function FinancialPage() {
  return (
    <FrazierPageShell
      title="Financial Information"
      subtitle="We make quality dental care accessible"
      accent
    >
      <Prose>
        <p>
          We accept cash, checks (with picture ID), money orders, and debit
          cards. We also offer low- and no-interest financing options to help
          make your dental care affordable.
        </p>
      </Prose>

      <div className="mt-8">
        <SectionCard title="Insurance Plans Accepted (PPO)">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {insurancePlans.map((plan) => (
              <div key={plan} className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 shrink-0"
                  style={{ color: FRAZIER_COLORS.copper }}
                />
                <span>{plan}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </FrazierPageShell>
  );
}

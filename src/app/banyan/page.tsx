import { MiracleMindDevHomePage } from "~/components/pages/miraclemind-dev-home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BANYAN - Your Life Operating System | Miracle Mind",
  description:
    "AI-powered integration across all life domains. Daily habits align with your deepest values, goals emerge naturally from your way of being.",
  openGraph: {
    title: "BANYAN - Your Life Operating System",
    description:
      "AI-powered platform integrating all life domains into one cohesive system",
    url: "https://miraclemind.dev/banyan",
  },
};

export default function BanyanPage() {
  return <MiracleMindDevHomePage />;
}

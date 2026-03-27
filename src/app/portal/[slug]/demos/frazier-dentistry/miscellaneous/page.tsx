"use client";

import { use } from "react";
import Link from "next/link";
import { ExternalLink, BookOpen } from "lucide-react";
import {
  FrazierPageShell,
  FRAZIER_COLORS,
} from "~/components/demos/frazier-page-shell";

export default function MiscellaneousPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const base = `/portal/${slug}/demos/frazier-dentistry/miscellaneous`;

  return (
    <FrazierPageShell title="Miscellaneous" accent>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={`${base}/related-links`}
          className="flex items-start gap-4 rounded-xl border p-5 transition-shadow hover:shadow-md"
          style={{ borderColor: FRAZIER_COLORS.beige, backgroundColor: "#fff" }}
        >
          <ExternalLink
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: FRAZIER_COLORS.copper }}
          />
          <div>
            <h3 className="font-bold" style={{ color: FRAZIER_COLORS.brown }}>
              Related Links
            </h3>
            <p className="text-sm" style={{ color: "#5a5550" }}>
              Helpful dental and health resources
            </p>
          </div>
        </Link>
        <Link
          href={`${base}/glossary`}
          className="flex items-start gap-4 rounded-xl border p-5 transition-shadow hover:shadow-md"
          style={{ borderColor: FRAZIER_COLORS.beige, backgroundColor: "#fff" }}
        >
          <BookOpen
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: FRAZIER_COLORS.copper }}
          />
          <div>
            <h3 className="font-bold" style={{ color: FRAZIER_COLORS.brown }}>
              Glossary
            </h3>
            <p className="text-sm" style={{ color: "#5a5550" }}>
              Dental terminology explained
            </p>
          </div>
        </Link>
      </div>
    </FrazierPageShell>
  );
}

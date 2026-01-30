import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service — Miracle Mind",
  description: "Terms of Service for Miracle Mind LLC.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/?domain=dev"
          className="mb-8 inline-flex items-center text-sm text-gray-400 transition-colors hover:text-gray-200"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>

        <h1
          className="mb-8 text-4xl font-bold"
          style={{ fontFamily: "var(--font-quattrocento-sans)" }}
        >
          Terms of Service
        </h1>

        <div className="prose prose-invert max-w-none text-gray-300 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using services provided by Miracle Mind LLC
            (&quot;Company,&quot; &quot;we,&quot; &quot;our&quot;), including
            the websites miraclemind.dev, matthewmiceli.com, and any related
            products or services, you agree to be bound by these Terms of
            Service.
          </p>

          <h2>2. Services</h2>
          <p>
            Miracle Mind LLC provides software development services, AI
            integrations, and digital products including but not limited to
            the BANYAN platform. Services are provided on an as-available
            basis and may be modified or discontinued at our discretion.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            Some services may require account creation. You are responsible
            for maintaining the confidentiality of your account credentials
            and for all activities under your account.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            All content, software, and materials on our platforms are owned by
            Miracle Mind LLC and protected by intellectual property laws.
            Client work is governed by individual service agreements.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Miracle Mind LLC shall
            not be liable for any indirect, incidental, special, or
            consequential damages arising from use of our services.
          </p>

          <h2>6. Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of New York,
            United States, without regard to conflict of law provisions.
          </p>

          <h2>7. Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of our
            services after changes constitutes acceptance of the revised
            terms.
          </p>

          <h2>8. Contact</h2>
          <p>
            For questions about these terms, contact us at{" "}
            <a
              href="mailto:support@miraclemind.live"
              className="underline"
              style={{ color: "#D4AF37" }}
            >
              support@miraclemind.live
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Miracle Mind",
  description: "Privacy Policy for Miracle Mind LLC.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <div className="prose prose-invert max-w-none text-gray-300 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly, such as when you
            create an account, sign up for early access, or contact us. This
            may include your name, email address, and any messages you send.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Communicate with you about updates and features</li>
            <li>Process transactions</li>
            <li>Respond to your requests and support inquiries</li>
          </ul>

          <h2>3. Data Storage</h2>
          <p>
            Your data is stored securely using Supabase infrastructure with
            encryption at rest and in transit. We do not sell your personal
            data to third parties.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>
            We use third-party services for payment processing (Stripe),
            email communications (Resend), and hosting (Vercel). These
            services have their own privacy policies governing their handling
            of your data.
          </p>

          <h2>5. Cookies</h2>
          <p>
            We use essential cookies for authentication and session
            management. We do not use third-party tracking cookies or
            advertising pixels.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data at any time by contacting us. We will respond to
            your request within 30 days.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active or as
            needed to provide you services. You may request deletion at any
            time.
          </p>

          <h2>8. Changes</h2>
          <p>
            We may update this policy from time to time. We will notify you
            of significant changes via email or through our platform.
          </p>

          <h2>9. Contact</h2>
          <p>
            For privacy-related inquiries, contact us at{" "}
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

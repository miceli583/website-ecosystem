import { type Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://miraclemind.live"),
  title: {
    default: "Miracle Mind | Client Portal",
    template: "%s | Miracle Mind Portal",
  },
  description: "Your project dashboard — demos, proposals, tooling, and billing all in one place.",
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "32x32" },
    { rel: "icon", url: "/brand/miracle-mind-orbit-star-v3.svg", type: "image/svg+xml" },
    { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" },
  ],
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Miracle Mind | Client Portal",
    description: "Your project dashboard — demos, proposals, tooling, and billing all in one place.",
    url: "https://miraclemind.live",
    siteName: "Miracle Mind",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Miracle Mind Client Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miracle Mind | Client Portal",
    description: "Your project dashboard — demos, proposals, tooling, and billing all in one place.",
    images: ["/og-image.png"],
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

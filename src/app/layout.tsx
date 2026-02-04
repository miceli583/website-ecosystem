import "~/styles/globals.css";
import "./fonts.css";

import { type Metadata } from "next";
import { Geist, Montserrat, Quattrocento_Sans, Barlow } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://miraclemind.dev"),
  title: "Miracle Mind",
  description: "Technology Empowering Human Sovereignty",
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "32x32" },
    { rel: "icon", url: "/brand/miracle-mind-orbit-star-v3.svg", type: "image/svg+xml" },
    { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" },
  ],
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Miracle Mind",
    description: "Technology Empowering Human Sovereignty",
    url: "https://miraclemind.dev",
    siteName: "Miracle Mind",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Miracle Mind Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miracle Mind",
    description: "Technology Empowering Human Sovereignty",
    images: ["/og-image.png"],
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const quattrocentoSans = Quattrocento_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-quattrocento-sans",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-muli",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${montserrat.variable} ${quattrocentoSans.variable} ${barlow.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
          storageKey="theme"
        >
          <TRPCReactProvider>
            {children}
            <Toaster
              theme="dark"
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "rgba(0, 0, 0, 0.9)",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  color: "#fff",
                },
              }}
            />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

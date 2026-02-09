import { type ReactNode } from "react";

export default function PublicDemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {children}
      <footer className="border-t px-4 py-4 text-center" style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}>
        <p className="text-xs text-gray-500">
          Shared via{" "}
          <a
            href="https://miraclemind.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
            style={{ color: "#D4AF37" }}
          >
            Miracle Mind
          </a>
        </p>
      </footer>
    </div>
  );
}

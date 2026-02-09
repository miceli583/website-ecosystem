import Link from "next/link";

export default function PublicDemoNotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
          border: "1px solid rgba(212, 175, 55, 0.2)",
        }}
      >
        <span className="text-2xl">🔒</span>
      </div>
      <h1
        className="mb-3 text-3xl font-bold"
        style={{
          fontFamily: "Quattrocento Sans, serif",
          letterSpacing: "0.08em",
          background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Demo Not Available
      </h1>
      <p className="mb-8 max-w-md text-gray-400">
        This demo link is no longer active or has been made private.
      </p>
      <Link
        href="https://miraclemind.dev"
        className="rounded-lg px-6 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)" }}
      >
        Visit Miracle Mind
      </Link>
    </div>
  );
}

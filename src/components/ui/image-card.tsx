import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ImageCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
  linkText?: string;
  noBorder?: boolean;
  /** Simple variant: just image + text below, no card wrapper */
  simple?: boolean;
  /** CSS object-position for image cropping (e.g., "right center") */
  imagePosition?: string;
  /** Apply black/gold/white tint effect */
  goldTint?: boolean;
}

export function ImageCard({
  title,
  description,
  imageSrc,
  imageAlt,
  href,
  linkText = "Learn more",
  noBorder = false,
  simple = false,
  imagePosition,
  goldTint = false,
}: ImageCardProps) {
  // Simple variant: no card wrapper, just image + text below
  if (simple) {
    return (
      <div className="group">
        {/* Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              goldTint ? "grayscale" : ""
            }`}
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
          />
          {goldTint && (
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(246,230,193,0.4) 0%, rgba(212,175,55,0.5) 100%)",
                mixBlendMode: "color",
              }}
            />
          )}
        </div>

        {/* Content - separate from image */}
        <div className="mt-4">
          <h3
            className="mb-2 text-lg font-bold uppercase tracking-wide text-white"
            style={{
              fontFamily: "var(--font-quattrocento-sans)",
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-300">
            {description}
          </p>
          {href && (
            <Link
              href={href}
              className="mt-3 inline-flex items-center text-sm font-medium transition-colors hover:underline"
              style={{ color: "#D4AF37" }}
            >
              {linkText} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Card variant (original)
  return (
    <div
      className="group overflow-hidden rounded-lg bg-white/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
      style={noBorder ? {} : {
        borderColor: "rgba(212, 175, 55, 0.3)",
        borderWidth: "1px",
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
        />
        {/* Subtle dark overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className="mb-2 text-lg font-bold uppercase tracking-wide text-white"
          style={{ fontFamily: "var(--font-quattrocento-sans)" }}
        >
          {title}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-300">
          {description}
        </p>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center text-sm font-medium transition-colors hover:underline"
            style={{ color: "#D4AF37" }}
          >
            {linkText} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

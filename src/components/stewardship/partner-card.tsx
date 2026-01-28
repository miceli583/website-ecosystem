import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PartnerCardProps {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function PartnerCard({ name, description, href, icon: Icon }: PartnerCardProps) {
  return (
    <Card
      className="bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
      style={{ borderColor: "rgba(212, 175, 55, 0.3)", borderWidth: "1px" }}
    >
      <CardContent className="p-6 sm:p-8">
        <Icon className="mb-4 h-10 w-10" style={{ color: "#D4AF37" }} />
        <h3
          className="mb-2 text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-quattrocento-sans)" }}
        >
          {name}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-300">
          {description}
        </p>
        <a href={href} target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            size="sm"
            className="border bg-white/5 transition-all hover:bg-white/10"
            style={{
              borderColor: "rgba(212, 175, 55, 0.5)",
              color: "#D4AF37",
            }}
          >
            Visit Partner
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}

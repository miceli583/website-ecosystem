import { cn } from "~/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to show the gold-tinted variant */
  gold?: boolean;
}

function Skeleton({ className, gold, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md",
        gold ? "bg-[#D4AF37]/10" : "bg-white/10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

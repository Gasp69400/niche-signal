import { BRAND_NAME } from "@/lib/brand";
import { LogoMark } from "@/components/LogoMark";

interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md";
}

export function BrandName({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      Niche<span className="text-accent-sky"> Founder</span>
    </span>
  );
}

const MARK_SIZE = { sm: 28, md: 36 } as const;

export function Logo({ showText = false, size = "md" }: LogoProps) {
  const markSize = MARK_SIZE[size];

  if (showText) {
    return (
      <span
        className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-white"
        aria-label={BRAND_NAME}
      >
        <LogoMark
          size={markSize}
          className="shrink-0 drop-shadow-[0_0_14px_rgba(59,130,246,0.45)]"
        />
        <BrandName />
      </span>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center"
      aria-label={BRAND_NAME}
    >
      <LogoMark
        size={markSize}
        className="drop-shadow-[0_0_14px_rgba(59,130,246,0.45)]"
      />
    </div>
  );
}

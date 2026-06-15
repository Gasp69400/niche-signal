interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md";
}

export function Logo({ showText = false, size = "md" }: LogoProps) {
  const dot = size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5";

  if (showText) {
    return (
      <span className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-white">
        <span
          className={`${dot} rounded-full bg-accent-blue shadow-[0_0_12px_rgba(59,130,246,0.8)]`}
        />
        NicheSignal
      </span>
    );
  }

  return (
    <div className="glass-card flex h-9 w-9 items-center justify-center rounded-xl">
      <span
        className={`${dot} rounded-full bg-accent-blue shadow-[0_0_12px_rgba(59,130,246,0.8)]`}
      />
    </div>
  );
}

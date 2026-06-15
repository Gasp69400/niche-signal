function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/10 ${className}`} />;
}

function SkeletonSection({ titleWidth = "w-32" }: { titleWidth?: string }) {
  return (
    <section className="mt-8">
      <SkeletonBlock className={`mb-4 h-3 ${titleWidth}`} />
      <div className="glass-card rounded-2xl p-6">
        <SkeletonBlock className="h-48 w-full" />
      </div>
    </section>
  );
}

export function ReportSkeleton() {
  return (
    <div className="w-full pb-24">
      <div className="glass-card mb-6 rounded-2xl p-6">
        <SkeletonBlock className="mb-3 h-3 w-28" />
        <SkeletonBlock className="h-8 w-2/3" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <SkeletonBlock className="mb-3 h-3 w-24" />
            <SkeletonBlock className="h-8 w-16" />
          </div>
        ))}
      </div>

      <SkeletonSection titleWidth="w-36" />
      <SkeletonSection titleWidth="w-28" />

      <section className="mt-8">
        <SkeletonBlock className="mb-4 h-3 w-24" />
        <div className="glass-card space-y-4 rounded-2xl p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="mb-2 flex justify-between">
                <SkeletonBlock className="h-4 w-3/5" />
                <SkeletonBlock className="h-4 w-10" />
              </div>
              <SkeletonBlock className="h-2 w-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SkeletonBlock className="mb-4 h-3 w-24" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <SkeletonBlock className="mb-4 h-5 w-2/3" />
              <div className="space-y-3">
                <SkeletonBlock className="h-3 w-full" />
                <SkeletonBlock className="h-3 w-4/5" />
                <SkeletonBlock className="h-3 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <SkeletonSection titleWidth="w-40" />
      <SkeletonSection titleWidth="w-44" />

      <section className="mt-8">
        <SkeletonBlock className="mb-4 h-3 w-16" />
        <div className="glass-card rounded-2xl p-6">
          <SkeletonBlock className="mb-3 h-5 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
        </div>
      </section>

      <section className="mt-8">
        <SkeletonBlock className="mb-4 h-3 w-48" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-12 w-48" />
          ))}
        </div>
      </section>

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
        <svg
          className="h-4 w-4 animate-spin text-accent-blue"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647Z"
          />
        </svg>
        <span>Analyse en cours par IA...</span>
      </div>
    </div>
  );
}

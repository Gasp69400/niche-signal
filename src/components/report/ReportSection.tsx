export function ReportSection({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mt-8 ${className}`}>
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
        {label}
      </p>
      {children}
    </section>
  );
}

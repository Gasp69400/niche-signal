import { Logo } from "@/components/Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 px-6 py-5 backdrop-blur-xl sm:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a
          href="/"
          className="group flex items-center gap-3.5 transition-opacity hover:opacity-90"
        >
          <Logo />
          <div className="flex flex-col">
            <span className="text-[1.15rem] font-semibold tracking-tight text-slate-900">
              Niche<span className="text-accent-blue"> Founder</span>
            </span>
            <span className="text-[11px] font-medium tracking-[0.12em] text-slate-400">
              INTELLIGENCE MARCHÉ SAAS
            </span>
          </div>
        </a>
        <nav className="hidden items-center gap-8 text-[13px] font-medium text-slate-500 sm:flex">
          <a href="#" className="transition-colors hover:text-slate-900">
            Fonctionnalités
          </a>
          <a href="#" className="transition-colors hover:text-slate-900">
            Tarifs
          </a>
          <a
            href="#"
            className="rounded-full bg-accent-blue px-5 py-2.5 text-white shadow-glow-sm transition hover:bg-accent-blue/90"
          >
            Connexion
          </a>
        </nav>
      </div>
    </header>
  );
}

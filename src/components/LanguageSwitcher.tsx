"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { useI18n } from "@/contexts/I18nContext";

export function LanguageSwitcher() {
  const { locale } = useI18n();
  const pathname = usePathname();

  function switchPath(target: Locale) {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }

  return (
    <div className="glass-pill flex items-center rounded-lg p-0.5 text-xs font-semibold">
      {(["en", "fr"] as const).map((lang) => (
        <Link
          key={lang}
          href={switchPath(lang)}
          className={`rounded-md px-2.5 py-1 uppercase transition ${
            locale === lang
              ? "bg-accent-blue/20 text-accent-blue"
              : "text-muted hover:text-white"
          }`}
        >
          {lang}
        </Link>
      ))}
    </div>
  );
}

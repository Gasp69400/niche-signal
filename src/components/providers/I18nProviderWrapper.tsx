"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { I18nProvider } from "@/contexts/I18nContext";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export function I18nProviderWrapper({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const locale = useMemo(() => {
    const segment = pathname.split("/")[1];
    return isValidLocale(segment) ? segment : initialLocale;
  }, [pathname, initialLocale]);

  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      {children}
    </I18nProvider>
  );
}

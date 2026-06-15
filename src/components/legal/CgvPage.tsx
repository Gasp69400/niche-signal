"use client";

import { useI18n } from "@/contexts/I18nContext";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { CgvContentFr } from "@/components/legal/CgvContentFr";
import { CgvContentEn } from "@/components/legal/CgvContentEn";

export function CgvPage() {
  const { locale, t } = useI18n();

  return (
    <LegalLayout title={t.legal.cgvTitle} lastUpdated="June 10, 2026">
      {locale === "fr" ? <CgvContentFr /> : <CgvContentEn />}
    </LegalLayout>
  );
}

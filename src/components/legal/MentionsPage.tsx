"use client";

import { useI18n } from "@/contexts/I18nContext";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { MentionsContentFr } from "@/components/legal/MentionsContentFr";
import { MentionsContentEn } from "@/components/legal/MentionsContentEn";

export function MentionsPage() {
  const { locale, t } = useI18n();

  return (
    <LegalLayout title={t.legal.mentionsTitle} lastUpdated="June 10, 2026">
      {locale === "fr" ? <MentionsContentFr /> : <MentionsContentEn />}
    </LegalLayout>
  );
}

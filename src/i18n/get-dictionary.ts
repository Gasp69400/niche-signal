import type { Locale } from "./config";
import type { Dictionary } from "@/i18n/types";
import { en } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

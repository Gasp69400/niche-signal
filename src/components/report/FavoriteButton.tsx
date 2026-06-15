"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/fetch";
import { useI18n } from "@/contexts/I18nContext";

interface FavoriteButtonProps {
  reportId?: string;
  isFavorite?: boolean;
  onToggle?: (next: boolean) => void;
  size?: "sm" | "md";
}

export function FavoriteButton({
  reportId,
  isFavorite = false,
  onToggle,
  size = "md",
}: FavoriteButtonProps) {
  const { t } = useI18n();
  const [favorited, setFavorited] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite);
  }, [isFavorite]);

  const iconSize = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  const buttonSize = size === "sm" ? "h-9 w-9" : "h-11 w-11";

  async function handleClick() {
    if (!reportId || loading) return;

    const next = !favorited;
    setLoading(true);

    try {
      const res = await apiFetch(`/api/reports/${reportId}/favorite`, {
        method: "POST",
        body: JSON.stringify({ favorite: next }),
      });

      if (!res.ok) {
        throw new Error("Failed");
      }

      const data = await res.json();
      setFavorited(data.isFavorite);
      onToggle?.(data.isFavorite);
    } catch {
      /* keep previous state */
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!reportId || loading}
      title={favorited ? t.favorites.remove : t.favorites.add}
      aria-label={favorited ? t.favorites.remove : t.favorites.add}
      className={`btn-glow inline-flex ${buttonSize} shrink-0 items-center justify-center rounded-xl border transition ${
        favorited
          ? "border-rose-500/40 bg-rose-500/15 text-rose-400"
          : "border-glass-border bg-white/5 text-muted hover:border-rose-500/30 hover:text-rose-400"
      } disabled:opacity-50`}
    >
      <svg
        className={iconSize}
        viewBox="0 0 24 24"
        fill={favorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}

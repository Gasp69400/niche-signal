"use client";

import type { PositioningAngle as PositioningAngleType } from "@/types/market-report";

export function PositioningAngle({ positioning }: { positioning: PositioningAngleType }) {
  return (
    <div className="rounded-2xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 p-6 shadow-[0_0_40px_rgba(139,92,246,0.15)] backdrop-blur-xl">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6]">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a.75.75 0 0 0 .75.75h6a.75.75 0 0 0 .75-.75v-.75h-7.5v.75ZM12 2.25c-3.728 0-6.75 2.922-6.75 6.75a5.25 5.25 0 0 0 3.75 5.054v1.336a.75.75 0 0 0 .75.75h6a.75.75 0 0 0 .75-.75v-1.336a5.25 5.25 0 0 0 3.75-5.054C18.75 5.172 15.728 2.25 12 2.25Z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-base font-medium leading-relaxed text-white">
            &ldquo;{positioning.oneLiner}&rdquo;
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {positioning.differentiators.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/15 px-3 py-1 text-xs font-medium text-white/90"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

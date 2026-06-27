import { useId } from "react";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 36, className = "" }: LogoMarkProps) {
  const uid = useId().replace(/:/g, "");
  const bgId = `logo-bg-${uid}`;
  const barId = `logo-bar-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={bgId}
          x1="18"
          y1="2"
          x2="18"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#38BDF8" />
          <stop offset="0.45" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient
          id={barId}
          x1="18"
          y1="10"
          x2="18"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <rect width="36" height="36" rx="10" fill={`url(#${bgId})`} />
      <rect
        x="1"
        y="1"
        width="34"
        height="34"
        rx="9"
        stroke="white"
        strokeOpacity="0.18"
        strokeWidth="0.75"
        fill="none"
      />

      <rect x="7.5" y="22" width="4.5" height="7.5" rx="1.25" fill={`url(#${barId})`} />
      <rect x="14.25" y="17" width="4.5" height="12.5" rx="1.25" fill={`url(#${barId})`} />
      <rect x="21" y="11.5" width="4.5" height="18" rx="1.25" fill={`url(#${barId})`} />

      <circle cx="23.25" cy="8.5" r="3.25" fill="#38BDF8" fillOpacity="0.35" />
      <circle cx="23.25" cy="8.5" r="2" fill="#E0F2FE" />
      <circle cx="23.25" cy="8.5" r="0.9" fill="white" fillOpacity="0.95" />
    </svg>
  );
}

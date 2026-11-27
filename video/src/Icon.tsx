import React from "react";
import type { IconName } from "./types";

// Simple stroke icons drawn on a 100x100 grid.
const paths: Record<IconName, React.ReactNode> = {
  invoice: (
    <>
      <path d="M26 10h36l14 14v66H26z" />
      <path d="M62 10v14h14" />
      <path d="M36 42h28M36 54h28M36 66h18" />
    </>
  ),
  receipt: (
    <>
      <path d="M28 10h44v80l-7-5-7 5-7-5-7 5-7-5-9 5z" />
      <path d="M38 32h24M38 46h24M38 60h14" />
    </>
  ),
  bank: (
    <>
      <path d="M12 38 50 16l38 22z" />
      <path d="M22 44v30M40 44v30M60 44v30M78 44v30" />
      <path d="M14 82h72" />
    </>
  ),
  chart: (
    <>
      <path d="M14 86h72" />
      <path d="M24 86V60M42 86V44M60 86V52M78 86V28" strokeWidth={10} />
      <path d="M20 46 40 30l18 10 24-22" />
    </>
  ),
  check: <path d="M20 52 40 72 80 30" strokeWidth={12} />,
  calendar: (
    <>
      <rect x="16" y="22" width="68" height="64" rx="8" />
      <path d="M16 40h68M34 12v18M66 12v18" />
      <path d="M32 56h8M48 56h8M64 56h4M32 70h8M48 70h8" />
    </>
  ),
  dollar: (
    <>
      <circle cx="50" cy="50" r="38" />
      <path d="M62 36c-3-5-8-7-13-7-7 0-12 4-12 10 0 13 26 8 26 22 0 6-6 10-13 10-6 0-11-3-14-8" />
      <path d="M50 22v8M50 72v8" />
    </>
  ),
  alert: (
    <>
      <path d="M50 12 90 84H10z" />
      <path d="M50 40v20M50 70v2" />
    </>
  ),
  laptop: (
    <>
      <rect x="20" y="22" width="60" height="42" rx="4" />
      <path d="M10 76h80l-6-10H16z" />
    </>
  ),
  phone: (
    <>
      <rect x="30" y="10" width="40" height="80" rx="8" />
      <path d="M44 80h12" />
    </>
  ),
  clock: (
    <>
      <circle cx="50" cy="50" r="38" />
      <path d="M50 28v24l16 10" />
    </>
  ),
  users: (
    <>
      <circle cx="38" cy="36" r="13" />
      <path d="M14 82c2-16 12-24 24-24s22 8 24 24" />
      <circle cx="68" cy="40" r="10" />
      <path d="M66 58c11 0 19 7 21 22" />
    </>
  ),
};

export const Icon: React.FC<{ name: IconName; size: number; color: string; glow?: boolean }> = ({
  name,
  size,
  color,
  glow,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    stroke={color}
    strokeWidth={6}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={glow ? { filter: `drop-shadow(0 0 18px ${color}AA)` } : undefined}
  >
    {paths[name]}
  </svg>
);

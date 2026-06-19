import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Logo thương hiệu của app (KHÔNG dùng asset mặc định của Next.js).
 * Mark: badge gradient + glyph "link" tượng trưng cho việc rút gọn URL.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="URL Shortener Pro"
    >
      <rect width="32" height="32" rx="8" fill="url(#usp-logo-grad)" />
      <g
        transform="translate(4 4)"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </g>
      <defs>
        <linearGradient
          id="usp-logo-grad"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export type LogoProps = {
  /** Ẩn wordmark, chỉ hiển thị mark (ví dụ trên màn hình hẹp). */
  iconOnly?: boolean;
  className?: string;
};

/** Logo đầy đủ: mark + wordmark "URL Shortener Pro". */
export function Logo({ iconOnly = false, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark className="size-7 shrink-0" />
      {!iconOnly && (
        <span className="text-lg font-semibold tracking-tight">
          URL Shortener <span className="text-indigo-500">Pro</span>
        </span>
      )}
    </span>
  );
}

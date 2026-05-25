import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  size = 28,
  withText = true,
  className,
  href = "/",
}: {
  size?: number;
  withText?: boolean;
  className?: string;
  href?: string | null;
}) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <defs>
          <linearGradient id="lg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#4458ff" />
            <stop offset=".5" stopColor="#a855f7" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#lg)" />
        <path
          d="M20 44 V20 h6 l12 16 V20 h6 v24 h-6 L26 28 v16 z"
          fill="#fff"
        />
      </svg>
      {withText && (
        <span className="font-display font-semibold tracking-tight text-fg">
          NextGen<span className="text-fg-muted"> AI</span>
        </span>
      )}
    </span>
  );
  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}

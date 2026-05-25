import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-bg-soft via-bg-elev to-bg-soft bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 rounded-full border-2 border-fg-muted/40 border-t-fg-muted animate-spin",
        className
      )}
    />
  );
}

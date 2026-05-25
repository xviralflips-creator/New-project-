import { cn } from "@/lib/utils";

export function Empty({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-bg-soft text-fg-muted">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="max-w-md text-sm text-fg-muted">{description}</p>
      )}
      {action}
    </div>
  );
}

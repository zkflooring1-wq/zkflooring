import { type LucideIcon, Inbox } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-obsidian-50 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-obsidian-300" />
      </div>
      <h3 className="text-base font-semibold text-obsidian-700">{title}</h3>
      {description && (
        <p className="text-sm text-obsidian-400 mt-1 max-w-sm">{description}</p>
      )}
      {actionLabel &&
        (actionHref ? (
          <Link
            href={actionHref}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 gold-gradient text-obsidian-900 font-semibold rounded-[var(--radius-button)] hover:opacity-90 transition-all text-sm"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 gold-gradient text-obsidian-900 font-semibold rounded-[var(--radius-button)] hover:opacity-90 transition-all text-sm"
          >
            {actionLabel}
          </button>
        ))}
    </div>
  );
}
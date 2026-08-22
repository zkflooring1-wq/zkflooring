import Link from "next/link";
import { Plus, type LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
}

export default function PageHeader({
  title,
  description,
  actionLabel,
  actionHref,
  actionIcon: ActionIcon = Plus,
  onAction,
}: PageHeaderProps) {
  const ActionButton = () => (
    <button
      onClick={onAction}
      className="inline-flex items-center gap-2 px-4 py-2.5 gold-gradient text-obsidian-900 font-semibold rounded-[var(--radius-button)] hover:opacity-90 transition-all text-sm shadow-md shadow-gold-500/10"
    >
      <ActionIcon className="w-4 h-4" />
      {actionLabel}
    </button>
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-obsidian-800 font-[var(--font-heading)]">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-obsidian-400 mt-1">{description}</p>
        )}
      </div>
      {actionLabel &&
        (actionHref ? (
          <Link href={actionHref}>
            <ActionButton />
          </Link>
        ) : (
          <ActionButton />
        ))}
    </div>
  );
}
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color?: "gold" | "blue" | "green" | "purple";
}

const colorMap = {
  gold: "bg-gold-400/10 text-gold-500",
  blue: "bg-blue-500/10 text-blue-500",
  green: "bg-emerald-500/10 text-emerald-500",
  purple: "bg-purple-500/10 text-purple-500",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color = "gold",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-[var(--radius-card)] p-5 shadow-sm border border-obsidian-100/50 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-obsidian-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-obsidian-800 mt-1 font-[var(--font-heading)]">
            {value}
          </p>
          {trend && (
            <p className="text-xs text-obsidian-300 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
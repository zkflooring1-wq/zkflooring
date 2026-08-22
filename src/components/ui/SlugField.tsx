"use client";

import { useState } from "react";
import { Link2, Pencil } from "lucide-react";

interface SlugFieldProps {
  value: string;
  onChange: (value: string) => void;
  titleValue: string;
  error?: string;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function SlugField({
  value,
  onChange,
  titleValue,
  error,
}: SlugFieldProps) {
  const [isManual, setIsManual] = useState(false);

  const handleAutoGenerate = () => {
    onChange(generateSlug(titleValue));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-obsidian-700">
          Slug <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoGenerate}
            className="text-[11px] text-gold-500 hover:text-gold-600 font-medium"
          >
            Auto-generate
          </button>
          <button
            type="button"
            onClick={() => setIsManual(!isManual)}
            className="text-obsidian-400 hover:text-obsidian-600"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="relative">
        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(generateSlug(e.target.value))}
          readOnly={!isManual}
          className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-[var(--radius-input)] text-sm text-obsidian-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all ${
            error ? "border-red-300" : "border-obsidian-200"
          } ${!isManual ? "bg-obsidian-50" : ""}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
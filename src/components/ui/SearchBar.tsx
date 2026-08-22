"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-300" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm text-obsidian-700 placeholder-obsidian-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-300 hover:text-obsidian-500"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
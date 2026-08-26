"use client";

import React from 'react';
import FormField from "@/components/ui/FormField";
import { Plus, Trash2, Repeat, Sparkles } from "lucide-react";

interface Props {
  data: string[];
  onChange: (data: string[]) => void;
}

const DEFAULT_MARQUEE_ITEMS = [
  "Carpet Flooring",
  "Carpet Tile",
  "Vinyl Flooring",
  "LVT Flooring",
  "Professional Installation",
  "Self Levelling",
  "Floor Preparation"
];

export default function MarqueeEditor({ data = [], onChange }: Props) {
  const items = data && data.length > 0 ? data : DEFAULT_MARQUEE_ITEMS;

  const handleAdd = () => {
    onChange([...items, "New Flooring Keyword"]);
  };

  const updateItem = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      alert("At least one ticker item is required.");
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
          <div>
            <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-gold-600" />
              Marquee Ticker Ribbons ({items.length})
            </h3>
            <p className="text-xs text-obsidian-500">Keywords scrolling infinitely across the gold ribbon.</p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-obsidian-900 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] rounded-lg shadow-sm hover:brightness-105 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Keyword
          </button>
        </div>

        <div className="space-y-2.5">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 bg-obsidian-50/70 border border-obsidian-200/70 rounded-lg p-1.5 px-2.5">
              <span className="text-[10px] font-mono font-bold text-gold-700 w-5">
                {String(index + 1).padStart(2, '0')}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder="e.g. Carpet Flooring"
                className="flex-1 text-sm font-semibold text-obsidian-800 bg-transparent focus:outline-none focus:text-gold-900"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-1 text-obsidian-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


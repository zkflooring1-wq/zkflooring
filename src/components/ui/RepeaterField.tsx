"use client";

import { Plus, GripVertical, Trash2 } from "lucide-react";

interface RepeaterFieldProps {
  value: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholder?: string;
  addLabel?: string;
}

export default function RepeaterField({
  value,
  onChange,
  label,
  placeholder = "Enter value...",
  addLabel = "Add Item",
}: RepeaterFieldProps) {
  const addItem = () => {
    onChange([...value, ""]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, newValue: string) => {
    const updated = [...value];
    updated[index] = newValue;
    onChange(updated);
  };

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const updated = [...value];
    const [removed] = updated.splice(from, 1);
    updated.splice(to, 0, removed);
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-obsidian-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <button
              type="button"
              className="cursor-grab text-obsidian-300 hover:text-obsidian-500 flex-shrink-0"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => moveItem(index, index - 1)}
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm text-obsidian-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="flex-shrink-0 p-1.5 text-obsidian-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-2 inline-flex items-center gap-1.5 text-sm text-gold-500 hover:text-gold-600 font-medium transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        {addLabel}
      </button>
    </div>
  );
}
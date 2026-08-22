import React from 'react';
import FormField from "@/components/ui/FormField";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Props {
  data: string[];
  onChange: (data: string[]) => void;
}

export default function MarqueeEditor({ data = [], onChange }: Props) {
  const handleAdd = () => {
    onChange([...data, "New Item"]);
  };

  const updateItem = (index: number, value: string) => {
    const newData = [...data];
    newData[index] = value;
    onChange(newData);
  };

  const removeItem = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)]">Marquee Items</h3>
        <button onClick={handleAdd} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-obsidian-700 rounded-lg hover:bg-obsidian-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="cursor-grab text-obsidian-300"><GripVertical className="w-4 h-4" /></div>
            <input 
              type="text" 
              value={item} 
              onChange={e => updateItem(index, e.target.value)} 
              className="flex-1 px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" 
            />
            <button onClick={() => removeItem(index)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

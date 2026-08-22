import React from 'react';
import FormField from "@/components/ui/FormField";
import { Plus, Trash2 } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";

export interface BlogCard {
  image: string;
  date: string;
  title: string;
  link: string;
  comments: string;
}

export interface BlogData {
  section_subtitle: string;
  section_title: string;
  cards: BlogCard[];
}

interface Props {
  data: BlogData;
  onChange: (data: BlogData) => void;
}

export default function BlogEditor({ data, onChange }: Props) {
  const currentData = {
    section_subtitle: data?.section_subtitle || "",
    section_title: data?.section_title || "",
    cards: data?.cards || []
  };

  const updateField = (key: keyof BlogData, value: any) => {
    onChange({ ...currentData, [key]: value });
  };

  const handleAddCard = () => {
    updateField('cards', [...currentData.cards, { image: "", date: "", title: "", link: "", comments: "" }]);
  };

  const updateCard = (index: number, key: keyof BlogCard, value: any) => {
    const newCards = [...currentData.cards];
    newCards[index] = { ...newCards[index], [key]: value };
    updateField('cards', newCards);
  };

  const removeCard = (index: number) => {
    const newCards = [...currentData.cards];
    newCards.splice(index, 1);
    updateField('cards', newCards);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)] mb-4">Section Header</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Section Subtitle"><input type="text" value={currentData.section_subtitle} onChange={e => updateField('section_subtitle', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
          <FormField label="Section Title (HTML allowed)"><input type="text" value={currentData.section_title} onChange={e => updateField('section_title', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
        </div>
      </div>

      <hr className="border-obsidian-100" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)]">Blog Highlights</h3>
          <button onClick={handleAddCard} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-obsidian-700 rounded-lg hover:bg-obsidian-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Highlight
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentData.cards.map((card, index) => (
            <div key={index} className="p-4 border border-obsidian-100 rounded-[var(--radius-card)] bg-white shadow-sm space-y-4 relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => removeCard(index)} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>

              <FormField label="Title (HTML allowed)"><input type="text" value={card.title} onChange={e => updateCard(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Date"><input type="text" value={card.date} onChange={e => updateCard(index, 'date', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
                <FormField label="Comments (e.g. (2) Comments)"><input type="text" value={card.comments} onChange={e => updateCard(index, 'comments', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              </div>
              
              <FormField label="Link URL"><input type="text" value={card.link} onChange={e => updateCard(index, 'link', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>

              <FormField label="Blog Image">
                <ImageUploader value={card.image} onChange={url => updateCard(index, 'image', url)} />
              </FormField>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

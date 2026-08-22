import React from 'react';
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import { Plus, Trash2 } from "lucide-react";

export interface ServiceCard {
  number: string;
  image: string;
  sub_heading: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
}

export interface ServicesData {
  section_subtitle: string;
  section_title: string;
  cards: ServiceCard[];
}

interface Props {
  data: ServicesData;
  onChange: (data: ServicesData) => void;
}

export default function ServicesEditor({ data, onChange }: Props) {
  const currentData = {
    section_subtitle: data?.section_subtitle || "",
    section_title: data?.section_title || "",
    cards: data?.cards || []
  };

  const updateField = (key: keyof ServicesData, value: any) => {
    onChange({ ...currentData, [key]: value });
  };

  const handleAddCard = () => {
    updateField('cards', [...currentData.cards, {
      number: `0${currentData.cards.length + 1}.`,
      image: "",
      sub_heading: "",
      title: "",
      description: "",
      link: "/contact",
      tags: ["", "", "", ""]
    }]);
  };

  const updateCard = (index: number, key: keyof ServiceCard, value: any) => {
    const newCards = [...currentData.cards];
    newCards[index] = { ...newCards[index], [key]: value };
    updateField('cards', newCards);
  };

  const updateTag = (cardIndex: number, tagIndex: number, value: string) => {
    const newCards = [...currentData.cards];
    const newTags = [...newCards[cardIndex].tags];
    newTags[tagIndex] = value;
    newCards[cardIndex] = { ...newCards[cardIndex], tags: newTags };
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
          <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)]">Service Cards</h3>
          <button onClick={handleAddCard} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-obsidian-700 rounded-lg hover:bg-obsidian-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Card
          </button>
        </div>

        <div className="space-y-6">
          {currentData.cards.map((card, index) => (
            <div key={index} className="p-5 border border-obsidian-100 rounded-[var(--radius-card)] bg-white shadow-sm space-y-4 relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => removeCard(index)} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Number (e.g. 01.)"><input type="text" value={card.number} onChange={e => updateCard(index, 'number', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
                <FormField label="Sub-heading (e.g. PREPARATION)"><input type="text" value={card.sub_heading} onChange={e => updateCard(index, 'sub_heading', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
                <FormField label="Link URL"><input type="text" value={card.link} onChange={e => updateCard(index, 'link', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              </div>
              
              <FormField label="Title (HTML allowed)"><input type="text" value={card.title} onChange={e => updateCard(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              <FormField label="Description (HTML allowed)"><textarea value={card.description} onChange={e => updateCard(index, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" /></FormField>
              
              <div>
                <h5 className="text-sm font-semibold text-obsidian-600 mb-2">Tags (Max 4)</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map(tagIndex => (
                    <input key={tagIndex} type="text" placeholder={`Tag ${tagIndex + 1}`} value={card.tags[tagIndex] || ""} onChange={e => updateTag(index, tagIndex, e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" />
                  ))}
                </div>
              </div>

              <FormField label="Card Image">
                <ImageUploader value={card.image} onChange={url => updateCard(index, 'image', url)} />
              </FormField>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import { Plus, Trash2, GripVertical } from "lucide-react";

export interface HeroSlide {
  title: string;
  sub_title: string;
  description: string;
  bg_image: string;
  cta_text: string;
  cta_link: string;
  video_url: string;
}

interface Props {
  data: HeroSlide[];
  onChange: (data: HeroSlide[]) => void;
}

export default function HeroEditor({ data = [], onChange }: Props) {
  const handleAdd = () => {
    onChange([...data, {
      title: "New Slide",
      sub_title: "",
      description: "",
      bg_image: "",
      cta_text: "",
      cta_link: "",
      video_url: ""
    }]);
  };

  const updateSlide = (index: number, key: keyof HeroSlide, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [key]: value };
    onChange(newData);
  };

  const removeSlide = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)]">Hero Slider</h3>
        <button onClick={handleAdd} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-obsidian-700 rounded-lg hover:bg-obsidian-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      {data.length === 0 && <p className="text-sm text-gray-500">No slides added. Click "Add Slide" to begin.</p>}

      <div className="space-y-4">
        {data.map((slide, index) => (
          <div key={index} className="p-5 border border-obsidian-100 rounded-[var(--radius-card)] bg-white shadow-sm space-y-4 relative group">
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => removeSlide(index)} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Slide Title (HTML allowed)"><input type="text" value={slide.title} onChange={e => updateSlide(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              <FormField label="Subtitle"><input type="text" value={slide.sub_title} onChange={e => updateSlide(index, 'sub_title', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
            </div>
            <FormField label="Description"><textarea value={slide.description} onChange={e => updateSlide(index, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" /></FormField>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="CTA Text"><input type="text" value={slide.cta_text} onChange={e => updateSlide(index, 'cta_text', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              <FormField label="CTA Link"><input type="text" value={slide.cta_link} onChange={e => updateSlide(index, 'cta_link', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              <FormField label="Video URL (YouTube)"><input type="text" value={slide.video_url} onChange={e => updateSlide(index, 'video_url', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
            </div>

            <FormField label="Background Image">
              <ImageUploader value={slide.bg_image} onChange={url => updateSlide(index, 'bg_image', url)} />
            </FormField>
          </div>
        ))}
      </div>
    </div>
  );
}

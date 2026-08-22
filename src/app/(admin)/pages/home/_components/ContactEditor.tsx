import React from 'react';
import FormField from "@/components/ui/FormField";

export interface ContactData {
  title: string;
  sub_title: string;
  card_label: string;
  card_phone: string;
  card_phone_link: string;
}

interface Props {
  data: ContactData;
  onChange: (data: ContactData) => void;
}

export default function ContactEditor({ data, onChange }: Props) {
  const currentData = {
    title: data?.title || "",
    sub_title: data?.sub_title || "",
    card_label: data?.card_label || "",
    card_phone: data?.card_phone || "",
    card_phone_link: data?.card_phone_link || ""
  };

  const updateField = (key: keyof ContactData, value: string) => {
    onChange({ ...currentData, [key]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)] mb-4">Contact Callback Banner</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Title (HTML allowed)"><input type="text" value={currentData.title} onChange={e => updateField('title', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
        <FormField label="Subtitle"><input type="text" value={currentData.sub_title} onChange={e => updateField('sub_title', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="Card Label"><input type="text" value={currentData.card_label} onChange={e => updateField('card_label', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
        <FormField label="Card Phone Number"><input type="text" value={currentData.card_phone} onChange={e => updateField('card_phone', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
        <FormField label="Card Phone Link (e.g. tel:...)"><input type="text" value={currentData.card_phone_link} onChange={e => updateField('card_phone_link', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
      </div>
    </div>
  );
}

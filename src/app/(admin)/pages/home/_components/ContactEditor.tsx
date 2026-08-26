"use client";

import React from 'react';
import FormField from "@/components/ui/FormField";
import { PhoneCall, MessageCircle, Link as LinkIcon } from "lucide-react";

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
  const currentData: ContactData = {
    title: data?.title || "Connect with us for next <br />Gen Flooring Projects",
    sub_title: data?.sub_title || "Get in Touch",
    card_label: data?.card_label || "Call us anytime",
    card_phone: data?.card_phone || "07903723774",
    card_phone_link: data?.card_phone_link || "tel:07903723774"
  };

  const updateField = (key: keyof ContactData, value: string) => {
    onChange({ ...currentData, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
          <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-gold-600" />
            Contact &amp; Direct Consultation Banner
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Section Subtitle">
            <input
              type="text"
              value={currentData.sub_title}
              onChange={(e) => updateField('sub_title', e.target.value)}
              placeholder="Get in Touch"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>

          <FormField label="Main Banner Title (HTML allowed)">
            <input
              type="text"
              value={currentData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Connect with us for next <br />Gen Flooring Projects"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormField label="Card Label">
            <input
              type="text"
              value={currentData.card_label}
              onChange={(e) => updateField('card_label', e.target.value)}
              placeholder="Call us anytime"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>

          <FormField label="Phone Display">
            <input
              type="text"
              value={currentData.card_phone}
              onChange={(e) => updateField('card_phone', e.target.value)}
              placeholder="07903723774"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>

          <FormField label="Phone Action Link">
            <input
              type="text"
              value={currentData.card_phone_link}
              onChange={(e) => updateField('card_phone_link', e.target.value)}
              placeholder="tel:07903723774"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-mono focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}


"use client";

import React from 'react';
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import { Info, Image as ImageIcon, Link as LinkIcon, Type, Award } from "lucide-react";

export interface AboutData {
  title: string;
  sub_title: string;
  since_text: string;
  description: string;
  main_image: string;
  side_image: string;
  cta_text: string;
  cta_link: string;
}

interface Props {
  data: AboutData;
  onChange: (data: AboutData) => void;
}

export default function AboutEditor({ data, onChange }: Props) {
  const currentData: AboutData = {
    sub_title: data?.sub_title || "WHO WE ARE",
    title: data?.title || "Transforming Spaces with <br /> Precision and Quality Craftsmanship",
    since_text: data?.since_text || "Since 2007",
    description: data?.description || "ZK Flooring is Birmingham's trusted contractor for carpets, laminate, engineered wood, vinyl, and subfloor preparation. We service a 100-200 mile radius from Hobmoor Road, Small Heath.",
    main_image: data?.main_image || "/assets/images/about/hm1-img01.webp",
    side_image: data?.side_image || "/assets/images/about/hm1-img03.webp",
    cta_text: data?.cta_text || "Explore More",
    cta_link: data?.cta_link || "/about",
  };

  const updateField = (key: keyof AboutData, value: string) => {
    onChange({ ...currentData, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header & Subtitle */}
      <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
        <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
          <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-gold-600" />
            About Section Details
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Section Subtitle">
            <input
              type="text"
              value={currentData.sub_title}
              onChange={(e) => updateField('sub_title', e.target.value)}
              placeholder="WHO WE ARE"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>

          <FormField label="Experience Badge Text">
            <input
              type="text"
              value={currentData.since_text}
              onChange={(e) => updateField('since_text', e.target.value)}
              placeholder="Since 2007"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>
        </div>

        <FormField label="Main Heading Title (HTML allowed)">
          <textarea
            rows={2}
            value={currentData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Transforming Spaces with <br /> Precision and Quality Craftsmanship"
            className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500 font-mono resize-none"
          />
        </FormField>

        <FormField label="About Description Text">
          <textarea
            rows={3}
            value={currentData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Detailed description of ZK Flooring history and craftsmanship..."
            className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 leading-relaxed focus:bg-white focus:outline-none focus:border-gold-500 resize-none"
          />
        </FormField>
      </div>

      {/* Images Setup */}
      <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
        <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2 border-b border-obsidian-100 pb-2">
          <ImageIcon className="w-4 h-4 text-gold-600" />
          Showcase Images
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Main Image">
            <ImageUploader
              value={currentData.main_image}
              onChange={(url) => updateField('main_image', url)}
            />
          </FormField>

          <FormField label="Side Accent Image">
            <ImageUploader
              value={currentData.side_image}
              onChange={(url) => updateField('side_image', url)}
            />
          </FormField>
        </div>
      </div>

      {/* Button Settings */}
      <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
        <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2 border-b border-obsidian-100 pb-2">
          <LinkIcon className="w-4 h-4 text-gold-600" />
          Action Button
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Button Text">
            <input
              type="text"
              value={currentData.cta_text}
              onChange={(e) => updateField('cta_text', e.target.value)}
              placeholder="Explore More"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>

          <FormField label="Destination URL">
            <input
              type="text"
              value={currentData.cta_link}
              onChange={(e) => updateField('cta_link', e.target.value)}
              placeholder="/about"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-mono focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}

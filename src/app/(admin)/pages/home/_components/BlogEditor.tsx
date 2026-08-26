"use client";

import React, { useState } from 'react';
import FormField from "@/components/ui/FormField";
import { Plus, Trash2, Newspaper } from "lucide-react";
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

const DEFAULT_BLOG_CARDS: BlogCard[] = [
  {
    image: "/assets/images/blog/blog01.webp",
    date: "16 Aug, 2025",
    title: "Top 10 Most Popular Tools <br /> For Marketing",
    link: "/contact",
    comments: "(2) Comments"
  },
  {
    image: "/assets/images/blog/blog02.webp",
    date: "17 Aug, 2025",
    title: "Business Growing Tips for <br /> Sales Globally",
    link: "/contact",
    comments: "(5) Comments"
  },
  {
    image: "/assets/images/blog/blog03.webp",
    date: "29 Aug, 2025",
    title: "Installation Sales Navigator <br />Extension on Chrome",
    link: "/contact",
    comments: "(7) Comments"
  }
];

export default function BlogEditor({ data, onChange }: Props) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const currentData: BlogData = {
    section_subtitle: data?.section_subtitle || "Latest Blog",
    section_title: data?.section_title || "Read our Latest Insights from <br /> Update Blog Posts",
    cards: data?.cards && data.cards.length > 0 ? data.cards : DEFAULT_BLOG_CARDS
  };

  const updateHeader = (key: 'section_subtitle' | 'section_title', value: string) => {
    onChange({ ...currentData, [key]: value });
  };

  const handleAddCard = () => {
    const newCard: BlogCard = {
      image: "/assets/images/blog/blog01.webp",
      date: "01 Sep, 2025",
      title: "New Flooring Installation Guide",
      link: "/contact",
      comments: "(0) Comments"
    };
    const updated = [...currentData.cards, newCard];
    onChange({ ...currentData, cards: updated });
    setActiveCardIndex(updated.length - 1);
  };

  const handleRemoveCard = (index: number) => {
    if (currentData.cards.length <= 1) {
      alert("At least one blog card is required.");
      return;
    }
    const updated = currentData.cards.filter((_, i) => i !== index);
    onChange({ ...currentData, cards: updated });
    setActiveCardIndex(Math.max(0, index - 1));
  };

  const updateCurrentCard = (key: keyof BlogCard, value: any) => {
    const updated = [...currentData.cards];
    if (!updated[activeCardIndex]) return;
    updated[activeCardIndex] = {
      ...updated[activeCardIndex],
      [key]: value,
    };
    onChange({ ...currentData, cards: updated });
  };

  const currentCard = currentData.cards[activeCardIndex] || currentData.cards[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
        <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
          <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-gold-600" />
            Blog Articles Header
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Section Subtitle">
            <input
              type="text"
              value={currentData.section_subtitle}
              onChange={(e) => updateHeader('section_subtitle', e.target.value)}
              placeholder="Latest Blog"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>

          <FormField label="Section Title (HTML allowed)">
            <input
              type="text"
              value={currentData.section_title}
              onChange={(e) => updateHeader('section_title', e.target.value)}
              placeholder="Read our Latest Insights from <br /> Update Blog Posts"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
            />
          </FormField>
        </div>
      </div>

      {/* Card Selector Bar */}
      <div className="flex items-center justify-between border-b border-obsidian-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-obsidian-800 flex items-center gap-2">
            Blog Posts ({currentData.cards.length})
          </h3>
          <p className="text-xs text-obsidian-500">Edit featured blog cards on the home page.</p>
        </div>

        <button
          onClick={handleAddCard}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-obsidian-900 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] rounded-lg shadow-sm hover:brightness-105 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Post
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {currentData.cards.map((c, idx) => {
          const isActive = idx === activeCardIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveCardIndex(idx)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-obsidian-900 text-gold-300 border-obsidian-900 shadow-sm'
                  : 'bg-obsidian-50/70 text-obsidian-600 border-obsidian-200/60 hover:bg-white hover:border-gold-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-extrabold ${
                isActive ? 'bg-gold-400 text-obsidian-950' : 'bg-obsidian-200 text-obsidian-700'
              }`}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="max-w-[120px] truncate">{c.title.replace(/<[^>]+>/g, '') || `Post ${idx + 1}`}</span>
            </button>
          );
        })}
      </div>

      {currentCard && (
        <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
            <span className="text-xs font-mono font-bold text-gold-700">
              EDITING POST 0{activeCardIndex + 1}
            </span>
            <button
              type="button"
              onClick={() => handleRemoveCard(activeCardIndex)}
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-xs font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Post
            </button>
          </div>

          <FormField label="Post Title (HTML allowed)">
            <input
              type="text"
              value={currentCard.title}
              onChange={(e) => updateCurrentCard('title', e.target.value)}
              placeholder="Top 10 Most Popular Tools <br /> For Marketing"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Date Tag">
              <input
                type="text"
                value={currentCard.date}
                onChange={(e) => updateCurrentCard('date', e.target.value)}
                placeholder="16 Aug, 2025"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>

            <FormField label="Comments Count Text">
              <input
                type="text"
                value={currentCard.comments}
                onChange={(e) => updateCurrentCard('comments', e.target.value)}
                placeholder="(2) Comments"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>
          </div>

          <FormField label="Featured Thumbnail Image">
            <ImageUploader
              value={currentCard.image}
              onChange={(url) => updateCurrentCard('image', url)}
            />
          </FormField>
        </div>
      )}
    </div>
  );
}

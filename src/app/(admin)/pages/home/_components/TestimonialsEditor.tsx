"use client";

import React, { useState } from 'react';
import FormField from "@/components/ui/FormField";
import { Plus, Trash2, MessageSquare, Star, ChevronLeft, ChevronRight } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";

export interface Review {
  name: string;
  username: string;
  body: string;
  profile?: string;
}

export interface TestimonialsData {
  section_subtitle: string;
  section_title: string;
  trusted_text: string;
  social_images: string[];
  reviews: Review[];
}

interface Props {
  data: TestimonialsData;
  onChange: (data: TestimonialsData) => void;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    name: "Sarah Jenkins",
    username: "@sarah_j",
    body: "“The carpet installation was completely flawless. The team was highly professional, clean, and transformed our living room entirely. I highly recommend ZK Flooring!”"
  },
  {
    name: "Mark Thompson",
    username: "@mthompson",
    body: "“Incredible quality and service! We chose their premium hardwood flooring for our office, and the finish is simply stunning. Will definitely use them again for future projects.”"
  },
  {
    name: "Emma Davis",
    username: "@emma_davis",
    body: "“ZK Flooring made the entire process so easy. From selecting the right carpets to the final fitting, their attention to detail is truly unmatched here in Birmingham.”"
  },
  {
    name: "David Roberts",
    username: "@david_rob",
    body: "“We couldn't be happier with our new laminate floors. They look exactly like real wood but are so much easier to maintain. Excellent workmanship by the fitters!”"
  },
  {
    name: "Laura Bennett",
    username: "@laura_b",
    body: "“Fast, reliable, and very reasonably priced. The installation team arrived right on time and did an amazing job with our bedroom carpets. Absolutely five stars!”"
  },
  {
    name: "James Wilson",
    username: "@jwilson",
    body: "“Outstanding service from start to finish. Our luxury vinyl tiles look incredible in the kitchen. ZK Flooring truly understands quality and customer care.”"
  }
];

export default function TestimonialsEditor({ data, onChange }: Props) {
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const currentData: TestimonialsData = {
    section_subtitle: data?.section_subtitle || "Testimonials",
    section_title: data?.section_title || "Helping Business in 3,000+ <br /> Different Industries",
    trusted_text: data?.trusted_text || "Trusted Clients <br /> Worldwide",
    social_images: data?.social_images && data.social_images.length >= 2
      ? data.social_images
      : [
          "/assets/images/social/social-img02.webp",
          "/assets/images/social/social-img03.webp"
        ],
    reviews: data?.reviews && data.reviews.length > 0 ? data.reviews : DEFAULT_REVIEWS
  };

  const updateHeader = (key: keyof TestimonialsData, value: any) => {
    onChange({ ...currentData, [key]: value });
  };

  const handleAddReview = () => {
    const newReview: Review = {
      name: "New Client",
      username: "@client",
      body: "“Exceptional quality and prompt installation service from ZK Flooring.”"
    };
    const updated = [...currentData.reviews, newReview];
    onChange({ ...currentData, reviews: updated });
    setActiveReviewIndex(updated.length - 1);
  };

  const handleRemoveReview = (index: number) => {
    if (currentData.reviews.length <= 1) {
      alert("At least one review is required.");
      return;
    }
    const updated = currentData.reviews.filter((_, i) => i !== index);
    onChange({ ...currentData, reviews: updated });
    setActiveReviewIndex(Math.max(0, index - 1));
  };

  const updateCurrentReview = (key: keyof Review, value: any) => {
    const updated = [...currentData.reviews];
    if (!updated[activeReviewIndex]) return;
    updated[activeReviewIndex] = {
      ...updated[activeReviewIndex],
      [key]: value,
    };
    onChange({ ...currentData, reviews: updated });
  };

  const currentReview = currentData.reviews[activeReviewIndex] || currentData.reviews[0];

  return (
    <div className="space-y-6">
      {/* Header & Trust Banner */}
      <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
        <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
          <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gold-600" />
            Testimonials Section Header
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Section Subtitle">
            <input
              type="text"
              value={currentData.section_subtitle}
              onChange={(e) => updateHeader('section_subtitle', e.target.value)}
              placeholder="Testimonials"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>

          <FormField label="Trusted Badge Text (HTML allowed)">
            <input
              type="text"
              value={currentData.trusted_text}
              onChange={(e) => updateHeader('trusted_text', e.target.value)}
              placeholder="Trusted Clients <br /> Worldwide"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
            />
          </FormField>
        </div>

        <FormField label="Main Section Heading (HTML allowed)">
          <input
            type="text"
            value={currentData.section_title}
            onChange={(e) => updateHeader('section_title', e.target.value)}
            placeholder="Helping Business in 3,000+ <br /> Different Industries"
            className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
          />
        </FormField>
      </div>

      {/* Review Selector Bar */}
      <div className="flex items-center justify-between border-b border-obsidian-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-obsidian-800 flex items-center gap-2">
            Customer Reviews ({currentData.reviews.length})
          </h3>
          <p className="text-xs text-obsidian-500">Edit infinite marquee testimonials on home page.</p>
        </div>

        <button
          onClick={handleAddReview}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-obsidian-900 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] rounded-lg shadow-sm hover:brightness-105 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Review
        </button>
      </div>

      {/* Review Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {currentData.reviews.map((r, idx) => {
          const isActive = idx === activeReviewIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveReviewIndex(idx)}
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
              <span className="max-w-[110px] truncate">{r.name || `Review ${idx + 1}`}</span>
            </button>
          );
        })}
      </div>

      {currentReview && (
        <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
            <span className="text-xs font-mono font-bold text-gold-700">
              EDITING: {currentReview.name} ({currentReview.username})
            </span>
            <button
              type="button"
              onClick={() => handleRemoveReview(activeReviewIndex)}
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-xs font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Review
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Author Name">
              <input
                type="text"
                value={currentReview.name}
                onChange={(e) => updateCurrentReview('name', e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>

            <FormField label="Social Username / Tag">
              <input
                type="text"
                value={currentReview.username}
                onChange={(e) => updateCurrentReview('username', e.target.value)}
                placeholder="@sarah_j"
                className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-mono focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </FormField>
          </div>

          <FormField label="Review Body Quote">
            <textarea
              rows={3}
              value={currentReview.body}
              onChange={(e) => updateCurrentReview('body', e.target.value)}
              placeholder="“The carpet installation was completely flawless...”"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 leading-relaxed focus:bg-white focus:outline-none focus:border-gold-500 resize-none italic"
            />
          </FormField>
        </div>
      )}
    </div>
  );
}


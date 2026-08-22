import React from 'react';
import FormField from "@/components/ui/FormField";
import { Plus, Trash2 } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";

export interface Review {
  name: string;
  username: string;
  body: string;
  profile: string;
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

export default function TestimonialsEditor({ data, onChange }: Props) {
  const currentData = {
    section_subtitle: data?.section_subtitle || "",
    section_title: data?.section_title || "",
    trusted_text: data?.trusted_text || "",
    social_images: data?.social_images || ["", ""],
    reviews: data?.reviews || []
  };

  const updateField = (key: keyof TestimonialsData, value: any) => {
    onChange({ ...currentData, [key]: value });
  };

  const updateSocialImage = (index: number, url: string) => {
    const newImages = [...currentData.social_images];
    newImages[index] = url;
    updateField('social_images', newImages);
  };

  const handleAddReview = () => {
    updateField('reviews', [...currentData.reviews, { name: "", username: "", body: "", profile: "" }]);
  };

  const updateReview = (index: number, key: keyof Review, value: any) => {
    const newReviews = [...currentData.reviews];
    newReviews[index] = { ...newReviews[index], [key]: value };
    updateField('reviews', newReviews);
  };

  const removeReview = (index: number) => {
    const newReviews = [...currentData.reviews];
    newReviews.splice(index, 1);
    updateField('reviews', newReviews);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)] mb-4">Section Header & Trust Banner</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField label="Section Subtitle"><input type="text" value={currentData.section_subtitle} onChange={e => updateField('section_subtitle', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
          <FormField label="Section Title (HTML allowed)"><input type="text" value={currentData.section_title} onChange={e => updateField('section_title', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
          <FormField label="Trusted Banner Text (HTML allowed)"><input type="text" value={currentData.trusted_text} onChange={e => updateField('trusted_text', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
             <FormField key={i} label={`Trust Social Image ${i + 1}`}>
               <ImageUploader value={currentData.social_images[i] || ""} onChange={url => updateSocialImage(i, url)} />
             </FormField>
          ))}
        </div>
      </div>

      <hr className="border-obsidian-100" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)]">Marquee Reviews</h3>
          <button onClick={handleAddReview} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-obsidian-700 rounded-lg hover:bg-obsidian-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentData.reviews.map((review, index) => (
            <div key={index} className="p-4 border border-obsidian-100 rounded-[var(--radius-card)] bg-white shadow-sm space-y-4 relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => removeReview(index)} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Name"><input type="text" value={review.name} onChange={e => updateReview(index, 'name', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
                <FormField label="Username (e.g. @user)"><input type="text" value={review.username} onChange={e => updateReview(index, 'username', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              </div>
              <FormField label="Review Body"><textarea value={review.body} onChange={e => updateReview(index, 'body', e.target.value)} rows={3} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" /></FormField>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

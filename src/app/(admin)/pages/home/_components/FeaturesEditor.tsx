"use client";

import React from 'react';
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import { Sparkles, Users, Award, Image as ImageIcon } from "lucide-react";

export interface FeatureBox {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesData {
  social_proof_count: string;
  social_proof_label: string;
  social_proof_images: string[];
  boxes: FeatureBox[];
}

interface Props {
  data: FeaturesData;
  onChange: (data: FeaturesData) => void;
}

export default function FeaturesEditor({ data, onChange }: Props) {
  const currentData: FeaturesData = {
    social_proof_count: data?.social_proof_count || "3,600",
    social_proof_label: data?.social_proof_label || "active customers",
    social_proof_images: data?.social_proof_images && data.social_proof_images.length >= 3
      ? data.social_proof_images
      : [
          "/assets/images/social/social-img01.webp",
          "/assets/images/social/social-img02.webp",
          "/assets/images/social/social-img03.webp"
        ],
    boxes: data?.boxes && data.boxes.length >= 2
      ? data.boxes
      : [
          {
            icon: "/assets/images/feature/hm1-icon01.webp",
            title: "Premium Carpet <br />Fitting",
            description: "Professional fitting services with a wide selection of luxurious carpets for every room."
          },
          {
            icon: "/assets/images/feature/hm1-icon02.webp",
            title: "Durable Vinyl <br />Flooring",
            description: "High-quality, water-resistant vinyl and LVT flooring crafted for modern living spaces."
          }
        ]
  };

  const updateField = (key: keyof FeaturesData, value: any) => {
    onChange({ ...currentData, [key]: value });
  };

  const updateSocialImage = (index: number, url: string) => {
    const newImages = [...currentData.social_proof_images];
    newImages[index] = url;
    updateField('social_proof_images', newImages);
  };

  const updateBox = (index: number, key: keyof FeatureBox, value: string) => {
    const newBoxes = [...currentData.boxes];
    newBoxes[index] = { ...newBoxes[index], [key]: value };
    updateField('boxes', newBoxes);
  };

  return (
    <div className="space-y-6">
      {/* Social Proof Card */}
      <div className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
          <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-gold-600" />
            Client Social Proof &amp; Metric
          </h3>
          <span className="text-[10px] font-bold text-gold-700 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200">
            Card 1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Customer Metric (Count)">
            <input
              type="text"
              value={currentData.social_proof_count}
              onChange={(e) => updateField('social_proof_count', e.target.value)}
              placeholder="3,600"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-bold focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
            />
          </FormField>

          <FormField label="Metric Label">
            <input
              type="text"
              value={currentData.social_proof_label}
              onChange={(e) => updateField('social_proof_label', e.target.value)}
              placeholder="active customers"
              className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:bg-white focus:outline-none focus:border-gold-500"
            />
          </FormField>
        </div>

        <div>
          <label className="text-xs font-bold text-obsidian-800 block mb-2">Social Avatar Avatars (3 clients):</label>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-2 border border-obsidian-100 rounded-lg bg-obsidian-50/50">
                <span className="text-[10px] font-bold text-obsidian-500 block mb-1">Avatar {i + 1}</span>
                <ImageUploader
                  value={currentData.social_proof_images[i] || ""}
                  onChange={(url) => updateSocialImage(i, url)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Boxes */}
      <div className="space-y-4">
        {[0, 1].map((index) => (
          <div key={index} className="p-4 rounded-xl border border-obsidian-200/80 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-obsidian-100 pb-2">
              <h3 className="text-sm font-bold text-obsidian-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-600" />
                Feature Box {index + 1} ({index === 0 ? "Carpet" : "Vinyl / LVT"})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-3">
                <FormField label="Box Title (HTML allowed)">
                  <input
                    type="text"
                    value={currentData.boxes[index]?.title || ""}
                    onChange={(e) => updateBox(index, 'title', e.target.value)}
                    placeholder="e.g. Premium Carpet <br />Fitting"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
                  />
                </FormField>

                <FormField label="Box Description">
                  <textarea
                    rows={2}
                    value={currentData.boxes[index]?.description || ""}
                    onChange={(e) => updateBox(index, 'description', e.target.value)}
                    placeholder="Feature description text..."
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 leading-relaxed focus:bg-white focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>
              </div>

              <div>
                <FormField label="Icon Image">
                  <ImageUploader
                    value={currentData.boxes[index]?.icon || ""}
                    onChange={(url) => updateBox(index, 'icon', url)}
                  />
                </FormField>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


import React from 'react';
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";

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
  // Ensure defaults exist
  const currentData = {
    social_proof_count: data?.social_proof_count || "",
    social_proof_label: data?.social_proof_label || "",
    social_proof_images: data?.social_proof_images || ["", "", ""],
    boxes: data?.boxes || [
      { icon: "", title: "", description: "" },
      { icon: "", title: "", description: "" }
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
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)] mb-4">Social Proof</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField label="Count Number (e.g. 3,600)"><input type="text" value={currentData.social_proof_count} onChange={e => updateField('social_proof_count', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
          <FormField label="Label (e.g. active customers)"><input type="text" value={currentData.social_proof_label} onChange={e => updateField('social_proof_label', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
             <FormField key={i} label={`Social Image ${i + 1}`}>
               <ImageUploader value={currentData.social_proof_images[i] || ""} onChange={url => updateSocialImage(i, url)} />
             </FormField>
          ))}
        </div>
      </div>

      <hr className="border-obsidian-100" />

      <div>
        <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)] mb-4">Feature Boxes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((index) => (
            <div key={index} className="p-4 border border-obsidian-100 rounded-[var(--radius-card)] bg-white shadow-sm space-y-4">
              <h4 className="text-sm font-semibold text-obsidian-500">Box {index + 1}</h4>
              <FormField label="Title (HTML allowed)"><input type="text" value={currentData.boxes[index]?.title || ""} onChange={e => updateBox(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              <FormField label="Description"><textarea value={currentData.boxes[index]?.description || ""} onChange={e => updateBox(index, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" /></FormField>
              <FormField label="Icon Image">
                <ImageUploader value={currentData.boxes[index]?.icon || ""} onChange={url => updateBox(index, 'icon', url)} />
              </FormField>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

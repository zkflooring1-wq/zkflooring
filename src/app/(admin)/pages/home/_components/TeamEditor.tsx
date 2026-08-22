import React from 'react';
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import { Plus, Trash2 } from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface TeamData {
  section_subtitle: string;
  section_title: string;
  members: TeamMember[];
}

interface Props {
  data: TeamData;
  onChange: (data: TeamData) => void;
}

export default function TeamEditor({ data, onChange }: Props) {
  const currentData = {
    section_subtitle: data?.section_subtitle || "",
    section_title: data?.section_title || "",
    members: data?.members || []
  };

  const updateField = (key: keyof TeamData, value: any) => {
    onChange({ ...currentData, [key]: value });
  };

  const handleAddMember = () => {
    updateField('members', [...currentData.members, { name: "", role: "", image: "" }]);
  };

  const updateMember = (index: number, key: keyof TeamMember, value: any) => {
    const newMembers = [...currentData.members];
    newMembers[index] = { ...newMembers[index], [key]: value };
    updateField('members', newMembers);
  };

  const removeMember = (index: number) => {
    const newMembers = [...currentData.members];
    newMembers.splice(index, 1);
    updateField('members', newMembers);
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
          <h3 className="text-lg font-semibold text-obsidian-700 font-[var(--font-heading)]">Team Members (Home Page)</h3>
          <button onClick={handleAddMember} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-obsidian-700 rounded-lg hover:bg-obsidian-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentData.members.map((member, index) => (
            <div key={index} className="p-4 border border-obsidian-100 rounded-[var(--radius-card)] bg-white shadow-sm space-y-4 relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => removeMember(index)} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>

              <FormField label="Name"><input type="text" value={member.name} onChange={e => updateMember(index, 'name', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              <FormField label="Role"><input type="text" value={member.role} onChange={e => updateMember(index, 'role', e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
              <FormField label="Member Image">
                <ImageUploader value={member.image} onChange={url => updateMember(index, 'image', url)} />
              </FormField>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

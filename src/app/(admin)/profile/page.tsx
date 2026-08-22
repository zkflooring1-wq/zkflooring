"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");
        // Fetch profile for role
        supabase.from("profiles").select("role, full_name").eq("id", user.id).single().then(({ data }) => {
          if (data) { setRole(data.role); if (data.full_name) setFullName(data.full_name); }
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
        toast.success("Profile updated!");
      }
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated!");
      setNewPassword("");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to update password"); }
    finally { setChangingPassword(false); }
  };

  if (loading) return <AdminLayout title="Profile" breadcrumb={["Profile"]}><LoadingState /></AdminLayout>;

  return (
    <AdminLayout title="Profile" breadcrumb={["Profile"]}>
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Account Information</h3>
          <FormField label="Email">
            <input type="email" value={email} readOnly className="w-full px-3 py-2.5 bg-obsidian-50 border border-obsidian-200 rounded-[var(--radius-input)] text-sm text-obsidian-500" />
          </FormField>
          <FormField label="Full Name">
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" />
          </FormField>
          <FormField label="Role">
            <input type="text" value={role} readOnly className="w-full px-3 py-2.5 bg-obsidian-50 border border-obsidian-200 rounded-[var(--radius-input)] text-sm text-obsidian-500 capitalize" />
          </FormField>
        </div>

        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Change Password</h3>
          <FormField label="New Password">
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" placeholder="Minimum 6 characters" />
          </FormField>
          <button onClick={handlePasswordChange} disabled={changingPassword || !newPassword}
            className="px-4 py-2 text-sm font-medium text-obsidian-600 bg-obsidian-50 hover:bg-obsidian-100 rounded-[var(--radius-button)] transition-all disabled:opacity-50">
            {changingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>

        <SaveBar onSave={handleSave} saving={saving} saveLabel="Update Profile" />
      </div>
    </AdminLayout>
  );
}
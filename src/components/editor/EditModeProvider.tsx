"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const UploadIcon = ({ size = 24, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);

interface EditorContextType {
  isEditMode: boolean;
  liveData: any;
  handleElementClick: (path: string, e: React.MouseEvent) => void;
  updateFieldLocally: (path: string, value: any) => void;
  openImagePicker: (path: string, currentUrl: string) => void;
}

const EditorContext = createContext<EditorContextType>({
  isEditMode: false,
  liveData: {},
  handleElementClick: () => {},
  updateFieldLocally: () => {},
  openImagePicker: () => {}
});

export const useEditor = () => useContext(EditorContext);

const PRESET_GALLERY = [
  { label: "Carpet Fitting", url: "/slider/Carpet.webp" },
  { label: "Laminate Flooring", url: "/slider/Laminate Flooring.webp" },
  { label: "Vinyl Tile", url: "/slider/Vinyl Tile.webp" },
  { label: "Sheet Vinyl", url: "/slider/Vinyl flooring.webp" },
  { label: "Carpet Tile", url: "/slider/Carpet Tile.webp" },
  { label: "Self Levelling", url: "/services/Self Levelling.webp" },
  { label: "About Showcase 1", url: "/assets/images/about/hm1-img01.webp" },
  { label: "About Showcase 2", url: "/assets/images/about/hm1-img03.webp" },
  { label: "Feature Icon 1", url: "/assets/images/feature/hm1-icon01.webp" },
  { label: "Feature Icon 2", url: "/assets/images/feature/hm1-icon02.webp" },
];

export function EditModeProvider({ children, initialData }: { children: React.ReactNode, initialData: any }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [liveData, setLiveData] = useState(initialData || {});

  // Image Picker Modal State
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    path: string;
    currentUrl: string;
  }>({
    isOpen: false,
    path: "",
    currentUrl: "",
  });

  const [customUrlInput, setCustomUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const editMode = searchParams.get("editMode") === "true";
    setIsEditMode(editMode);

    if (!editMode) return;
    
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.source?.includes('react-devtools')) return;
      
      if (e.data?.type === 'UPDATE_FIELD') {
        const { path, value } = e.data;
        setLiveData((prev: any) => {
           const newData = JSON.parse(JSON.stringify(prev));
           const keys = path.split('.');
           let curr = newData;
           for (let i = 0; i < keys.length - 1; i++) {
               if (!curr[keys[i]]) curr[keys[i]] = {};
               curr = curr[keys[i]];
           }
           curr[keys[keys.length - 1]] = value;
           return newData;
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const updateFieldLocally = (path: string, value: any) => {
    setLiveData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let curr = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!curr[keys[i]]) curr[keys[i]] = {};
        curr = curr[keys[i]];
      }
      curr[keys[keys.length - 1]] = value;
      return newData;
    });

    // Notify Parent Admin window of the change
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'FIELD_UPDATED',
        path,
        value
      }, '*');
    }
  };

  const handleElementClick = (path: string, e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'FIELD_CLICKED', path }, '*');
    }
  };

  const openImagePicker = (path: string, currentUrl: string) => {
    setImageModal({
      isOpen: true,
      path,
      currentUrl: currentUrl || "",
    });
    setCustomUrlInput(currentUrl || "");
  };

  const handleSelectImage = (url: string) => {
    if (!imageModal.path) return;
    updateFieldLocally(imageModal.path, url);
    setImageModal({ isOpen: false, path: "", currentUrl: "" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Attempt upload to admin API or local handler
      const res = await fetch('http://localhost:3001/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.url) {
          handleSelectImage(data.url);
          return;
        }
      }

      // Fallback: Read as base64 data url for instant preview
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) handleSelectImage(result);
      };
      reader.readAsDataURL(file);
    } catch {
      // Fallback to base64
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) handleSelectImage(result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <EditorContext.Provider value={{ isEditMode, liveData, handleElementClick, updateFieldLocally, openImagePicker }}>
      {children}

      {/* Floating Image Picker Modal when double clicked */}
      {isEditMode && imageModal.isOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(15, 12, 8, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            fontFamily: 'sans-serif'
          }}
          onClick={() => setImageModal({ isOpen: false, path: "", currentUrl: "" })}
        >
          <div 
            style={{
              backgroundColor: '#1E1912',
              color: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              width: '100%',
              maxWidth: '540px',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'linear-gradient(to right, #16120B, #241D14)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #BF953F, #FCF6BA)',
                  color: '#16120B',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800
                }}>
                  VISUAL PICKER
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#FCF6BA' }}>
                  Replace Image
                </span>
              </div>
              <button
                type="button"
                onClick={() => setImageModal({ isOpen: false, path: "", currentUrl: "" })}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <XIcon size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Current Field Info */}
              <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>
                Field Path: <span style={{ color: '#D4AF37' }}>{imageModal.path}</span>
              </div>

              {/* Upload from Computer */}
              <div>
                <label 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '1.25rem',
                    border: '2px dashed rgba(212, 175, 55, 0.4)',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <UploadIcon size={24} color="#D4AF37" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#E5E7EB' }}>
                    {uploading ? "Uploading..." : "Click to Upload New Image"}
                  </span>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Supports PNG, JPG, WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* URL Direct Input */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#D1D5DB', display: 'block', marginBottom: '4px' }}>
                  Or Paste Image URL:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://... or /slider/Carpet.webp"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleSelectImage(customUrlInput)}
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #BF953F, #AA771C)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Showroom Presets */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#D1D5DB', display: 'block', marginBottom: '8px' }}>
                  Quick Preset Images:
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '8px',
                  maxHeight: '140px',
                  overflowY: 'auto'
                }}>
                  {PRESET_GALLERY.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectImage(preset.url)}
                      style={{
                        padding: '4px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        style={{ width: '100%', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <span style={{ fontSize: '9px', color: '#9CA3AF', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </EditorContext.Provider>
  );
}

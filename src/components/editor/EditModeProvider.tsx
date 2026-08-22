"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface EditorContextType {
  isEditMode: boolean;
  liveData: any;
  handleElementClick: (path: string, e: React.MouseEvent) => void;
}

const EditorContext = createContext<EditorContextType>({
  isEditMode: false,
  liveData: {},
  handleElementClick: () => {}
});

export const useEditor = () => useContext(EditorContext);

export function EditModeProvider({ children, initialData }: { children: React.ReactNode, initialData: any }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [liveData, setLiveData] = useState(initialData || {});

  useEffect(() => {
    // Safely check editMode on client to avoid Suspense boundary requirements
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

  const handleElementClick = (path: string, e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    window.parent.postMessage({ type: 'FIELD_CLICKED', path }, '*');
  };

  return (
    <EditorContext.Provider value={{ isEditMode, liveData, handleElementClick }}>
      {children}
    </EditorContext.Provider>
  );
}

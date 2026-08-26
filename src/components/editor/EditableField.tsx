"use client";

import React from 'react';
import { useEditor } from './EditModeProvider';

interface Props {
  path: string;
  fallback: string;
  isHtml?: boolean;
}

export function EditableField({ path, fallback, isHtml = false }: Props) {
  const { isEditMode, liveData, handleElementClick } = useEditor();

  const getValue = () => {
    try {
       const keys = path.split('.');
       let val = liveData;
       for (const key of keys) {
           val = val[key];
           if (val === undefined || val === null) return fallback;
       }
       return val || fallback;
    } catch {
       return fallback;
    }
  };

  const val = getValue();

  // When NOT in edit mode, render nothing extra — just raw text
  // This avoids any hydration mismatch from extra <span> wrappers
  if (!isEditMode) {
    if (isHtml) {
      return <span dangerouslySetInnerHTML={{ __html: val }} />;
    }
    return <>{val}</>;
  }

  // Edit mode: render with click handler and visual outline
  const editProps = {
    onClick: (e: React.MouseEvent) => handleElementClick(path, e),
    style: {
      outline: '2px dashed #D4AF37',
      cursor: 'pointer',
      display: 'inline-block',
      position: 'relative' as const,
      zIndex: 10,
      outlineOffset: '2px',
      backgroundColor: 'rgba(212, 175, 55, 0.05)'
    },
    title: `Edit ${path}`
  };

  if (isHtml) {
    return <span {...editProps} dangerouslySetInnerHTML={{ __html: val }} />;
  }

  return <span {...editProps}>{val}</span>;
}

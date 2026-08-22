"use client";

import React from 'react';
import { useEditor } from './EditModeProvider';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  path: string;
  fallback: string;
}

export function EditableImage({ path, fallback, style, ...rest }: Props) {
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

  const src = getValue();

  // When NOT in edit mode, render a plain img — no extra wrappers
  if (!isEditMode) {
    return <img src={src} style={style} {...rest} />;
  }

  // Edit mode: add visual outline and click handler
  return (
    <img
      src={src}
      {...rest}
      onClick={(e: React.MouseEvent) => handleElementClick(path, e)}
      style={{
        ...style,
        outline: '2px dashed #00bcd4',
        cursor: 'pointer',
        outlineOffset: '-2px'
      }}
      title={`Edit Image ${path}`}
    />
  );
}

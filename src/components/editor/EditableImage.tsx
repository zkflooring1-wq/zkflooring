"use client";

import React from 'react';
import { useEditor } from './EditModeProvider';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  path: string;
  fallback: string;
}

export function EditableImage({ path, fallback, style, ...rest }: Props) {
  const { isEditMode, liveData, handleElementClick, openImagePicker } = useEditor();

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

  // When NOT in edit mode, render a plain img — zero overhead
  if (!isEditMode) {
    return <img src={src} style={style} {...rest} />;
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openImagePicker(path, src);
  };

  // Edit mode: add visual hover cue, outline, and double-click to open visual image picker
  return (
    <span
      className="group"
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer',
        width: style?.width || 'auto',
        height: style?.height || 'auto'
      }}
      onClick={(e: React.MouseEvent) => handleElementClick(path, e)}
      onDoubleClick={handleDoubleClick}
      title={`Click to open tab / Double-click to replace image (${path})`}
    >
      {/* Floating Hover Badge */}
      <span
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '10px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #BF953F, #FCF6BA)',
          color: '#16120B',
          padding: '3px 8px',
          borderRadius: '6px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 50,
          opacity: 0,
          transform: 'translateY(-2px)',
          transition: 'opacity 0.15s, transform 0.15s'
        }}
        className="group-hover:opacity-100 group-hover:translate-y-0"
      >
        📷 Double-Click to Change Image
      </span>

      <img
        src={src}
        {...rest}
        style={{
          ...style,
          outline: '2px dashed rgba(212, 175, 55, 0.7)',
          outlineOffset: '-2px',
          transition: 'outline-color 0.2s',
        }}
      />
    </span>
  );
}

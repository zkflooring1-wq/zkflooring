"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from './EditModeProvider';

const CheckIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const XIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

interface Props {
  path: string;
  fallback: string;
  isHtml?: boolean;
}

export function EditableField({ path, fallback, isHtml = false }: Props) {
  const { isEditMode, liveData, handleElementClick, updateFieldLocally } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [currentDraft, setCurrentDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (isEditing) {
      setCurrentDraft(val);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isEditing, val]);

  // When NOT in edit mode, render raw text with zero overhead
  if (!isEditMode) {
    if (isHtml) {
      return <span dangerouslySetInnerHTML={{ __html: val }} />;
    }
    return <>{val}</>;
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    updateFieldLocally(path, currentDraft);
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || !isHtml)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const insertTag = (tagStart: string, tagEnd: string = "") => {
    if (!inputRef.current) return;
    const start = inputRef.current.selectionStart;
    const end = inputRef.current.selectionEnd;
    const selected = currentDraft.substring(start, end);
    const replacement = tagStart + selected + tagEnd;
    const nextVal = currentDraft.substring(0, start) + replacement + currentDraft.substring(end);
    setCurrentDraft(nextVal);
  };

  // If in active inline editing mode
  if (isEditing) {
    return (
      <span 
        style={{
          display: 'inline-block',
          position: 'relative',
          zIndex: 99999,
          backgroundColor: '#1E1912',
          padding: '8px',
          borderRadius: '10px',
          border: '2px solid #D4AF37',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          minWidth: '240px'
        }}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#FCF6BA', textTransform: 'uppercase' }}>
            ✏️ EDITING: {path.split('.').pop()}
          </span>
          <span style={{ display: 'flex', gap: '4px' }}>
            {isHtml && (
              <>
                <button
                  type="button"
                  onClick={() => insertTag("<br />")}
                  style={{
                    padding: '2px 6px',
                    fontSize: '9px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    color: '#FCF6BA',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  title="Insert Line Break"
                >
                  + &lt;br /&gt;
                </button>
                <button
                  type="button"
                  onClick={() => insertTag("<span className=\"text-theme\">", "</span>")}
                  style={{
                    padding: '2px 6px',
                    fontSize: '9px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    color: '#FCF6BA',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  title="Insert Gold Highlight"
                >
                  + Gold Highlight
                </button>
              </>
            )}
          </span>
        </span>

        <textarea
          ref={inputRef}
          value={currentDraft}
          onChange={(e) => setCurrentDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={Math.min(5, Math.max(2, currentDraft.split('\n').length))}
          style={{
            width: '100%',
            backgroundColor: '#0E0C09',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            padding: '6px 8px',
            fontSize: '13px',
            fontFamily: 'sans-serif',
            outline: 'none',
            resize: 'vertical'
          }}
        />

        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={{ fontSize: '9px', color: '#9CA3AF' }}>Press Enter or Click Save</span>
          <span style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#D1D5DB',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <XIcon size={12} /> Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #BF953F, #AA771C)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <CheckIcon size={12} /> Done
            </button>
          </span>
        </span>
      </span>
    );
  }

  // Edit mode: Visual outline on hover with click to select tab & double-click to edit
  return (
    <span
      onClick={(e: React.MouseEvent) => handleElementClick(path, e)}
      onDoubleClick={handleDoubleClick}
      className="group"
      style={{
        outline: '1.5px dashed rgba(212, 175, 55, 0.6)',
        cursor: 'pointer',
        display: 'inline-block',
        position: 'relative',
        borderRadius: '4px',
        padding: '0 2px',
        margin: '0 1px',
        transition: 'all 0.15s ease-in-out',
      }}
      title={`Click to open tab / Double-click to edit (${path})`}
    >
      {/* Floating Hover Badge */}
      <span
        style={{
          position: 'absolute',
          top: '-18px',
          right: '0',
          fontSize: '9px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #BF953F, #FCF6BA)',
          color: '#16120B',
          padding: '1px 5px',
          borderRadius: '3px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 50,
          opacity: 0,
          transform: 'translateY(2px)',
          transition: 'opacity 0.15s, transform 0.15s'
        }}
        className="group-hover:opacity-100 group-hover:translate-y-0"
      >
        ✏️ Double-Click to Edit
      </span>

      {isHtml ? (
        <span dangerouslySetInnerHTML={{ __html: val }} />
      ) : (
        <span>{val}</span>
      )}
    </span>
  );
}

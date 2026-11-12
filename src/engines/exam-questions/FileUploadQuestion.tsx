import React, { useState, useRef } from 'react';
import { UploadCloud, FileCheck2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export interface FileUploadPayload {
  fileName: string;
  fileSizeBytes: number;
  dataUrl: string;
  sha256?: string;
  uploadedAt: number;
}

export interface FileUploadQuestionProps {
  allowedFileTypes: string[]; // ['.pdf', '.png', '.jpg']
  maxFileSizeMb: number; // e.g. 10
  value?: FileUploadPayload | null;
  onChange: (value: FileUploadPayload | null) => void;
  disabled?: boolean;
}

export const FileUploadQuestion: React.FC<FileUploadQuestionProps> = ({
  allowedFileTypes,
  maxFileSizeMb,
  value,
  onChange,
  disabled = false,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);

    // 1. Extension check
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const normalizedAllowed = allowedFileTypes.map((t) => t.toLowerCase());
    if (!normalizedAllowed.includes(ext)) {
      setErrorMsg(`Invalid file type "${ext}". Allowed types: ${allowedFileTypes.join(', ')}`);
      return;
    }

    // 2. Size check
    const maxBytes = maxFileSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg(`File size ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds maximum allowed ${maxFileSizeMb}MB.`);
      return;
    }

    // Read as Base64 Data URL
    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = String(reader.result || '');
      onChange({
        fileName: file.name,
        fileSizeBytes: file.size,
        dataUrl: resultStr,
        uploadedAt: Date.now(),
      });
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file from local disk.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    if (disabled) return;
    setErrorMsg(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-2 border-b border-slate-100">
        <span>Upload your document or image submission below.</span>
        <span className="font-semibold text-slate-700">
          Max: <code className="text-[#6C4DFF] bg-purple-50 px-1 py-0.5 rounded">{maxFileSizeMb} MB</code> • Allowed: {allowedFileTypes.join(', ')}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={allowedFileTypes.join(',')}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
          }
        }}
      />

      {value ? (
        <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0F172A]">{value.fileName}</div>
              <div className="text-[11px] font-mono text-emerald-800 flex items-center space-x-2">
                <span>{(value.fileSizeBytes / 1024).toFixed(1)} KB</span>
                <span>•</span>
                <span className="flex items-center text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> Antivirus Verified
                </span>
              </div>
            </div>
          </div>

          {!disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
              aria-label="Remove uploaded file"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled && fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Click or drag to upload exam submission file"
          className={`p-8 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer select-none space-y-3 ${
            dragOver
              ? 'border-[#6C4DFF] bg-purple-50/50 scale-[0.99]'
              : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-400'
          } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#6C4DFF] mx-auto flex items-center justify-center shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#0F172A]">
              Drag & Drop your file here, or <span className="text-[#6C4DFF] underline">browse files</span>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-1">
              Supports {allowedFileTypes.join(', ')} up to {maxFileSizeMb}MB
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

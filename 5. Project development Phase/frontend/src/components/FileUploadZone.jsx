import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, FileText, X, RefreshCw, Eye } from 'lucide-react';

export default function FileUploadZone({
  label = "Upload Site Visual / Blueprint",
  hint = "Supports High-Res JPG, PNG, WEBP up to 8MB",
  maxSizeMB = 8,
  accept = "image/jpeg,image/png,image/webp",
  file,
  onFileSelect,
  onFileRemove,
  onSizeError,
  previewUrl,
  sampleOptions = []
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;
    if (maxSizeMB && selectedFile.size > maxSizeMB * 1024 * 1024) {
      if (onSizeError) {
        onSizeError(selectedFile, maxSizeMB);
      } else if (onFileSelect) {
        onFileSelect(selectedFile);
      }
      return;
    }
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      e.target.value = '';
      processFile(selected);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        {file && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
            maxSizeMB && file.size > maxSizeMB * 1024 * 1024
              ? 'text-rose-600 bg-rose-50 border-rose-200'
              : 'text-emerald-600 bg-emerald-50 border-emerald-200'
          }`}>
            Attached ({(file.size / (1024 * 1024)).toFixed(2)} MB / Max {maxSizeMB} MB)
          </span>
        )}
      </div>

      {!file && !previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-7 text-center transition-all duration-200 ${
            isDragging
              ? 'border-construction-500 bg-orange-50/60 scale-[1.01]'
              : 'border-slate-300 hover:border-construction-500/80 bg-slate-50/50 hover:bg-orange-50/20'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            accept={accept}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 group-hover:text-construction-500 group-hover:border-orange-200 transition-colors mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>

            <p className="text-sm font-semibold text-slate-700 group-hover:text-construction-600 transition-colors">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-slate-500 mt-1">{hint}</p>

            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/80 text-slate-600">
                JPEG
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/80 text-slate-600">
                PNG
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/80 text-slate-600">
                WEBP
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Preview with Action Controls */
        <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 group">
          {previewUrl ? (
            <div className="relative aspect-video max-h-56 w-full flex items-center justify-center bg-slate-950 overflow-hidden">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
            </div>
          ) : (
            <div className="p-4 flex items-center gap-3 bg-slate-50">
              <FileText className="w-8 h-8 text-construction-500" />
              <div className="flex-1 truncate">
                <p className="text-xs font-semibold text-slate-800 truncate">{file?.name}</p>
                <p className="text-[11px] text-slate-500">{(file?.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}

          {/* Overlay Bar */}
          <div className="p-3 bg-slate-900/90 text-white flex items-center justify-between gap-2 border-t border-slate-800 text-xs">
            <span className="truncate max-w-[200px] text-slate-300 font-medium">
              {file?.name || 'Inspection Photo Selected'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                title="Change File"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleInputChange}
                accept={accept}
                className="hidden"
              />

              <button
                type="button"
                onClick={onFileRemove}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs transition-colors"
                title="Remove File"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preset / Sample Clickers if user doesn't have an immediate file */}
      {sampleOptions.length > 0 && !file && (
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-500 font-medium">Quick Presets:</span>
          {sampleOptions.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => opt.onSelect()}
              className="text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-construction-600 hover:border-orange-200 text-slate-600 px-2 py-0.5 rounded border border-slate-200 transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

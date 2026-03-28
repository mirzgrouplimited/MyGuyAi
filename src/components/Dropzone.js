import { Upload } from 'lucide-react';
import { useCallback } from 'react';

export const Dropzone = ({ onFileSelect, accept, multiple = false, active = false }) => {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(multiple ? files : files[0]);
    }
  }, [onFileSelect, multiple]);

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFileSelect(multiple ? files : files[0]);
    }
    // Reset input to allow same file selection
    e.target.value = '';
  }, [onFileSelect, multiple]);

  // Add HEIC/HEIF support to image accept types
  const getAcceptString = () => {
    if (!accept) return undefined;
    if (accept.includes('image/')) {
      return `${accept},.heic,.heif,image/heic,image/heif`;
    }
    return accept;
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`min-h-[300px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-all duration-200 cursor-pointer ${
        active 
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
      }`}
      data-testid="file-dropzone"
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className={`p-4 rounded-full mb-4 ${active ? 'bg-blue-100' : 'bg-slate-100'}`}>
          <Upload size={32} className={active ? 'text-blue-600' : 'text-slate-400'} />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Drag & Drop your file here</h3>
        <p className="text-sm text-slate-500 mb-4">or</p>
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept={getAcceptString()}
            multiple={multiple}
            onChange={handleFileInput}
            data-testid="file-input"
          />
          <span className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200">
            Browse Files
          </span>
        </label>
        {accept?.includes('image/') && (
          <p className="text-xs text-slate-400 mt-4">Supports: JPG, PNG, WebP, HEIC (iPhone)</p>
        )}
      </div>
    </div>
  );
};
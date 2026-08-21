import { useState, useRef, ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { apiFetch, parseApiResponse } from '../../lib/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = 'Image' }: ImageUploaderProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('upload');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await apiFetch('/api/cms/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await parseApiResponse(res);
      if (result.ok && result.data?.url) {
        onChange(result.data.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Error uploading image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      
      {value ? (
        <div className="relative mb-3 inline-block">
          <img src={value} alt="Preview" className="h-32 w-auto object-cover rounded-lg border border-gray-200" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
            title="Remove Image"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}

      {!value && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`flex items-center space-x-1 text-sm font-medium pb-1 ${mode === 'upload' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
            >
              <Upload size={16} />
              <span>Device Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`flex items-center space-x-1 text-sm font-medium pb-1 ${mode === 'url' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
            >
              <LinkIcon size={16} />
              <span>Image URL</span>
            </button>
          </div>

          {mode === 'upload' ? (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP, or GIF</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  disabled={uploading}
                />
              </label>
            </div>
          ) : (
            <div>
              <input
                type="url"
                placeholder="https://example.com/image.jpg (ImgBB etc.)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                onChange={(e) => {
                  // We don't want to save on every keystroke, maybe just add a button
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onChange(e.currentTarget.value);
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value) {
                    onChange(e.target.value);
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-2">Paste URL and press Enter or click outside to preview.</p>
            </div>
          )}
          
          {uploading && <p className="text-sm text-green-600 mt-2">Uploading image...</p>}
        </div>
      )}
    </div>
  );
}

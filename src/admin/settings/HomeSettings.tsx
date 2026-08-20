import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import ConfirmModal from '../components/ConfirmModal';

export default function HomeSettings({ data, onChange, onSave }: { data: any, onChange: (data: any) => void, onSave: () => void }) {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const addIndicator = () => {
    onChange({ ...data, trustIndicators: [...(data.trustIndicators || []), 'New Indicator'] });
  };

  const updateIndicator = (index: number, value: string) => {
    const newIndicators = [...(data.trustIndicators || [])];
    newIndicators[index] = value;
    onChange({ ...data, trustIndicators: newIndicators });
  };

  const removeIndicator = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmRemove = () => {
    if (deleteIndex === null) return;
    const newIndicators = [...(data.trustIndicators || [])];
    newIndicators.splice(deleteIndex, 1);
    onChange({ ...data, trustIndicators: newIndicators });
    setDeleteIndex(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Hero Section (Home)</h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Badge Text</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.badgeText || ''}
            onChange={(e) => onChange({ ...data, badgeText: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Rating</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.customerRating || ''}
            onChange={(e) => onChange({ ...data, customerRating: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <ImageUploader 
            value={data.heroImage || ''} 
            onChange={(url) => onChange({ ...data, heroImage: url })} 
            label="Hero Image"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Heading Line 1</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.heading1 || ''}
            onChange={(e) => onChange({ ...data, heading1: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Heading Line 2</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.heading2 || ''}
            onChange={(e) => onChange({ ...data, heading2: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Heading Line 3</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.heading3 || ''}
            onChange={(e) => onChange({ ...data, heading3: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <textarea
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-gray-700">Trust Indicators</label>
          <button onClick={addIndicator} className="flex items-center space-x-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-md hover:bg-green-100">
            <Plus size={16} />
            <span>Add Indicator</span>
          </button>
        </div>
        <div className="space-y-3">
          {(data.trustIndicators || []).map((indicator: string, i: number) => (
            <div key={i} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                value={indicator}
                onChange={(e) => updateIndicator(i, e.target.value)}
              />
              <button onClick={() => removeIndicator(i)} className="text-red-500 hover:text-red-700 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
        <button onClick={onSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors">
          Save Edited Content
        </button>
      </div>

      <ConfirmModal 
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={confirmRemove}
        title="Remove Indicator"
        message="Are you sure you want to remove this trust indicator?"
      />
    </div>
  );
}

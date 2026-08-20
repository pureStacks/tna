import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import ConfirmModal from '../components/ConfirmModal';

export default function AboutSettings({ data, onChange, onSave }: { data: any, onChange: (data: any) => void, onSave: () => void }) {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const addParagraph = () => {
    onChange({ ...data, paragraphs: [...(data.paragraphs || []), 'New paragraph text...'] });
  };

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...(data.paragraphs || [])];
    newParagraphs[index] = value;
    onChange({ ...data, paragraphs: newParagraphs });
  };

  const removeParagraph = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmRemove = () => {
    if (deleteIndex === null) return;
    const newParagraphs = [...(data.paragraphs || [])];
    newParagraphs.splice(deleteIndex, 1);
    onChange({ ...data, paragraphs: newParagraphs });
    setDeleteIndex(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">About Section</h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Heading Badge</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.headingBadge || ''}
            onChange={(e) => onChange({ ...data, headingBadge: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Main Heading</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.heading || ''}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
          />
        </div>
        
        <div className="col-span-2">
          <ImageUploader 
            value={data.image || ''} 
            onChange={(url) => onChange({ ...data, image: url })} 
            label="About Image"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Statistic Value (e.g. 100%)</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.stat || ''}
            onChange={(e) => onChange({ ...data, stat: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Statistic Label</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.statText || ''}
            onChange={(e) => onChange({ ...data, statText: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-gray-700">Paragraphs</label>
          <button onClick={addParagraph} className="flex items-center space-x-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-md hover:bg-green-100">
            <Plus size={16} />
            <span>Add Paragraph</span>
          </button>
        </div>
        <div className="space-y-4">
          {(data.paragraphs || []).map((paragraph: string, i: number) => (
            <div key={i} className="flex space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <textarea
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                value={paragraph}
                onChange={(e) => updateParagraph(i, e.target.value)}
              />
              <button onClick={() => removeParagraph(i)} className="text-red-500 hover:text-red-700 p-2 h-fit">
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
        title="Remove Paragraph"
        message="Are you sure you want to remove this paragraph?"
      />
    </div>
  );
}

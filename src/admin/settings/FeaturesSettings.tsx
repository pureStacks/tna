import { Plus, Trash2, Copy } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

export default function FeaturesSettings({ data, onChange, onSave }: { data: any, onChange: (data: any) => void, onSave: () => void }) {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const defaultFeatures = [
    { icon: 'ShieldCheck', title: 'Quality', description: 'Quality-focused catfish supplied.' },
    { icon: 'Droplet', title: 'Freshness', description: 'Fresh and healthy fish prepared.' }
  ];

  const featuresList = data.items || defaultFeatures;

  const addFeature = () => {
    onChange({ ...data, items: [...featuresList, { icon: 'Star', title: 'New Feature', description: 'Description here' }] });
  };

  const duplicateFeature = (index: number) => {
    const itemToCopy = { ...featuresList[index] };
    itemToCopy.title = `${itemToCopy.title} (Copy)`;
    const newList = [...featuresList];
    newList.splice(index + 1, 0, itemToCopy);
    onChange({ ...data, items: newList });
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newList = [...featuresList];
    newList[index] = { ...newList[index], [field]: value };
    onChange({ ...data, items: newList });
  };

  const removeFeature = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmRemove = () => {
    if (deleteIndex === null) return;
    const newList = [...featuresList];
    newList.splice(deleteIndex, 1);
    onChange({ ...data, items: newList });
    setDeleteIndex(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Features Section (Why Choose Us)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Section Badge</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.badgeText || 'Why Choose TNA Catfish'}
            onChange={(e) => onChange({ ...data, badgeText: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Main Heading</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.heading || 'The Best Choice for Your Catfish Needs'}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Subheading / Description</label>
          <textarea
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.description || 'We are dedicated to providing an unmatched standard of quality and service in Osun State.'}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-gray-700">Feature Items</label>
          <button onClick={addFeature} className="flex items-center space-x-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-md hover:bg-green-100 transition-colors">
            <Plus size={16} />
            <span>Add Feature</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {featuresList.map((item: any, i: number) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="w-full md:w-1/4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Lucide Icon Name</label>
                <input
                  type="text"
                  placeholder="e.g. ShieldCheck"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                  value={item.icon}
                  onChange={(e) => updateFeature(i, 'icon', e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                  value={item.title}
                  onChange={(e) => updateFeature(i, 'title', e.target.value)}
                />
              </div>
              <div className="w-full md:w-2/4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                  value={item.description}
                  onChange={(e) => updateFeature(i, 'description', e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-1 md:self-center md:mt-5">
                <button onClick={() => duplicateFeature(i)} className="text-blue-500 hover:text-blue-700 p-2 bg-blue-50 rounded" title="Duplicate">
                  <Copy size={18} />
                </button>
                <button onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded" title="Remove">
                  <Trash2 size={18} />
                </button>
              </div>
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
        title="Remove Feature"
        message="Are you sure you want to remove this feature?"
      />
    </div>
  );
}

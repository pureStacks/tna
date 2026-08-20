import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

export default function HeaderSettings({ data, onChange, onSave }: { data: any, onChange: (data: any) => void, onSave: () => void }) {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleLinkChange = (index: number, field: string, value: any) => {
    const newLinks = [...(data.navLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange({ ...data, navLinks: newLinks });
  };

  const addLink = () => {
    onChange({ ...data, navLinks: [...(data.navLinks || []), { name: 'New Link', href: '#', visible: true }] });
  };

  const removeLink = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmRemove = () => {
    if (deleteIndex === null) return;
    const newLinks = [...(data.navLinks || [])];
    newLinks.splice(deleteIndex, 1);
    onChange({ ...data, navLinks: newLinks });
    setDeleteIndex(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Header Section</h3>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Logo Text</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          value={data.logoText || ''}
          onChange={(e) => onChange({ ...data, logoText: e.target.value })}
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-gray-700">Navigation Links</label>
          <button onClick={addLink} className="flex items-center space-x-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-md hover:bg-green-100">
            <Plus size={16} />
            <span>Add Link</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {(data.navLinks || []).map((link: any, i: number) => (
            <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                  value={link.name}
                  onChange={(e) => handleLinkChange(i, 'name', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="URL/Href"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                  value={link.href}
                  onChange={(e) => handleLinkChange(i, 'href', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Visible</label>
                <input
                  type="checkbox"
                  checked={link.visible}
                  onChange={(e) => handleLinkChange(i, 'visible', e.target.checked)}
                  className="rounded text-green-600 focus:ring-green-500"
                />
              </div>
              <button onClick={() => removeLink(i)} className="text-red-500 hover:text-red-700 p-2">
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
        title="Remove Link"
        message="Are you sure you want to remove this navigation link?"
      />
    </div>
  );
}

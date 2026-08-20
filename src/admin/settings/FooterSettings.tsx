export default function FooterSettings({ data, onChange, onSave }: { data: any, onChange: (data: any) => void, onSave: () => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Footer Section</h3>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Footer Description</label>
        <textarea
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Copyright Text</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          value={data.copyright || ''}
          onChange={(e) => onChange({ ...data, copyright: e.target.value })}
        />
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
        <button onClick={onSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors">
          Save Edited Content
        </button>
      </div>
    </div>
  );
}

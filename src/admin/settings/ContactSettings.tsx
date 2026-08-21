export default function ContactSettings({ data, onChange, onSave }: { data: any, onChange: (data: any) => void, onSave: () => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Contact Section</h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Physical Farm Address</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.address || ''}
            onChange={(e) => onChange({ ...data, address: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Public Customer Email</label>
          <p className="text-xs text-gray-500 mb-2">Visible on website contact & footer sections</p>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.email || ''}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Backup & Recovery Email</label>
          <p className="text-xs text-gray-500 mb-2">Used to reset admin password when forgotten</p>
          <input
            type="email"
            placeholder="e.g. backup@gmail.com"
            className="w-full px-4 py-2 border border-green-300 bg-green-50/30 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.backupEmail || ''}
            onChange={(e) => onChange({ ...data, backupEmail: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Display WhatsApp (e.g. +234 905...)</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.whatsapp || ''}
            onChange={(e) => onChange({ ...data, whatsapp: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Raw WhatsApp (for API links, e.g. 234905...)</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.whatsappRaw || ''}
            onChange={(e) => onChange({ ...data, whatsappRaw: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Default WhatsApp Message Template</label>
          <textarea
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={data.whatsappMessage || ''}
            onChange={(e) => onChange({ ...data, whatsappMessage: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
        <button onClick={onSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors">
          Save Edited Content
        </button>
      </div>
    </div>
  );
}

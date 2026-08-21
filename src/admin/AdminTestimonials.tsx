import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Edit, Copy, Plus, X, Mail, Send, CheckCircle2 } from 'lucide-react';
import ConfirmModal from './components/ConfirmModal';
import { useCMS } from '../context/CMSContext';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { refreshData } = useCMS();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = () => {
    fetch('/api/cms/testimonials')
      .then(res => res.json())
      .then(data => {
        setTestimonials(data);
        setLoading(false);
        refreshData();
      });
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/cms/testimonials/${itemToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Testimonial deleted');
        fetchTestimonials();
      }
    } catch (err) {}
    setItemToDelete(null);
  };

  const togglePublish = async (t: any) => {
    try {
      const res = await fetch(`/api/cms/testimonials/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...t, is_published: t.is_published ? 0 : 1 })
      });
      if (res.ok) {
        toast.success(`Testimonial ${t.is_published ? 'hidden' : 'published'}`);
        fetchTestimonials();
      }
    } catch (err) {}
  };

  const handleDuplicate = async (t: any) => {
    const newTestimonial = {
      ...t,
      name: `${t.name} (Copy)`,
      is_published: 0,
      order_index: testimonials.length
    };
    delete newTestimonial.id;
    
    try {
      const res = await fetch('/api/cms/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial)
      });
      if (res.ok) {
        toast.success('Testimonial duplicated as pending.');
        fetchTestimonials();
      }
    } catch (err) {}
  };

  const openAddModal = () => {
    setEditingId(null);
    setEditForm({
      name: '',
      email: '',
      location: '',
      text: '',
      rating: 5,
      is_published: 1,
      order_index: testimonials.length
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: any) => {
    setEditingId(t.id);
    setEditForm({ 
      ...t,
      email: t.email || '',
      location: t.location || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditForm(null);
    setEditingId(null);
  };

  const saveTestimonial = async () => {
    if (!editForm.name || !editForm.text) return toast.error('Name and text are required');
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/cms/testimonials/${editingId}` : '/api/cms/testimonials';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        toast.success(editingId ? 'Testimonial updated' : 'Testimonial added');
        fetchTestimonials();
        closeModal();
      } else {
        toast.error('Failed to save testimonial');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading testimonials...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Customer Testimonials & Reviews</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage reviews submitted by customers. You can approve reviews and click the reply icon to email customers directly.
          </p>
        </div>
        <button onClick={openAddModal} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Customer & Contact</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Rating</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Review</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map(t => (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                <td className="py-3 px-4">
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.location || 'Nigeria'}</div>
                  {t.email ? (
                    <a
                      href={`mailto:${t.email}?subject=${encodeURIComponent('Thank you for your review - TNA Catfish')}&body=${encodeURIComponent(`Hi ${t.name},\n\nThank you for sharing your feedback with TNA Catfish!\n\nBest regards,\nTNA Catfish Team`)}`}
                      className="inline-flex items-center gap-1 text-xs text-green-700 hover:text-green-900 hover:underline mt-1 bg-green-50 px-2 py-0.5 rounded-full"
                    >
                      <Mail size={12} />
                      <span>{t.email}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic">No email provided</span>
                  )}
                </td>
                <td className="py-3 px-4 text-yellow-500 font-bold whitespace-nowrap">
                  {t.rating} ★
                </td>
                <td className="py-3 px-4 text-gray-600 text-sm max-w-xs">
                  <p className="line-clamp-2" title={t.text}>{t.text}</p>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <button
                    onClick={() => togglePublish(t)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      t.is_published 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {t.is_published ? 'Published' : 'Pending Review'}
                  </button>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  {t.email && (
                    <a
                      href={`mailto:${t.email}?subject=${encodeURIComponent('Thank you for your review - TNA Catfish')}&body=${encodeURIComponent(`Hi ${t.name},\n\nThank you for sharing your feedback with TNA Catfish!\n\nBest regards,\nTNA Catfish Team`)}`}
                      className="text-green-600 hover:text-green-800 p-2 inline-flex items-center hover:bg-green-50 rounded-lg transition-colors"
                      title={`Reply to ${t.email}`}
                    >
                      <Send size={17} />
                    </a>
                  )}
                  <button onClick={() => openEditModal(t)} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Edit size={17} />
                  </button>
                  <button onClick={() => handleDuplicate(t)} className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-colors" title="Duplicate">
                    <Copy size={17} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Adebayo"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Oshogbo"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  />
                </div>
              </div>

              {/* Customer Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="e.g. customer@gmail.com"
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Allows administrators to reply directly to the customer.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Rating (1-5)</label>
                <input
                  type="number"
                  min="1" max="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={editForm.rating}
                  onChange={(e) => setEditForm({...editForm, rating: Number(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Review Text *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Customer feedback..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  value={editForm.text}
                  onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={!!editForm.is_published}
                  onChange={(e) => setEditForm({...editForm, is_published: e.target.checked ? 1 : 0})}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">Published (Visible to public on website)</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <button onClick={closeModal} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={saveTestimonial} className="px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 rounded-lg transition-colors">
                {editingId ? 'Save Changes' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </div>
  );
}


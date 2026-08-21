import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Edit, Copy, Plus, X } from 'lucide-react';
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
    setEditForm({ ...t });
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

  if (loading) return <div>Loading testimonials...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Manage Testimonials & Reviews</h3>
        <button onClick={openAddModal} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Rating</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Review</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map(t => (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">
                  {t.name} <br/><span className="text-xs text-gray-500">{t.location}</span>
                </td>
                <td className="py-3 px-4 text-yellow-500 font-bold">{t.rating} Stars</td>
                <td className="py-3 px-4 text-gray-600 text-sm max-w-xs truncate">{t.text}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${t.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`} onClick={() => togglePublish(t)}>
                    {t.is_published ? 'Published' : 'Pending Review'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button onClick={() => openEditModal(t)} className="text-blue-600 hover:text-blue-800 p-2" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDuplicate(t)} className="text-indigo-600 hover:text-indigo-800 p-2" title="Duplicate">
                    <Copy size={18} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800 p-2" title="Delete">
                    <Trash2 size={18} />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Rating (1-5)</label>
                <input
                  type="number"
                  min="1" max="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  value={editForm.rating}
                  onChange={(e) => setEditForm({...editForm, rating: Number(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Review Text *</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  value={editForm.text}
                  onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={!!editForm.is_published}
                  onChange={(e) => setEditForm({...editForm, is_published: e.target.checked ? 1 : 0})}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">Published (Visible on frontend)</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <button onClick={closeModal} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={saveTestimonial} className="px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 rounded-lg transition-colors">
                {editingId ? 'Save Edited Content' : 'Add'}
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

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, Copy, X } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ConfirmModal from './components/ConfirmModal';
import { useCMS } from '../context/CMSContext';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { refreshData } = useCMS();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('/api/cms/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
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
      const res = await fetch(`/api/cms/products/${itemToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      }
    } catch (err) {
      toast.error('Network error');
    }
    setItemToDelete(null);
  };

  const togglePublish = async (product: any) => {
    try {
      const res = await fetch(`/api/cms/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, is_published: product.is_published ? 0 : 1 })
      });
      if (res.ok) {
        toast.success(`Product ${product.is_published ? 'unpublished' : 'published'}`);
        fetchProducts();
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleDuplicate = async (product: any) => {
    const newProduct = {
      ...product,
      name: `${product.name} (Copy)`,
      is_published: 0,
      order_index: products.length
    };
    delete newProduct.id;
    
    try {
      const res = await fetch('/api/cms/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        toast.success('Product duplicated as draft.');
        fetchProducts();
      }
    } catch (err) {}
  };

  const openAddModal = () => {
    setEditingId(null);
    setEditForm({
      name: '',
      description: '',
      price: '',
      image: '',
      badge: '',
      is_published: 1,
      order_index: products.length
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    setEditForm({ ...product });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditForm(null);
    setEditingId(null);
  };

  const saveProduct = async () => {
    if (!editForm.name) return toast.error('Name is required');
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/cms/products/${editingId}` : '/api/cms/products';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        toast.success(editingId ? 'Product updated' : 'Product added');
        fetchProducts();
        closeModal();
      } else {
        toast.error('Failed to save product');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Manage Products</h3>
        <button onClick={openAddModal} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Image</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Price</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-md" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">No Img</div>
                  )}
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">{p.name}</td>
                <td className="py-3 px-4 text-gray-600">{p.price}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${p.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`} onClick={() => togglePublish(p)}>
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button onClick={() => openEditModal(p)} className="text-blue-600 hover:text-blue-800 p-2" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDuplicate(p)} className="text-indigo-600 hover:text-indigo-800 p-2" title="Duplicate">
                    <Copy size={18} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800 p-2" title="Delete">
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
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <ImageUploader 
                value={editForm.image} 
                onChange={(url) => setEditForm({...editForm, image: url})} 
                label="Product Image"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Badge (e.g. Popular)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  value={editForm.badge}
                  onChange={(e) => setEditForm({...editForm, badge: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
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
              <button onClick={saveProduct} className="px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 rounded-lg transition-colors">
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
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Eye, Star } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    testimonials: 0
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/cms/products').then(res => res.json()),
      fetch('/api/cms/testimonials').then(res => res.json())
    ]).then(([products, testimonials]) => {
      setStats({
        products: products.length,
        testimonials: testimonials.length
      });
    });
  }, []);

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Welcome to TNA Catfish CMS</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
              <h4 className="text-3xl font-bold text-gray-900">{stats.products}</h4>
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-green-700">
              <ShoppingBag size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Testimonials</p>
              <h4 className="text-3xl font-bold text-gray-900">{stats.testimonials}</h4>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg text-yellow-700">
              <Star size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Live Views</p>
              <h4 className="text-3xl font-bold text-gray-900">--</h4>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-blue-700">
              <Eye size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h4>
        <div className="flex gap-4">
          <a href="/admin/products" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors">Manage Products</a>
          <a href="/admin/settings" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors">Edit Homepage</a>
        </div>
      </div>
    </div>
  );
}

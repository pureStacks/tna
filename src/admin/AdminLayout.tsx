import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, ShoppingBag, MessageSquare, LogOut, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../lib/api';

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    apiFetch('/api/auth/me')
      .then(res => {
        if (res.ok) setIsAuthenticated(true);
        else setIsAuthenticated(false);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    window.location.href = '/admin/login';
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading Admin...</div>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/admin/login" />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <MessageSquare size={20} /> },
    { name: 'Global Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    { name: 'Security', path: '/admin/security', icon: <Shield size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-green-400">TNA<span className="text-yellow-500">Catfish</span> CMS</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-green-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <a href="/" target="_blank" className="block w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-center font-medium transition-colors mb-3">
            Preview Website
          </a>
          <button onClick={handleLogout} className="flex items-center justify-center space-x-2 w-full py-2 px-4 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-8">
          <h2 className="text-xl font-bold text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
          </h2>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

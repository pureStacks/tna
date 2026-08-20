import { Shield } from 'lucide-react';

export default function DevAdminIcon() {
  // Can be disabled in production via env var
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <a
      href="/admin/login"
      className="fixed top-4 right-4 z-50 bg-gray-900/80 hover:bg-gray-900 text-white p-3 rounded-full shadow-lg backdrop-blur-sm transition-all group"
      title="Development Admin Login"
    >
      <Shield size={20} className="group-hover:scale-110 transition-transform" />
    </a>
  );
}

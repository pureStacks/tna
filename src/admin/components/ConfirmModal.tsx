import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Deletion', 
  message = 'Are you sure you want to delete this item? This action cannot be undone.' 
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-center text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-center text-gray-500 mb-6">{message}</p>
          
          <div className="flex justify-center gap-3">
            <button 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors w-full"
            >
              Cancel
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }} 
              className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg transition-colors w-full"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';

export default function WhatsAppButton() {
  const [showPopup, setShowPopup] = useState(false);
  const { data } = useCMS();
  
  const whatsappRaw = data?.settings?.contact?.whatsappRaw || '';
  const whatsappMessage = data?.settings?.contact?.whatsappMessage || '';
  const getWhatsAppLink = () => `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 15000); // Show popup after 15 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4 bg-white rounded-xl shadow-2xl p-4 border border-gray-100 relative max-w-xs"
          >
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
            <div className="mb-2">
              <h4 className="font-bold text-gray-900">Need Help Ordering?</h4>
              <p className="text-sm text-gray-600 mt-1">Chat with TNA Catfish on WhatsApp</p>
            </div>
            <a 
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowPopup(false)}
              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center text-sm font-bold py-2 rounded-lg transition-colors"
            >
              CHAT ON WHATSAPP
            </a>
            {/* Pointer triangle */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all hover:-translate-y-1 group"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setShowPopup(true)}
      >
        <MessageCircle size={32} className="group-hover:animate-pulse" />
      </a>
    </div>
  );
}

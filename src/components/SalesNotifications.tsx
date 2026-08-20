import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';

const notifications = [
  { name: 'John', location: 'Lagos', time: '2 minutes ago' },
  { name: 'Aisha', location: 'Abuja', time: '5 minutes ago' },
  { name: 'Michael', location: 'Ibadan', time: '12 minutes ago' },
  { name: 'Sarah', location: 'Oshogbo', time: '23 minutes ago' },
  { name: 'Emmanuel', location: 'Ilorin', time: '1 hour ago' },
  { name: 'Grace', location: 'Akure', time: '2 hours ago' },
  { name: 'David', location: 'Abeokuta', time: '3 hours ago' },
  { name: 'Joy', location: 'Port Harcourt', time: '5 hours ago' },
  { name: 'Peter', location: 'Benin City', time: '1 day ago' },
];

export default function SalesNotifications() {
  const [currentNotification, setCurrentNotification] = useState<typeof notifications[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show first notification after a short delay
    const initialTimer = setTimeout(() => {
      showRandomNotification();
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, []);

  const showRandomNotification = () => {
    const random = notifications[Math.floor(Math.random() * notifications.length)];
    setCurrentNotification(random);
    setIsVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
      // Schedule next notification (between 15 and 45 seconds)
      const nextDelay = Math.floor(Math.random() * 30000) + 15000;
      setTimeout(showRandomNotification, nextDelay);
    }, 5000);
  };

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-24 left-4 md:bottom-6 md:left-6 z-40 max-w-sm w-full md:w-auto"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 pr-10 relative overflow-hidden">
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-2 rounded-full text-green-700 flex-shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-800 font-medium leading-tight">
                  <span className="font-bold">{currentNotification.name}</span> from {currentNotification.location} just ordered catfish
                </p>
                <p className="text-xs text-gray-500 mt-1">{currentNotification.time}</p>
              </div>
            </div>
            {/* Loading bar effect */}
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-green-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

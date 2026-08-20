import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data } = useCMS();
  
  const headerData = data?.settings?.header;
  const whatsappRaw = data?.settings?.contact?.whatsappRaw || '';
  const whatsappMessage = data?.settings?.contact?.whatsappMessage || '';
  const getWhatsAppLink = () => `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-4' : 'bg-white/90 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#home" className="text-2xl font-bold tracking-tight">
              <span className="text-green-800">TNA</span>
              <span className="text-yellow-500">Catfish</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {headerData?.navLinks?.filter((link: any) => link.visible).map((link: any) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-green-700 font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-full font-semibold transition-colors shadow-sm hover:shadow-md"
            >
              ORDER NOW
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-green-700 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {headerData?.navLinks?.filter((link: any) => link.visible).map((link: any) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-md"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 px-3">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                ORDER NOW
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

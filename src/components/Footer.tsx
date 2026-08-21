import { BUSINESS_INFO } from '../lib/constants';
import { useCMS } from '../context/CMSContext';

export default function Footer() {
  const { data } = useCMS();
  const contact = data?.settings?.contact || {};
  const address = contact.address || BUSINESS_INFO.address;
  const email = contact.email || BUSINESS_INFO.email;
  const whatsapp = contact.whatsapp || BUSINESS_INFO.whatsapp;
  const whatsappRaw = contact.whatsappRaw || BUSINESS_INFO.whatsappRaw;

  const footer = data?.settings?.footer || {};
  const footerDesc = footer.description || 'Providing quality, fresh, and healthy catfish in Osun State, Nigeria. Your trusted partner for personal and commercial catfish supply.';
  const copyright = footer.copyright || '© 2026 TNA catfish. All Rights Reserved.';

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-green-400 tracking-tight mb-6">
              TNA<span className="text-yellow-500">Catfish</span>
            </h3>
            <p className="text-gray-400 leading-relaxed max-w-sm mb-6">
              {footerDesc}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#home" className="hover:text-green-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-green-400 transition-colors">About</a></li>
              <li><a href="#products" className="hover:text-green-400 transition-colors">Our Catfish</a></li>
              <li><a href="#features" className="hover:text-green-400 transition-colors">Why Choose Us</a></li>
              <li><a href="#testimonials" className="hover:text-green-400 transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="hover:text-green-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <span className="block">{address}</span>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-green-400 transition-colors break-all">
                  {email}
                </a>
              </li>
              <li>
                <a href={`tel:${whatsappRaw}`} className="hover:text-green-400 transition-colors">
                  {whatsapp}
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            {copyright}
          </p>
          <div className="flex space-x-6 items-center">
            <a href="#home" className="text-gray-500 hover:text-green-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#home" className="text-gray-500 hover:text-green-400 text-sm transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

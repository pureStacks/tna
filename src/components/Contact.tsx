import { motion } from 'motion/react';
import { MapPin, Mail, Phone, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO, getWhatsAppLink } from '../lib/constants';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-green-700 font-bold tracking-wider uppercase text-sm mb-3">Contact Us</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Get in Touch with TNA Catfish
            </h3>
            <p className="text-lg text-gray-600 mb-10">
              Ready to place an order or have questions about our catfish? Contact us today. We are always ready to assist you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-50 p-3 rounded-full text-green-700 mt-1">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Farm Location</h4>
                  <p className="text-gray-600">{BUSINESS_INFO.address}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-50 p-3 rounded-full text-green-700 mt-1">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Phone & WhatsApp</h4>
                  <a href={`tel:${BUSINESS_INFO.whatsappRaw}`} className="text-gray-600 hover:text-green-700 transition-colors block">
                    {BUSINESS_INFO.whatsapp}
                  </a>
                  <a 
                    href={getWhatsAppLink()} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 font-semibold hover:text-green-800 transition-colors inline-flex items-center mt-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" /> Chat on WhatsApp
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-50 p-3 rounded-full text-green-700 mt-1">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Email Address</h4>
                  <a href={`mailto:${BUSINESS_INFO.email}`} className="text-gray-600 hover:text-green-700 transition-colors">
                    {BUSINESS_INFO.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-slate-50 p-2 rounded-3xl"
          >
            {/* Simple Map Placeholder/Visual */}
            <div className="bg-gray-200 rounded-2xl h-[400px] w-full overflow-hidden relative shadow-inner border border-gray-300">
               <div className="absolute inset-0 bg-green-900/10 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                  <div className="bg-white/90 p-6 rounded-2xl shadow-xl max-w-sm">
                    <MapPin className="w-10 h-10 text-green-700 mx-auto mb-3" />
                    <h5 className="font-bold text-gray-900 text-lg mb-1">TNA Catfish</h5>
                    <p className="text-gray-600 text-sm">{BUSINESS_INFO.address}</p>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(BUSINESS_INFO.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors"
                    >
                      View on Map
                    </a>
                  </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { useCMS } from '../context/CMSContext';

export default function Products() {
  const { data } = useCMS();
  const products = data?.products || [];
  const whatsappRaw = data?.settings?.contact?.whatsappRaw || '';
  const whatsappMessage = data?.settings?.contact?.whatsappMessage || '';
  const getWhatsAppLink = (productName: string) => `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(`Hello TNA Catfish, I am interested in ordering the ${productName}. Please let me know the availability and pricing.`)}`;
  return (
    <section id="products" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-green-700 font-bold tracking-wider uppercase text-sm mb-3">Our Catfish</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Premium Quality for Every Need
          </h3>
          <p className="text-lg text-gray-600">
            We provide the best selection of catfish, carefully raised to meet your personal or commercial requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/800x600/e2e8f0/475569?text=Please+Upload+ImgBB+Image';
                  }}
                />
                {product.badge && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    {product.badge}
                  </div>
                )}
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h4 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h4>
                <p className="text-gray-600 mb-6 flex-grow">{product.description}</p>
                
                <div className="flex items-center justify-between mb-8">
                  <span className="text-green-800 font-semibold text-lg">{product.price}</span>
                </div>
                
                <a 
                  href={getWhatsAppLink(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-6 rounded-xl text-center transition-colors shadow-sm"
                >
                  ORDER NOW
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

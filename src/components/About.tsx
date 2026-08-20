import { motion } from 'motion/react';
import { useCMS } from '../context/CMSContext';

export default function About() {
  const { data } = useCMS();
  const aboutData = data?.settings?.about;
  const whatsappRaw = data?.settings?.contact?.whatsappRaw || '';
  const whatsappMessage = data?.settings?.contact?.whatsappMessage || '';
  const getWhatsAppLink = () => `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(whatsappMessage)}`;
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <img 
                src={aboutData?.image} 
                alt="TNA Catfish Farm" 
                className="w-full h-full object-cover bg-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/800x600/e2e8f0/475569?text=Please+Upload+ImgBB+Image';
                }}
              />
              <div className="absolute inset-0 border-4 border-white/20 rounded-2xl mix-blend-overlay"></div>
            </div>
            
            <div className="absolute -top-6 -right-6 lg:-left-6 lg:right-auto bg-green-700 text-white p-6 rounded-2xl shadow-lg max-w-xs">
              <h4 className="text-3xl font-bold text-yellow-400 mb-1">{aboutData?.stat}</h4>
              <p className="font-medium">{aboutData?.statText}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-green-700 font-bold tracking-wider uppercase text-sm mb-3">{aboutData?.headingBadge}</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {aboutData?.heading}
            </h3>
            
            <div className="space-y-4 text-lg text-gray-600 mb-8">
              {aboutData?.paragraphs?.map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <a 
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-semibold text-green-700 hover:text-green-800 transition-colors text-lg group"
            >
              Order from us today
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

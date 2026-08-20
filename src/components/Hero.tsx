import { motion } from 'motion/react';
import { useCMS } from '../context/CMSContext';
import { CheckCircle } from 'lucide-react';

export default function Hero() {
  const { data } = useCMS();
  const homeData = data?.settings?.home;
  const whatsappRaw = data?.settings?.contact?.whatsappRaw || '';
  const whatsappMessage = data?.settings?.contact?.whatsappMessage || '';
  const getWhatsAppLink = () => `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(whatsappMessage)}`;
  return (
    <section id="home" className="relative pt-28 pb-20 md:pt-36 md:pb-28 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
              </span>
              <span className="text-sm font-semibold tracking-wide uppercase">{homeData?.badgeText}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {homeData?.heading1} <span className="text-green-700">{homeData?.heading2}</span> {homeData?.heading3}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {homeData?.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a 
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-full font-bold text-lg text-center transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                ORDER NOW
              </a>
              <a 
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 px-8 py-4 rounded-full font-bold text-lg text-center transition-all"
              >
                CHAT ON WHATSAPP
              </a>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-8">
              {homeData?.trustIndicators?.map((trust: string) => (
                <div key={trust} className="flex items-center text-gray-700 font-medium">
                  <CheckCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  {trust}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-lg mx-auto lg:max-w-none"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-square">
              <img 
                src={homeData?.heroImage} 
                alt="Fresh healthy catfish from TNA Catfish" 
                className="w-full h-full object-cover bg-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/800x800/e2e8f0/475569?text=Please+Upload+ImgBB+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-green-900/20 to-transparent"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center space-x-4 animate-bounce-slow">
              <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Customer Rating</p>
                <p className="font-bold text-gray-900">{homeData?.customerRating}</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { getWhatsAppLink } from '../lib/constants';

const steps = [
  {
    number: '01',
    title: 'Choose Your Catfish',
    description: 'Select the quantity or product you need from our available options.',
  },
  {
    number: '02',
    title: 'Place Your Order',
    description: 'Click ORDER NOW or contact TNA Catfish through WhatsApp to send your request.',
  },
  {
    number: '03',
    title: 'Confirm & Receive',
    description: 'Confirm your order and arrange the agreed collection or delivery method.',
  }
];

export default function HowToOrder() {
  return (
    <section className="py-24 bg-green-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute w-full h-full">
          <path d="M0,50 Q25,25 50,50 T100,50 L100,100 L0,100 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-yellow-400 font-bold tracking-wider uppercase text-sm mb-3">How To Order</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Simple 3-Step Ordering Process
          </h3>
          <p className="text-lg text-green-100">
            Getting fresh catfish from us is extremely easy. Just follow these simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-green-700 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-white text-green-800 flex items-center justify-center text-3xl font-black mb-6 shadow-xl border-4 border-green-800">
                {step.number}
              </div>
              <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
              <p className="text-green-100 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-green-900 px-10 py-4 rounded-full font-bold text-lg transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            ORDER NOW
          </a>
        </div>
      </div>
    </section>
  );
}

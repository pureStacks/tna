import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function Features() {
  const { data } = useCMS();
  const featuresData = data?.settings?.features || {};
  
  const defaultFeatures = [
    {
      icon: 'ShieldCheck',
      title: 'Quality',
      description: 'Quality-focused catfish supplied to our customers, raised with premium feed.',
    },
    {
      icon: 'Droplet',
      title: 'Freshness',
      description: 'Fresh and healthy fish prepared for customers straight from the ponds.',
    },
    {
      icon: 'Truck',
      title: 'Reliable Supply',
      description: 'Dependable service for customers requiring catfish on a regular basis.',
    },
    {
      icon: 'Tag',
      title: 'Competitive Value',
      description: 'Professional service and fair pricing for all our product offerings.',
    },
    {
      icon: 'Smile',
      title: 'Customer Satisfaction',
      description: 'Customer-focused ordering experience to ensure you get exactly what you need.',
    },
    {
      icon: 'MousePointerClick',
      title: 'Easy Ordering',
      description: 'Simple ordering through WhatsApp with fast and responsive communication.',
    }
  ];

  const displayFeatures = featuresData.items || defaultFeatures;

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Star;
    return <IconComponent className="w-8 h-8 text-green-700" />;
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-green-700 font-bold tracking-wider uppercase text-sm mb-3">
            {featuresData.badgeText || 'Why Choose TNA Catfish'}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {featuresData.heading || 'The Best Choice for Your Catfish Needs'}
          </h3>
          <p className="text-lg text-gray-600">
            {featuresData.description || 'We are dedicated to providing an unmatched standard of quality and service in Osun State.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeatures.map((feature: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-green-200 hover:shadow-lg transition-all group"
            >
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {renderIcon(feature.icon)}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

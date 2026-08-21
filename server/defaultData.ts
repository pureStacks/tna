export const DEFAULT_SETTINGS = {
  id: 1,
  header: {
    logoText: 'TNA Catfish',
    navLinks: [
      { name: 'Home', href: '#home', visible: true },
      { name: 'About', href: '#about', visible: true },
      { name: 'Our Catfish', href: '#products', visible: true },
      { name: 'Why Choose Us', href: '#features', visible: true },
      { name: 'Testimonials', href: '#testimonials', visible: true },
      { name: 'Contact', href: '#contact', visible: true }
    ]
  },
  home: {
    badgeText: 'Available in Osun State and smooth deliveries to any location.',
    heading1: 'Fresh, Healthy &',
    heading2: 'Quality Catfish',
    heading3: 'You Can Trust',
    description: 'Get quality catfish from TNA Catfish — carefully raised, healthy, fresh, and ready for your next order. Perfect for personal consumption and commercial needs.',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Fish_farm.jpg',
    customerRating: '4.9/5 Stars',
    trustIndicators: ['Quality Catfish', 'Fresh & Healthy', 'Reliable Supply']
  },
  about: {
    headingBadge: 'About TNA Catfish',
    heading: 'Dedicated to Raising the Best Catfish in Osun State',
    paragraphs: [
      'TNA Catfish is a premium fish farming business located in Oshogbo, Osun State. We specialize in breeding, raising, and supplying high-quality, healthy catfish to individuals, restaurants, and market sellers.',
      'Our commitment to quality means our fish are raised in clean, well-maintained ponds with optimal nutrition. This ensures every catfish you buy from us is fresh, tastes excellent, and provides great nutritional value.',
      'Whether you need a steady reliable supply for your business, or a fresh batch for your family\'s next meal, we are dedicated to your complete satisfaction.'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Fishpond.jpg',
    stat: '100%',
    statText: 'Commitment to freshness and customer satisfaction'
  },
  features: {
    badgeText: 'Why Choose TNA Catfish',
    heading: 'The Best Choice for Your Catfish Needs',
    description: 'We are dedicated to providing an unmatched standard of quality and service in Osun State.',
    items: [
      { icon: 'ShieldCheck', title: 'Quality Assured', description: 'Raised in clean, monitored freshwater ponds with balanced feeds.' },
      { icon: 'Droplet', title: 'Freshness Guaranteed', description: 'Harvested fresh for each order, maintaining premium taste and texture.' },
      { icon: 'Truck', title: 'Reliable Delivery', description: 'Fast, secure delivery options within Oshogbo and surrounding states.' },
      { icon: 'Award', title: 'Competitive Pricing', description: 'Direct farm-gate rates for retail, wholesale, and bulk buyers.' }
    ]
  },
  contact: {
    address: 'Zone 9, Olofa Estate, Oshogbo, Osun State, Nigeria',
    email: 'nurudeenayobami37@gmail.com',
    backupEmail: 'nurudeenayobami37@gmail.com',
    whatsapp: '+234 905 884 8996',
    whatsappRaw: '2349058848996',
    whatsappMessage: 'Hello TNA Catfish, I would like to place an order. Please provide me with the available catfish options and prices.'
  },
  footer: {
    description: 'Providing quality, fresh, and healthy catfish in Osun State, Nigeria. Your trusted partner for personal and commercial catfish supply.',
    copyright: '© 2026 TNA Catfish. All Rights Reserved.'
  }
};

export const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Fresh Live Catfish (Table Size)',
    tag: 'Most Popular',
    price: '₦2,500 / kg',
    description: 'Farm-fresh live catfish harvested directly from our clean ponds. Vigorous, healthy, and high nutritional value.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Clarias_gariepinus.jpg',
    features: ['100% Organically fed', 'Sizes from 800g to 2kg+', 'Cleaned upon request', 'Bulk supply available'],
    is_published: 1,
    order_index: 1
  },
  {
    id: 2,
    name: 'Smoked / Oven-Dried Catfish',
    tag: 'Ready to Cook',
    price: '₦3,500 / pack',
    description: 'Hygienically cleaned and oven-dried catfish using clean heat and zero sand or grit. Long shelf-life and rich aroma.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Catfish_for_sale.jpg',
    features: ['Sand-free & grit-free', 'Naturally preserved & aromatic', 'Perfect for soups and stews', 'Nationwide delivery'],
    is_published: 1,
    order_index: 2
  },
  {
    id: 3,
    name: 'Cleaned & Dressed Catfish (Frozen/Chilled)',
    tag: 'Kitchen Ready',
    price: '₦2,800 / kg',
    description: 'Gutted, thoroughly washed, and cut into portions ready for your cooking pot. Saves preparation time.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Clarias_gariepinus.jpg',
    features: ['Pre-washed & slime-free', 'Portioned to preference', 'Packed in food-grade bags', 'Same-day farm harvest'],
    is_published: 1,
    order_index: 3
  }
];

export const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: 'Adeola Balogun',
    location: 'Oshogbo, Osun State',
    text: 'TNA Catfish is simply the best in Osun! The fish were big, very active, and tasted extremely sweet in our family pepper soup. Will definitely order regularly.',
    rating: 5,
    is_published: 1,
    order_index: 1
  },
  {
    id: 2,
    name: 'Chief Emmanuel Okon',
    location: 'Ibadan, Oyo State',
    text: 'We order smoked catfish in bulk for our restaurant. The fish are completely sand-free, properly dried, and have an authentic smoked flavor our customers love.',
    rating: 5,
    is_published: 1,
    order_index: 2
  },
  {
    id: 3,
    name: 'Mrs. Folake Adeleke',
    location: 'Ilesa, Osun State',
    text: 'The dressed catfish made my party cooking so easy. Cleaned nicely without any slime, arrived on time, and very reasonable pricing.',
    rating: 5,
    is_published: 1,
    order_index: 3
  }
];

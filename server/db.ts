import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export let db: any = {};

const initialSettings = {
  header: {
    logoText: 'TNA Catfish',
    navLinks: [
      { name: 'Home', href: '#home', visible: true },
      { name: 'About', href: '#about', visible: true },
      { name: 'Our Catfish', href: '#products', visible: true },
      { name: 'Why Choose Us', href: '#features', visible: true },
      { name: 'Testimonials', href: '#testimonials', visible: true },
      { name: 'Contact', href: '#contact', visible: true },
    ]
  },
  home: {
    badgeText: 'Available in Osun State',
    heading1: 'Fresh, Healthy &',
    heading2: 'Quality Catfish',
    heading3: 'You Can Trust',
    description: 'Get quality catfish from TNA Catfish — carefully raised, healthy, fresh, and ready for your next order. Perfect for personal consumption and commercial needs.',
    trustIndicators: ['Quality Catfish', 'Fresh & Healthy', 'Reliable Supply'],
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Fish_farm.jpg',
    customerRating: '4.9/5 Stars'
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
  contact: {
    address: 'Zone 9, Olofa Estate, Oshogbo, Osun State, Nigeria',
    email: 'nurudeenayobami37@gmail.com',
    whatsapp: '+234 905 884 8996',
    whatsappRaw: '2349058848996',
    whatsappMessage: 'Hello TNA Catfish, I would like to place an order. Please provide me with the available catfish options and prices.'
  },
  footer: {
    copyright: '© 2026 TNA catfish. All Rights Reserved.',
    description: 'Providing quality, fresh, and healthy catfish in Osun State, Nigeria. Your trusted partner for personal and commercial catfish supply.'
  }
};

const initialProducts = [
  {
    id: 1,
    name: 'Fresh Live Catfish',
    description: 'Healthy, active, and well-fed live catfish straight from our ponds. Available in various sizes (table size, broodstock).',
    price: 'Contact for Price',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Clarias_gariepinus.jpg',
    badge: 'Popular',
    is_published: 1,
    order_index: 0
  },
  {
    id: 2,
    name: 'Prepared / Fresh Cut Catfish',
    description: 'Cleaned, cut, and prepared catfish ready for immediate cooking. Handled with the highest hygiene standards.',
    price: 'Contact for Price',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Catfish_for_sale.jpg',
    badge: '',
    is_published: 1,
    order_index: 1
  }
];

const initialTestimonials = [
  {
    id: 1,
    name: 'David',
    location: 'Lagos',
    text: 'The catfish were fresh and the ordering process was very easy. I was impressed with the service and the quality of the fish. Highly recommended!',
    rating: 5,
    is_published: 1,
    order_index: 0
  },
  {
    id: 2,
    name: 'Sarah',
    location: 'Oshogbo',
    text: 'TNA Catfish has been my regular supplier for my restaurant. Their consistency in delivering healthy and well-sized catfish is unmatched.',
    rating: 5,
    is_published: 1,
    order_index: 1
  },
  {
    id: 3,
    name: 'Emmanuel',
    location: 'Ibadan',
    text: 'Great value for money. The fish were very active and healthy upon collection. The WhatsApp communication made the whole process smooth.',
    rating: 5,
    is_published: 1,
    order_index: 2
  }
];

export async function initializeDatabase() {
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } else {
    const hashedPassword = await bcrypt.hash('@admin123', 10);
    db = {
      users: [
        { id: 1, username: 'admin', password: hashedPassword }
      ],
      settings: initialSettings,
      products: initialProducts,
      testimonials: initialTestimonials
    };
    saveDb();
  }
}

export function saveDb() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

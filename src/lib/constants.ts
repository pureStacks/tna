export const BUSINESS_INFO = {
  name: 'TNA Catfish',
  address: 'Zone 9, Olofa Estate, Oshogbo, Osun State, Nigeria',
  email: 'nurudeenayobami37@gmail.com',
  whatsapp: '+234 905 884 8996',
  whatsappRaw: '2349058848996',
  whatsappMessage: 'Hello TNA Catfish, I would like to place an order. Please provide me with the available catfish options and prices.',
};

export const getWhatsAppLink = () => {
  return `https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(BUSINESS_INFO.whatsappMessage)}`;
};

export const IMAGES = {
  // IMPORTANT: To use your ImgBB images, replace the URLs below with your DIRECT ImgBB image links.
  // A direct ImgBB link MUST end in .jpg or .png (e.g., "https://i.ibb.co/XXXXXX/your-image.jpg").
  // Do NOT use the viewer link (e.g., "https://ibb.co/XXXXXX").
  
  // Currently using real, high-quality public domain catfish and pond images.
  hero: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Fish_farm.jpg',
  farm: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Fishpond.jpg',
  productLive: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Clarias_gariepinus.jpg',
  productPrepared: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Catfish_for_sale.jpg',
};



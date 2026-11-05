export const mockProducts = [
  {
    id: '1',
    name: 'Iron Forge Heavyweight Oversized Tee',
    price: 1499.00,
    category: 'T-Shirts',
    image: '/categories/tshirts.png',
    colors: ['Washed Charcoal', 'Pitch Black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Heavyweight 100% combed cotton with exaggerated drop-shoulder cut. Engineered for the ultimate pump cover aesthetic.',
    isTrending: true
  },
  {
    id: '2',
    name: 'Tactical Iron Cargo Joggers',
    price: 1999.00,
    category: 'Joggers',
    image: '/categories/joggers.png',
    colors: ['Matte Black', 'Gunmetal Grey'],
    sizes: ['M', 'L', 'XL'],
    description: 'Heavyweight french terry with deep utility zipper pockets, reinforced knee articulation, and custom cuff tapering.',
    isTrending: true
  },
  {
    id: '3',
    name: 'Shadow Core Compression Longsleeve',
    price: 1299.00,
    category: 'Gym Wear',
    image: '/categories/gym-wear.png',
    colors: ['Onyx Black', 'Carbon Slate'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'High-density 4-way stretch compression with anti-microbial sweat dispersion and muscle contouring paneling.',
    isTrending: true
  },
  {
    id: '4',
    name: 'Relentless Acid-Wash Boxy Hoodie',
    price: 2499.00,
    category: 'Merch',
    image: '/categories/merch.png',
    colors: ['Mineral Black', 'Smoked Olive'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    description: 'Custom-milled heavyweight fleece with double-lined raw edge hood and oversized boxy drape.',
    isTrending: true
  },
  {
    id: '5',
    name: 'Barbell Club Graphic Heavy Tee',
    price: 1399.00,
    category: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
    colors: ['Vintage Black', 'Chalk Off-White'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    description: 'Distressed vintage wash with subtle cracked-ink typography on back and chest emblem.',
    isTrending: false
  },
  {
    id: '6',
    name: 'Raw-Hem Training Tank',
    price: 1199.00,
    category: 'Gym Wear',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
    colors: ['Pitch Black', 'Iron Grey'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Deep drop-armhole gym tank designed for unrestricted shoulder mobility and lat clearance.',
    isTrending: true
  },
  {
    id: '7',
    name: 'Heavy Fleece Cuffed Joggers',
    price: 1899.00,
    category: 'Joggers',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
    colors: ['Charcoal', 'Black'],
    sizes: ['M', 'L', 'XL'],
    description: 'Ultra-soft fleece with tailored ribbed cuffs and thick drawcord waistband.',
    isTrending: false
  },
  {
    id: '8',
    name: 'SunDrip Structured Iron Cap',
    price: 899.00,
    category: 'Merch',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
    colors: ['Matte Black'],
    sizes: ['One Size'],
    description: 'Low-profile structured 6-panel athletic cap with subtle embroidered monogram.',
    isTrending: false
  }
];

export const categories = [
  { 
    id: 'tshirts', 
    name: 'T-SHIRTS', 
    slug: 'T-Shirts',
    image: '/categories/tshirts.png' 
  },
  { 
    id: 'joggers', 
    name: 'JOGGERS', 
    slug: 'Joggers',
    image: '/categories/joggers.png' 
  },
  { 
    id: 'gym-wear', 
    name: 'GYM WEAR', 
    slug: 'Gym Wear',
    image: '/categories/gym-wear.png' 
  },
  { 
    id: 'merch', 
    name: 'MERCH', 
    slug: 'Merch',
    image: '/categories/merch.png' 
  }
];

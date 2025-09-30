export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  description: string;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  colors?: string[];
  brand: string;
}

export const products: Product[] = [
  // Home & Living
  {
    id: 1,
    name: "Luminous Home Diffuser",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1757774636743-e5235c608fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGhvbWUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NTkyMDk5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Home & Living",
    description: "Transform your space with this elegant ultrasonic diffuser that combines style and functionality.",
    features: ["Ultrasonic technology", "7-color LED lighting", "Auto shut-off", "Whisper quiet"],
    inStock: true,
    isBestSeller: true,
    colors: ["White", "Black", "Wood"],
    brand: "Lumina"
  },
  {
    id: 2,
    name: "Minimalist Ceramic Vase Set",
    price: 45.99,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1681557225327-e4e23744d667?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwaG9tZSUyMGRlY29yfGVufDF8fHx8MTc1OTIwOTkxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Home & Living",
    description: "Set of three handcrafted ceramic vases perfect for fresh flowers or dried arrangements.",
    features: ["Handcrafted ceramic", "Set of 3 sizes", "Matte finish", "Dishwasher safe"],
    inStock: true,
    colors: ["White", "Sage", "Terracotta"],
    brand: "Artisan Craft"
  },
  {
    id: 3,
    name: "Smart Storage Organizer",
    price: 34.99,
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1687953413905-731f620177ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwc3RvcmFnZSUyMHNvbHV0aW9uc3xlbnwxfHx8fDE3NTkyMTQ4MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Home & Living",
    description: "Versatile modular storage system that adapts to any space and organizing need.",
    features: ["Modular design", "Easy assembly", "Multiple configurations", "Durable plastic"],
    inStock: true,
    isNew: true,
    colors: ["Clear", "White", "Grey"],
    brand: "OrganizeIt"
  },

  // Kitchen Essentials
  {
    id: 4,
    name: "Smart Kitchen Organizer",
    price: 64.99,
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1665768976778-22ab017f915a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwb3JnYW5pemF0aW9uJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzU5MjE0ODI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Kitchen Essentials",
    description: "Revolutionary kitchen organization system that maximizes counter space and efficiency.",
    features: ["Space-saving design", "Non-slip base", "Easy clean", "Bamboo construction"],
    inStock: true,
    isNew: true,
    colors: ["Natural", "White"],
    brand: "KitchenSmart"
  },
  {
    id: 5,
    name: "Ceramic Spice Jar Set",
    price: 39.99,
    originalPrice: 54.99,
    rating: 4.6,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1631677640738-65373fbd1f64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBraXRjaGVuJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzU5MjA5OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Kitchen Essentials",
    description: "Set of 12 airtight ceramic spice jars with magnetic lids for easy access and storage.",
    features: ["Airtight seal", "Magnetic lids", "Set of 12", "Labels included"],
    inStock: true,
    colors: ["White", "Black"],
    brand: "SpiceKeeper"
  },

  // Work & Productivity
  {
    id: 6,
    name: "Minimalist Desk Set",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU5MjA5OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Work & Productivity",
    description: "Complete desk organization set featuring premium materials and thoughtful design.",
    features: ["Premium materials", "Wireless charging pad", "Cable management", "Non-slip base"],
    inStock: true,
    colors: ["Walnut", "Oak", "Black"],
    brand: "WorkSpace Pro"
  },
  {
    id: 7,
    name: "Modern Desk Accessories",
    price: 79.99,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1722506724411-9d3ea21702c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwYWNjZXNzb3JpZXMlMjBtb2Rlcm58ZW58MXx8fHwxNzU5MjE0ODMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Work & Productivity",
    description: "Sleek desk accessories set designed to enhance productivity and maintain clean workspace.",
    features: ["Modular design", "High-quality materials", "Multiple compartments", "Stackable"],
    inStock: true,
    isBestSeller: true,
    colors: ["Silver", "Black", "Rose Gold"],
    brand: "DeskCraft"
  },

  // Wellness & Self-Care
  {
    id: 8,
    name: "Wellness Essential Kit",
    price: 94.99,
    rating: 5.0,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1596773544141-798fc586f31e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NTkxNjk5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Wellness & Self-Care",
    description: "Complete wellness kit featuring natural products for daily self-care rituals.",
    features: ["Natural ingredients", "Complete kit", "Travel-friendly", "Sustainable packaging"],
    inStock: true,
    isNew: true,
    brand: "Pure Wellness"
  },
  {
    id: 9,
    name: "Luxury Bath Set",
    price: 119.99,
    originalPrice: 149.99,
    rating: 4.8,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1610551745215-1a4b5f36de8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1OTIxNDgzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Wellness & Self-Care",
    description: "Luxurious bath essentials set for the ultimate relaxation experience.",
    features: ["Organic ingredients", "Gift box included", "Long-lasting", "Aromatherapy blend"],
    inStock: true,
    isBestSeller: true,
    colors: ["Lavender", "Eucalyptus", "Vanilla"],
    brand: "Luxe Bath"
  },
  {
    id: 10,
    name: "Bathroom Organizer Set",
    price: 56.99,
    rating: 4.5,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1745894118353-88e64617e064?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMGFjY2Vzc29yaWVzJTIwbWluaW1hbHxlbnwxfHx8fDE3NTkyMTQ4MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Wellness & Self-Care",
    description: "Elegant bathroom organization set with multiple compartments for all your essentials.",
    features: ["Water-resistant", "Multiple sizes", "Easy install", "Modern design"],
    inStock: true,
    colors: ["White", "Bamboo", "Grey"],
    brand: "BathCraft"
  },

  // Garden & Outdoor
  {
    id: 11,
    name: "Plant Care Essentials",
    price: 42.99,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1636039479790-be1d880e2b8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBwbGFudCUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc1OTIxNDgzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Garden & Outdoor",
    description: "Complete plant care kit with all essential tools for healthy, thriving plants.",
    features: ["Complete tool set", "Beginner friendly", "Durable materials", "Storage case"],
    inStock: true,
    isNew: true,
    colors: ["Green", "Terracotta"],
    brand: "GreenThumb"
  },
  {
    id: 12,
    name: "Ceramic Planters Set",
    price: 68.99,
    originalPrice: 89.99,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaWZlc3R5bGUlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NTkxMDI2ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Garden & Outdoor",
    description: "Set of beautiful ceramic planters perfect for indoor and outdoor plants.",
    features: ["Drainage holes", "Set of 3", "Weather resistant", "Modern design"],
    inStock: true,
    colors: ["White", "Sage", "Charcoal"],
    brand: "PlantCraft"
  }
];

export const categories = [
  "All Products",
  "Home & Living", 
  "Kitchen Essentials",
  "Work & Productivity",
  "Wellness & Self-Care",
  "Garden & Outdoor"
];

export const brands = [
  "All Brands",
  ...Array.from(new Set(products.map(p => p.brand))).sort()
];

export const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $150", min: 100, max: 150 },
  { label: "Over $150", min: 150, max: Infinity }
];
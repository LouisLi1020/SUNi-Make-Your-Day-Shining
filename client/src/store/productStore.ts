import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  status: 'active' | 'inactive';
  features?: string[];
  specifications?: Record<string, string>;
  badge?: string;
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  categories: string[];
  selectedCategory: string;
  searchTerm: string;
  sortBy: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProducts: (products: Product[]) => void;
  setFeaturedProducts: (products: Product[]) => void;
  setCategories: (categories: string[]) => void;
  setSelectedCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getProductById: (id: string) => Product | undefined;
  getFilteredProducts: () => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  selectedCategory: 'all',
  searchTerm: '',
  sortBy: 'featured',
  isLoading: false,
  error: null,

  setProducts: (products: Product[]) => {
    set({ products });
  },

  setFeaturedProducts: (featuredProducts: Product[]) => {
    set({ featuredProducts });
  },

  setCategories: (categories: string[]) => {
    set({ categories });
  },

  setSelectedCategory: (selectedCategory: string) => {
    set({ selectedCategory });
  },

  setSearchTerm: (searchTerm: string) => {
    set({ searchTerm });
  },

  setSortBy: (sortBy: string) => {
    set({ sortBy });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  getProductById: (id: string) => {
    const { products } = get();
    return products.find(product => product.id === id);
  },

  getFilteredProducts: () => {
    const { products, selectedCategory, searchTerm, sortBy } = get();
    
    let filtered = products;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming products have a createdAt field
        filtered = filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default: // 'featured'
        filtered = filtered.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    }
    
    return filtered;
  }
}));

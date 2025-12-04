const API_BASE_URL = 'http://localhost:5000/api';

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  category: string;
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  display?: string;
  battery?: string;
  os?: string;
  weight?: string;
  color?: string;
  description?: string;
  highlights?: string[];
  specs?: Record<string, string>;
  inStock?: boolean;
  stock?: number;
}

// Fetch all products
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return mock data as fallback
    return getMockProducts();
  }
}

// Fetch single product by ID
export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    // Return mock data as fallback
    return getMockProducts().find(p => p.id === id) || null;
  }
}

// Fetch products by category
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products?category=${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    // Return filtered mock data as fallback
    return getMockProducts().filter(p => p.category === category);
  }
}

// Mock data as fallback
function getMockProducts(): Product[] {
  return [
    {
      id: 1,
      name: 'Laptop ASUS ROG Strix G16',
      brand: 'ASUS',
      price: 42990000,
      originalPrice: 52990000,
      rating: 4.9,
      reviews: 167,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      images: [
        'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1646153114001-495dfb56506d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjB0ZWNofGVufDF8fHx8MTc2Mzk3Mjg5NHww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwYyUyMHNldHVwfGVufDF8fHx8MTc2NDAzMzMwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      category: 'laptop',
      cpu: 'Intel Core i7-13650HX',
      gpu: 'NVIDIA GeForce RTX 4070 8GB',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      display: '16" QHD+ 240Hz',
      inStock: true,
      stock: 45,
    },
    {
      id: 2,
      name: 'Laptop MSI Katana 15',
      brand: 'MSI',
      price: 32990000,
      rating: 4.6,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'laptop',
      cpu: 'Intel Core i5',
      ram: '16GB',
      storage: '512GB SSD',
      color: 'Đen',
      inStock: true,
      stock: 30,
    },
    {
      id: 3,
      name: 'Laptop Dell XPS 15',
      brand: 'Dell',
      price: 48990000,
      rating: 4.9,
      reviews: 134,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'laptop',
      cpu: 'Intel Core i9',
      ram: '32GB',
      storage: '1TB SSD',
      color: 'Bạc',
      inStock: true,
      stock: 20,
    },
    {
      id: 4,
      name: 'Màn Hình LG UltraWide 34"',
      brand: 'LG',
      price: 15990000,
      rating: 4.8,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1551459601-c42a28ef7506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYXdpZGUlMjBtb25pdG9yfGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'monitor',
      color: 'Đen',
      inStock: true,
      stock: 25,
    },
    {
      id: 5,
      name: 'Màn Hình Samsung Odyssey',
      brand: 'Samsung',
      price: 18990000,
      rating: 4.7,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1551459601-c42a28ef7506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYXdpZGUlMjBtb25pdG9yfGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'monitor',
      color: 'Đen',
      inStock: true,
      stock: 15,
    },
    {
      id: 6,
      name: 'PC Gaming Custom RGB',
      brand: 'ASUS',
      price: 55990000,
      rating: 5.0,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwYyUyMHNldHVwfGVufDF8fHx8MTc2NDAzMzMwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'pc',
      cpu: 'AMD Ryzen 9',
      ram: '32GB',
      storage: '2TB SSD',
      color: 'Đen',
      inStock: true,
      stock: 8,
    },
    {
      id: 7,
      name: 'Bàn Phím Keychron K8 Pro',
      brand: 'Keychron',
      price: 3290000,
      rating: 4.7,
      reviews: 445,
      image: 'https://images.unsplash.com/photo-1602025882379-e01cf08baa51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmR8ZW58MXx8fHwxNzYzOTQ3ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'accessories',
      color: 'Trắng',
      inStock: true,
      stock: 50,
    },
    {
      id: 8,
      name: 'Chuột Logitech G Pro X',
      brand: 'Logitech',
      price: 1790000,
      rating: 4.8,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMG1vdXNlfGVufDF8fHx8MTc2Mzk2NDI5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'accessories',
      color: 'Đen',
      inStock: true,
      stock: 60,
    },
  ];
}

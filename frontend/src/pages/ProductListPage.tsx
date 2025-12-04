import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductGrid } from '../components/ProductGrid';
import { SlimHeroCarousel } from '../components/SlimHeroCarousel';
import { fetchProducts, fetchProductsByCategory } from '../services/api';
import type { Product } from '../services/api';

export function ProductListPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brands: [] as string[],
    priceRange: [0, 100000000] as [number, number],
    cpu: [] as string[],
    ram: [] as string[],
    storage: [] as string[],
    colors: [] as string[],
  });

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = category === 'all' 
        ? await fetchProducts()
        : await fetchProductsByCategory(category);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="pt-20">
        <SlimHeroCarousel category={category} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange}
              category={category}
            />
            
            <ProductGrid 
              products={products}
              filters={filters}
              loading={loading}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

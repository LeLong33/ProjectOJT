import { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FilterSidebar } from './FilterSidebar';
import { ProductGrid } from './ProductGrid';
import { SlimHeroCarousel } from './SlimHeroCarousel';

interface ProductListPageProps {
  onNavigate: (page: string, productId?: number) => void;
  cartCount: number;
  onAddToCart: () => void;
  category?: string;
}

export function ProductListPage({ onNavigate, cartCount, onAddToCart, category = 'all' }: ProductListPageProps) {
  const [filters, setFilters] = useState({
    brands: [] as string[],
    priceRange: [0, 100000000] as [number, number],
    cpu: [] as string[],
    ram: [] as string[],
    storage: [] as string[],
    colors: [] as string[],
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleNavigateToCart = () => {
    onNavigate('cart');
  };

  const handleNavigateToAccount = () => {
    onNavigate('account');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar 
        cartCount={cartCount} 
        onNavigateToCart={handleNavigateToCart}
        onNavigateToAccount={handleNavigateToAccount}
      />
      
      <main className="pt-20">
        <SlimHeroCarousel category={category} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar Filter */}
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange}
              category={category}
            />
            
            {/* Product Grid */}
            <ProductGrid 
              filters={filters}
              onNavigate={onNavigate}
              onAddToCart={onAddToCart}
              category={category}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
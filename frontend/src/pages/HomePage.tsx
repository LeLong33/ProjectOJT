import { useState } from 'react';
import { Navbar } from '@/pages/Navbar';
import { HeroCarousel } from '@/pages/HeroCarousel';
import { CategoryGrid } from '@/pages/CategoryGrid';
import { FlashSale } from '@/pages/FlashSale';
import { ProductShowcase } from '@/pages/ProductShowcase';
import { Footer } from '@/pages/Footer';

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar cartCount={cartCount} />
      
      <main className="pt-20">
        <HeroCarousel />
        <CategoryGrid />
        <FlashSale onAddToCart={handleAddToCart} />
        <ProductShowcase onAddToCart={handleAddToCart} />
      </main>
      
      <Footer />
    </div>
  );
}
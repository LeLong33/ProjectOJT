import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryGrid } from './components/CategoryGrid';
import { FlashSale } from './components/FlashSale';
import { ProductShowcase } from './components/ProductShowcase';
import { Footer } from './components/Footer';

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
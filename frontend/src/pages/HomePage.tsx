import { Navbar } from '../components/Navbar';
import { HeroCarousel } from '../components/HeroCarousel';
import { CategoryGrid } from '../components/CategoryGrid';
import { FlashSale } from '../components/FlashSale';
import { ProductShowcase } from '../components/ProductShowcase';
import { Footer } from '../components/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="pt-20">
        <HeroCarousel />
        <CategoryGrid />
        <FlashSale />
        <ProductShowcase />
      </main>
      
      <Footer />
    </div>
  );
}

import { Navbar } from './Navbar';
import { HeroCarousel } from './HeroCarousel';
import { CategoryGrid } from './CategoryGrid';
import { FlashSale } from './FlashSale';
import { ProductShowcase } from './ProductShowcase';
import { Footer } from './Footer';

interface HomePageProps {
  cartCount: number;
  onNavigateToCart: () => void;
  onNavigateToAccount: () => void;
  onNavigate: (page: string, productId?: number, category?: string) => void;
  onAddToCart: () => void;
}

export const HomePage = ({
  cartCount,
  onNavigateToCart,
  onNavigateToAccount,
  onNavigate,
  onAddToCart,
}: HomePageProps) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar 
        cartCount={cartCount} 
        onNavigateToCart={onNavigateToCart}
        onNavigateToAccount={onNavigateToAccount}
      />
      
      <main className="pt-20">
        <HeroCarousel />
        <CategoryGrid onNavigate={onNavigate} />
        <FlashSale onAddToCart={onAddToCart} />
        <ProductShowcase onAddToCart={onAddToCart} onNavigate={onNavigate} />
      </main>
      
      <Footer />
    </div>
  );
};
import { useState } from 'react';
import { HomePage } from './components/Home';
import { ProductListPage } from './components/ProductListPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { UserAccountPage } from './components/UserAccountPage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { DevNav } from './components/DevNav';

type Page = 'home' | 'list' | 'detail' | 'cart' | 'checkout' | 'order-confirmation' | 'account' | 'login' | 'admin';

export default function App() {
  const [cartCount, setCartCount] = useState(2);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDevNav, setShowDevNav] = useState(false);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const handleUpdateCart = (count: number) => {
    setCartCount(count);
  };

  const handleNavigate = (page: string, productId?: number, category?: string, loggedIn?: boolean) => {
    setCurrentPage(page as Page);
    if (productId !== undefined) setSelectedProductId(productId);
    if (category) setSelectedCategory(category);
    if (loggedIn !== undefined) setIsLoggedIn(loggedIn);
    window.scrollTo(0, 0);
  };

  const handleNavigateToCart = () => {
    handleNavigate('cart');
  };

  const handleNavigateToAccount = () => {
    if (isLoggedIn) {
      handleNavigate('account');
    } else {
      handleNavigate('login');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;

      case 'home':
        return (
          <HomePage 
            cartCount={cartCount}
            onNavigateToCart={handleNavigateToCart}
            onNavigateToAccount={handleNavigateToAccount}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        );

      case 'list':
        return (
          <ProductListPage 
            onNavigate={handleNavigate}
            cartCount={cartCount}
            onAddToCart={handleAddToCart}
            category={selectedCategory}
          />
        );

      case 'detail':
        return (
          <ProductDetailPage 
            productId={selectedProductId}
            onNavigate={handleNavigate}
            cartCount={cartCount}
            onAddToCart={handleAddToCart}
          />
        );

      case 'cart':
        return (
          <CartPage 
            onNavigate={handleNavigate}
            cartCount={cartCount}
            onUpdateCart={handleUpdateCart}
          />
        );

      case 'checkout':
        return (
          <CheckoutPage 
            onNavigate={handleNavigate}
            cartCount={cartCount}
            isLoggedIn={isLoggedIn}
          />
        );

      case 'order-confirmation':
        return (
          <OrderConfirmationPage 
            onNavigate={handleNavigate}
            cartCount={0}
          />
        );

      case 'account':
        return (
          <UserAccountPage 
            onNavigate={handleNavigate}
            cartCount={cartCount}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderPage()}
      {showDevNav && <DevNav currentPage={currentPage} onNavigate={handleNavigate} />}
    </>
  );
}
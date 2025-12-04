import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, ChevronDown, ChevronRight, Cpu, Monitor, Laptop, Headphones } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const categories = [
    { 
      icon: <Laptop className="w-5 h-5" />, 
      name: 'Laptop',
      brands: ['ASUS', 'MSI', 'Dell', 'HP', 'Lenovo', 'Acer', 'Apple'],
      categoryId: 'laptop'
    },
    { 
      icon: <Monitor className="w-5 h-5" />, 
      name: 'Màn Hình',
      brands: ['Samsung', 'LG', 'Dell', 'ASUS', 'ViewSonic', 'BenQ'],
      categoryId: 'monitor'
    },
    { 
      icon: <Cpu className="w-5 h-5" />, 
      name: 'PC & Linh Kiện',
      brands: ['Intel', 'AMD', 'NVIDIA', 'Corsair', 'G.Skill', 'Kingston'],
      categoryId: 'pc'
    },
    { 
      icon: <Headphones className="w-5 h-5" />, 
      name: 'Phụ Kiện',
      brands: ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX', 'Keychron'],
      categoryId: 'accessories'
    },
  ];

  // Hàm xử lý khi click vào nút danh mục
  const toggleCategories = () => {
    setShowCategories(!showCategories);
    if (showCategories) {
      setSelectedCategory(null);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl tracking-tight font-bold text-white">TechStore</span>
          </Link>

          <div className="relative ml-8">
            <button 
              onClick={toggleCategories}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showCategories ? 'bg-[#1a1a1a] text-white' : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <span className="text-lg font-medium">Danh Mục</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`} />
            </button>
            
            {showCategories && (
              <div className="absolute top-full left-0 mt-2 flex bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-2xl overflow-hidden z-50">
                {/* Categories List */}
                <div className="w-64 bg-[#1a1a1a]">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/products?category=${category.categoryId}`}
                      onMouseEnter={() => setSelectedCategory(index)}
                      className={`flex items-center justify-between gap-3 px-4 py-3 cursor-pointer transition-all ${
                        selectedCategory === index 
                          ? 'bg-[#007AFF]/10 border-l-4 border-l-[#007AFF]' 
                          : 'hover:bg-[#007AFF]/5 border-l-4 border-transparent'
                      }`}
                      onClick={() => setShowCategories(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`transition-colors ${
                          selectedCategory === index ? 'text-[#007AFF]' : 'text-gray-400'
                        }`}>
                          {category.icon}
                        </div>
                        <span className="text-white">{category.name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-colors ${
                        selectedCategory === index ? 'text-[#007AFF]' : 'text-gray-500'
                      }`} />
                    </Link>
                  ))}
                </div>
                
                {/* Brands List - Side Panel */}
                {selectedCategory !== null && (
                  <div className="w-56 bg-[#141414] border-l border-gray-800 p-4 animate-in fade-in slide-in-from-left-2 duration-200">
                    <div className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Thương Hiệu</div>
                    <div className="space-y-1">
                      {categories[selectedCategory].brands.map((brand, idx) => (
                        <Link
                          key={idx}
                          to={`/products?category=${categories[selectedCategory].categoryId}&brand=${brand}`}
                          onClick={() => setShowCategories(false)}
                          className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-[#007AFF]/10 rounded transition-colors"
                        >
                          {brand}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#007AFF] transition-colors" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] transition-all"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/account')}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
              title="Tài khoản"
            >
              <User className="w-6 h-6" />
            </button>
            
            <button 
              onClick={() => navigate('/cart')}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"
              title="Giỏ hàng"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#007AFF] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay để đóng menu khi click ra ngoài (Optional UX improvement) */}
      {showCategories && (
        <div 
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setShowCategories(false)}
        />
      )}
    </nav>
  );
}
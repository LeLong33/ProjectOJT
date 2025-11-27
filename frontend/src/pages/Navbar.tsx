import { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, ChevronRight, Cpu, Laptop, Monitor, PcCase, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom'; // Sử dụng react-router-dom chuẩn
import { useAuth } from '@/context/AuthContext'; // Import hook xác thực

interface NavbarProps {
  cartCount?: number; // Để optional để tránh lỗi nếu không truyền
}

export function Navbar({ cartCount = 0 }: NavbarProps) {
  const { isAuthenticated } = useAuth(); // Lấy trạng thái đăng nhập
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const categories = [
    {
      icon: <Laptop className="w-5 h-5" />,
      name: 'Laptop',
      brands: ['ASUS', 'MSI', 'Dell', 'HP', 'Lenovo', 'Acer', 'Apple']
    },
    {
      icon: <Monitor className="w-5 h-5" />,
      name: 'Màn Hình',
      brands: ['Samsung', 'LG', 'Dell', 'ASUS', 'ViewSonic', 'BenQ']
    },
    {
      icon: <PcCase className="w-5 h-5" />,
      name: 'PC & Linh Kiện',
      brands: ['Intel', 'Predator', 'NVIDIA', 'Corsair', 'MSI']
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      name: 'Phụ Kiện',
      brands: ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX', 'Keychron']
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-800 text-white font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Dùng Link thay vì thẻ a để không reload trang */}
          <Link to="/" className="flex items-center gap-2 flex-none cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-[#007AFF]">TechStore</span>
          </Link>

          {/* Categories Dropdown */}
          <div className="flex-none hidden md:flex justify-center">
            <div
              className="relative pb-4"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => {
                setShowCategories(false);
                setSelectedCategory(null);
              }}
            >
              <button className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white transition-colors bg-[#1a1a1a] rounded-lg hover:bg-gray-800 mt-4"> {/* Added mt-4 to align visually if needed due to pb-4 */}
                <span className="text-base font-medium">Danh Mục Sản Phẩm</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showCategories && (
                <div className="absolute top-full left-0 mt-1 flex bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl overflow-hidden min-w-[500px]">
                  {/* Categories List */}
                  <div className="w-64 py-2">
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        onMouseEnter={() => setSelectedCategory(index)}
                        className={`flex items-center justify-between gap-3 px-4 py-2 cursor-pointer transition-all mx-2 rounded-lg ${selectedCategory === index
                            ? 'bg-[#007AFF]/20 text-[#007AFF]'
                            : 'hover:bg-[#007AFF]/5 text-gray-300'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`transition-colors ${selectedCategory === index ? 'text-[#007AFF]' : 'text-gray-400'
                            }`}>
                            {category.icon}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-colors ${selectedCategory === index ? 'text-[#007AFF]' : 'text-gray-500'
                          }`} />
                      </div>
                    ))}
                  </div>

                  {/* Brands List */}
                  {selectedCategory !== null && (
                    <div className="w-56 bg-[#141414] border-l border-gray-800 p-4 transition-all duration-300">
                      <div className="text-sm font-semibold text-[#007AFF] mb-3 border-b border-gray-700 pb-2">Thương Hiệu Phổ Biến</div>
                      <div className="space-y-1">
                        {categories[selectedCategory].brands.map((brand, idx) => (
                          <Link
                            key={idx}
                            to={`/brand/${brand.toLowerCase()}`}
                            className="block px-3 py-1.5 text-gray-400 text-sm hover:text-white hover:bg-[#007AFF]/10 rounded transition-colors"
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
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-12">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu hoặc mã..."
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-[#007AFF] transition-all duration-200 shadow-inner"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 flex-none">
            {/* LOGIC QUAN TRỌNG: Điều hướng dựa trên trạng thái đăng nhập */}
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className={`p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${
                isAuthenticated 
                  ? "bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20" 
                  : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
              }`}
              title={isAuthenticated ? "Trang cá nhân" : "Đăng nhập"}
            >
              <User className="w-6 h-6" />
            </Link>

            <Link 
              to="/cart" 
              className="relative p-3 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-all shadow-md block"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#007AFF] text-white text-xs font-semibold rounded-full flex items-center justify-center ring-2 ring-[#0a0a0a]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
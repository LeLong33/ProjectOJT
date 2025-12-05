import { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, ChevronRight, Cpu, Laptop, Monitor, PcCase, Headphones, LogOut, Info, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '@/context/AuthContext'; 

interface NavbarProps {
  cartCount: number;
}

export function Navbar({ cartCount }: NavbarProps) {
  const { isAuthenticated, logout } = useAuth(); 
  const navigate = useNavigate(); 
  
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false); 

  // Logic Đăng xuất ĐÃ SỬA
  const handleLogout = () => {
    logout(); // Xóa token
    setShowUserDropdown(false); // Đóng dropdown
    navigate('/'); // ⬅️ CHUYỂN HƯỚNG VỀ TRANG CHỦ
  };

  const categories = [ /* Giữ nguyên Categories data */
    { icon: <Laptop className="w-5 h-5" />, name: 'Laptop', brands: ['ASUS', 'MSI', 'Dell', 'HP', 'Lenovo', 'Acer', 'Apple'] },
    { icon: <Monitor className="w-5 h-5" />, name: 'Màn Hình', brands: ['Samsung', 'LG', 'Dell', 'ASUS', 'ViewSonic', 'BenQ'] },
    { icon: <PcCase className="w-5 h-5" />, name: 'PC & Linh Kiện', brands: ['Intel', 'Predator', 'NVIDIA', 'Corsair', 'MSI'] },
    { icon: <Headphones className="w-5 h-5" />, name: 'Phụ Kiện', brands: ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX', 'Keychron'] },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-800 text-white font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-none cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-[#007AFF]">TechStore</span>
          </Link>

          {/* Categories Dropdown & Search Bar (Giữ nguyên) */}
          {/* ... (Code Categories Dropdown và Search Bar ở đây) ... */}
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
              <button className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white transition-colors bg-[#1a1a1a] rounded-lg hover:bg-gray-800 mt-4">
                <span className="text-base font-medium">Danh Mục Sản Phẩm</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showCategories && (
                 <div className="absolute top-full left-0 mt-1 flex bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl overflow-hidden min-w-[500px]">
                    {/* ... Categories List & Brands List ... */}
                     <div className="w-64 py-2">
                        {categories.map((category, index) => (
                           <div key={index} onMouseEnter={() => setSelectedCategory(index)} className={`flex items-center justify-between gap-3 px-4 py-2 cursor-pointer transition-all mx-2 rounded-lg ${selectedCategory === index ? 'bg-[#007AFF]/20 text-[#007AFF]' : 'hover:bg-[#007AFF]/5 text-gray-300'}`}>
                              <div className="flex items-center gap-3"><div className={`transition-colors ${selectedCategory === index ? 'text-[#007AFF]' : 'text-gray-400'}`}>{category.icon}</div><span className="font-medium">{category.name}</span></div>
                              <ChevronRight className={`w-4 h-4 transition-colors ${selectedCategory === index ? 'text-[#007AFF]' : 'text-gray-500'}`} />
                           </div>
                        ))}
                     </div>
                     {selectedCategory !== null && (
                         <div className="w-56 bg-[#141414] border-l border-gray-800 p-4 transition-all duration-300">
                             <div className="text-sm font-semibold text-[#007AFF] mb-3 border-b border-gray-700 pb-2">Thương Hiệu Phổ Biến</div>
                             <div className="space-y-1">
                                 {categories[selectedCategory].brands.map((brand, idx) => (
                                     <Link key={idx} to={`/brand/${brand.toLowerCase()}`} className="block px-3 py-1.5 text-gray-400 text-sm hover:text-white hover:bg-[#007AFF]/10 rounded transition-colors">
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
          <div className="flex items-center gap-2 flex-none relative">
            
            {isAuthenticated ? (
                // --- ĐÃ ĐĂNG NHẬP: Dropdown ---
                <div 
                    className="relative" 
                    onBlur={() => setTimeout(() => setShowUserDropdown(false), 150)}
                    onFocus={() => setShowUserDropdown(true)}
                >
                    <button
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        className={`p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${
                          showUserDropdown 
                            ? "bg-[#007AFF]/20 text-[#007AFF]" 
                            : "bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20"
                        }`}
                        title="Tài khoản"
                    >
                        <User className="w-6 h-6" />
                    </button>
                    
                    {/* DROPDOWN MENU */}
                    {showUserDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl py-2 z-50">
                            
                            {/* Dòng 1: Thông tin tài khoản -> /profile */}
                            <Link
                                to="/profile"
                                onClick={() => setShowUserDropdown(false)}
                                className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#007AFF]/10 hover:hover:text-white transition-colors text-sm"
                            >
                                <UserCircle className="w-4 h-4" /> 
                                <span>Thông tin tài khoản</span>
                            </Link>

                            {/* Dòng 2: Đăng xuất */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm border-t border-gray-800 mt-1 pt-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                // --- CHƯA ĐĂNG NHẬP: Link trực tiếp ---
                <Link
                    to="/login"
                    className="p-3 rounded-xl transition-all shadow-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                    title="Đăng nhập"
                >
                    <User className="w-6 h-6" />
                </Link>
            )}

            {/* Giỏ hàng */}
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

import { useState, useEffect, useRef } from 'react';
import { Search, User, ShoppingCart, ChevronDown, ChevronRight, Cpu, Laptop, Monitor, PcCase, Headphones, LogOut, Info, UserCircle } from 'lucide-react';
import axios from 'axios';
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
  const [categories, setCategories] = useState<Array<{ category_id: number; name: string; parent_id: number | null;}>>([]);
  const [brands, setBrands] = useState<Array<{ brand_id: number; name: string;}>>([]);
  const [brandsCache, setBrandsCache] = useState<Record<number, Array<{ brand_id: number; name: string;}>>>({});
  const [brandsLoading, setBrandsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Search suggestion state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ product_id: number; name: string; price?: number; image_url?: string }>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchDebounce = useRef<number | null>(null);

  function toggleCategories() {
    setShowCategories((s) => !s);
  }

  function getCategoryIcon(name: string) {
    const n = name.toLowerCase();
    if (n.includes('lap') || n.includes('notebook')) return <Laptop className="w-5 h-5" />;
    if (n.includes('màn') || n.includes('screen') || n.includes('monitor')) return <Monitor className="w-5 h-5" />;
    if (n.includes('pc') || n.includes('linh') || n.includes('phụ')) return <PcCase className="w-5 h-5" />;
    if (n.includes('phụ') || n.includes('tai') || n.includes('head')) return <Headphones className="w-5 h-5" />;
    return <Cpu className="w-5 h-5" />;
  }

  function slugify(s: string) {
    // Remove accents from Vietnamese characters
    const map: Record<string, string> = {
      'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
      'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
      'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
      'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
      'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
      'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
      'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
      'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
      'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
      'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
      'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
      'đ': 'd',
    }
    let str = String(s || '').toLowerCase().trim()
    for (const [k, v] of Object.entries(map)) {
      str = str.replace(new RegExp(k, 'g'), v)
    }
    return str.replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
  }

  useEffect(() => {
    // Fetch categories from backend (brands are loaded per-category on hover)
    const fetchCategories = async () => {
      try {
        const catRes = await axios.get(`${API_URL}/categories`);
        setCategories(catRes.data?.data || []);
      } catch (err) {
        console.error('Error loading categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Load brands for a specific main category (called on hover)
  async function loadBrandsForCategory(categoryId: number | undefined) {
    if (!categoryId) {
      setBrands([]);
      return;
    }

    // return cached brands if present
    if (brandsCache[categoryId]) {
      setBrands(brandsCache[categoryId]);
      return;
    }

    try {
      setBrandsLoading(true);
      const res = await axios.get(`${API_URL}/brands`, { params: { category_id: categoryId } });
      const data = res.data?.data || [];
      setBrands(data);
      setBrandsCache(prev => ({ ...prev, [categoryId]: data }));
    } catch (err) {
      console.error('Error loading brands for category', err);
      setBrands([]);
    } finally {
      setBrandsLoading(false);
    }
  }

  function handleHoverMain(index: number, categoryId: number) {
    setSelectedCategory(index);
    loadBrandsForCategory(categoryId);
  }

  // Search: debounced fetch suggestions
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setSearchLoading(false);
      return;
    }

    if (searchDebounce.current) window.clearTimeout(searchDebounce.current);
    searchDebounce.current = window.setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await axios.get(`${API_URL}/products`, { params: { q: searchQuery, limit: 6 } });
        setSuggestions(res.data?.data || []);
      } catch (err) {
        console.error('Search suggestion error', err);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => {
      if (searchDebounce.current) window.clearTimeout(searchDebounce.current);
    };
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Determine four main categories (Laptop, PC, Màn hình, Phụ kiện)
  const mainCategories = (() => {
    if (!categories || categories.length === 0) return [] as typeof categories;
    // Get all top-level categories (parent_id === null)
    const topLevel = categories.filter(c => c.parent_id === null);
    return topLevel;
  })();

  // When dropdown opens, ensure we have a selected main category and load its brands
  useEffect(() => {
    if (showCategories && mainCategories.length > 0) {
      const idx = selectedCategory ?? 0;
      setSelectedCategory(idx);
      const catId = mainCategories[idx]?.category_id;
      if (catId) loadBrandsForCategory(catId);
    }
  }, [showCategories, mainCategories]);

  // Logic Đăng xuất ĐÃ SỬA
  const handleLogout = () => {
    logout(); // Xóa token
    setShowUserDropdown(false); // Đóng dropdown
    navigate('/'); // ⬅️ CHUYỂN HƯỚNG VỀ TRANG CHỦ
  };

  // categories state loaded from backend

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
                {/* Left: main categories */}
                <div className="w-64 bg-[#1a1a1a]">
                  {mainCategories.map((category, index) => (
                    <Link
                      key={category.category_id}
                      to={`/products?category=${encodeURIComponent(slugify(category.name))}`}
                      onMouseEnter={() => handleHoverMain(index, category.category_id)}
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
                          {getCategoryIcon(category.name)}
                        </div>
                        <span className="text-white">{category.name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-colors ${
                        selectedCategory === index ? 'text-[#007AFF]' : 'text-gray-500'
                      }`} />
                    </Link>
                  ))}
                </div>

                {/* Middle: subcategories for hovered main category */}
                <div className="w-56 bg-[#141414] border-l border-gray-800 p-4 animate-in fade-in slide-in-from-left-2 duration-200">
                  <div className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Danh Mục Con</div>
                  <div className="space-y-1 mb-3">
                    {selectedCategory !== null ? (
                      (() => {
                        const parentId = mainCategories[selectedCategory]?.category_id;
                        const subs = categories.filter(c => c.parent_id === parentId);
                        if (subs.length === 0) return <div className="text-sm text-gray-500">Không có danh mục con</div>;
                        return subs.map(sc => (
                          <Link
                            key={sc.category_id}
                            to={`/products?category=${parentId}&subcategory=${sc.category_id}`}
                            onClick={() => setShowCategories(false)}
                            className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-[#007AFF]/10 rounded transition-colors"
                          >
                            {sc.name}
                          </Link>
                        ));
                      })()
                    ) : (
                      <div className="text-sm text-gray-500">Di chuột vào danh mục để xem chi tiết</div>
                    )}
                  </div>
                </div>

                {/* Right: brands list */}
                <div className="w-56 bg-[#141414] border-l border-gray-800 p-4 animate-in fade-in slide-in-from-left-2 duration-200">
                  <div className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Thương Hiệu</div>
                  <div className="space-y-1">
                    {brandsLoading ? (
                      <div className="text-sm text-gray-400">Đang tải thương hiệu...</div>
                    ) : brands.length > 0 ? (
                      brands.map((brandItem) => (
                        <Link
                          key={brandItem.brand_id}
                          to={`/products?category=${mainCategories[selectedCategory ?? 0]?.category_id}&brand=${encodeURIComponent(brandItem.name)}`}
                          onClick={() => setShowCategories(false)}
                          className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-[#007AFF]/10 rounded transition-colors"
                        >
                          {brandItem.name}
                        </Link>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">Không có thương hiệu</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-12">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <div ref={searchRef} className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, thương hiệu hoặc mã..."
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-[#007AFF] transition-all duration-200 shadow-inner"
                  onFocus={() => { if (searchQuery.trim().length >= 2 && suggestions.length === 0) {/* trigger search via effect */} }}
                />

                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-[#0b0b0b] border border-gray-800 rounded-lg shadow-xl z-50">
                    {suggestions.map(s => (
                      <Link
                        key={s.product_id}
                        to={`/product/${s.product_id}`}
                        onClick={() => setSuggestions([])}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-[#111111]"
                      >
                        <img src={s.image_url || 'https://via.placeholder.com/48'} alt={s.name} className="w-10 h-10 object-cover rounded" />
                        <div className="text-sm">
                          <div className="text-white">{s.name}</div>
                          {s.price != null && <div className="text-xs text-gray-400">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s.price)}</div>}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
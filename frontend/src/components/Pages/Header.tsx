import { Search, ShoppingCart, User, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3 border-b">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-blue-600">TechStore</span>
            </div>
            
            {/* Search bar */}
            <div className="hidden md:flex items-center flex-1 max-w-2xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                  className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-6">
            <button className="hidden md:flex items-center gap-2 hover:text-blue-600 transition">
              <User className="w-5 h-5" />
              <span>Tài khoản</span>
            </button>
            <button className="relative hover:text-blue-600 transition">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            <button className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 py-4">
          <a href="#" className="hover:text-blue-600 transition">Trang chủ</a>
          <a href="#" className="hover:text-blue-600 transition">Laptop</a>
          <a href="#" className="hover:text-blue-600 transition">PC - Màn hình</a>
          <a href="#" className="hover:text-blue-600 transition">Linh kiện</a>
          <a href="#" className="hover:text-blue-600 transition">Phụ kiện</a>
          <a href="#" className="hover:text-blue-600 transition">Gaming Gear</a>
          <a href="#" className="text-red-500 hover:text-red-600 transition">Khuyến mãi</a>
        </nav>
      </div>
    </header>
  );
}

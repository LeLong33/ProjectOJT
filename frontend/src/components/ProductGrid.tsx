import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useState } from 'react';

interface ProductGridProps {
  filters: any;
  onNavigate: (page: string, productId?: number) => void;
  onAddToCart: () => void;
  category: string;
}

export function ProductGrid({ filters, onNavigate, onAddToCart, category }: ProductGridProps) {
  const [sortBy, setSortBy] = useState('popular');

  const allProducts = [
    {
      id: 1,
      name: 'Laptop ASUS ROG Strix G16',
      brand: 'ASUS',
      price: 42990000,
      rating: 4.9,
      reviews: 167,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'laptop',
      cpu: 'Intel Core i7',
      ram: '16GB',
      storage: '1TB SSD',
      color: 'Đen',
    },
    {
      id: 2,
      name: 'Laptop MSI Katana 15',
      brand: 'MSI',
      price: 32990000,
      rating: 4.6,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'laptop',
      cpu: 'Intel Core i5',
      ram: '16GB',
      storage: '512GB SSD',
      color: 'Đen',
    },
    {
      id: 3,
      name: 'Laptop Dell XPS 15',
      brand: 'Dell',
      price: 48990000,
      rating: 4.9,
      reviews: 134,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'laptop',
      cpu: 'Intel Core i9',
      ram: '32GB',
      storage: '1TB SSD',
      color: 'Bạc',
    },
    {
      id: 4,
      name: 'Màn Hình LG UltraWide 34"',
      brand: 'LG',
      price: 15990000,
      rating: 4.8,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1551459601-c42a28ef7506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYXdpZGUlMjBtb25pdG9yfGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'monitor',
      cpu: '',
      ram: '',
      storage: '',
      color: 'Đen',
    },
    {
      id: 5,
      name: 'Màn Hình Samsung Odyssey',
      brand: 'Samsung',
      price: 18990000,
      rating: 4.7,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1551459601-c42a28ef7506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYXdpZGUlMjBtb25pdG9yfGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'monitor',
      cpu: '',
      ram: '',
      storage: '',
      color: 'Đen',
    },
    {
      id: 6,
      name: 'PC Gaming Custom RGB',
      brand: 'ASUS',
      price: 55990000,
      rating: 5.0,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwYyUyMHNldHVwfGVufDF8fHx8MTc2NDAzMzMwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'pc',
      cpu: 'AMD Ryzen 9',
      ram: '32GB',
      storage: '2TB SSD',
      color: 'Đen',
    },
    {
      id: 7,
      name: 'Bàn Phím Keychron K8 Pro',
      brand: 'ASUS',
      price: 3290000,
      rating: 4.7,
      reviews: 445,
      image: 'https://images.unsplash.com/photo-1602025882379-e01cf08baa51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmR8ZW58MXx8fHwxNzYzOTQ3ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'accessories',
      cpu: '',
      ram: '',
      storage: '',
      color: 'Trắng',
    },
    {
      id: 8,
      name: 'Chuột Logitech G Pro X',
      brand: 'ASUS',
      price: 1790000,
      rating: 4.8,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMG1vdXNlfGVufDF8fHx8MTc2Mzk2NDI5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'accessories',
      cpu: '',
      ram: '',
      storage: '',
      color: 'Đen',
    },
  ];

  // Filter products
  let filteredProducts = allProducts.filter(product => {
    if (category !== 'all' && product.category !== category) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
    if (filters.cpu.length > 0 && product.cpu && !filters.cpu.includes(product.cpu)) return false;
    if (filters.ram.length > 0 && product.ram && !filters.ram.includes(product.ram)) return false;
    if (filters.storage.length > 0 && product.storage && !filters.storage.includes(product.storage)) return false;
    if (filters.colors.length > 0 && !filters.colors.includes(product.color)) return false;
    return true;
  });

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="flex-1">
      {/* Header & Sort */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl mb-1">Sản Phẩm</h1>
          <p className="text-sm text-gray-400">
            Tìm thấy {filteredProducts.length} sản phẩm
          </p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#007AFF]"
        >
          <option value="popular">Phổ biến</option>
          <option value="price-asc">Giá thấp đến cao</option>
          <option value="price-desc">Giá cao đến thấp</option>
          <option value="rating">Đánh giá cao nhất</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden hover:border-[#007AFF] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,122,255,0.2)]"
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Product Info */}
            <div className="p-5">
              <div className="text-xs text-[#007AFF] mb-2">{product.brand}</div>
              <h3 className="mb-3 group-hover:text-[#007AFF] transition-colors line-clamp-2 min-h-[3rem]">
                {product.name}
              </h3>

              {/* Specs */}
              {product.cpu && (
                <div className="text-sm text-gray-400 mb-3 space-y-1">
                  <div>CPU: {product.cpu}</div>
                  <div>RAM: {product.ram}</div>
                  <div>SSD: {product.storage}</div>
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {product.rating} ({product.reviews})
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl text-[#007AFF]">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onNavigate('detail', product.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#0a0a0a] border border-gray-800 hover:border-[#007AFF] py-3 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  Chi tiết
                </button>
                <button
                  onClick={onAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#007AFF] hover:bg-[#0051D5] py-3 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Giỏ hàng
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-[#007AFF] transition-colors">
            Trước
          </button>
          <button className="px-4 py-2 bg-[#007AFF] rounded-lg">1</button>
          <button className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-[#007AFF] transition-colors">
            2
          </button>
          <button className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-[#007AFF] transition-colors">
            3
          </button>
          <button className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-[#007AFF] transition-colors">
            Sau
          </button>
        </div>
      )}

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-400 mb-2">Không tìm thấy sản phẩm</p>
          <p className="text-sm text-gray-500">Vui lòng thử thay đổi bộ lọc</p>
        </div>
      )}
    </div>
  );
}

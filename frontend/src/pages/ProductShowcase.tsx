import { ShoppingCart, Star } from 'lucide-react';

interface ProductShowcaseProps {
  onAddToCart: () => void;
}

export function ProductShowcase({ onAddToCart }: ProductShowcaseProps) {
  const products = [
    {
      id: 1,
      name: 'Laptop ASUS ROG Strix G16',
      price: 42990000,
      rating: 4.9,
      reviews: 167,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Laptop',
    },
    {
      id: 2,
      name: 'Màn Hình LG UltraWide 34"',
      price: 15990000,
      rating: 4.8,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1551459601-c42a28ef7506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYXdpZGUlMjBtb25pdG9yfGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Màn Hình',
    },
    {
      id: 3,
      name: 'PC Gaming Custom RGB',
      price: 55990000,
      rating: 5.0,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwYyUyMHNldHVwfGVufDF8fHx8MTc2NDAzMzMwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'PC',
    },
    {
      id: 4,
      name: 'Bàn Phím Keychron K8 Pro',
      price: 3290000,
      rating: 4.7,
      reviews: 445,
      image: 'https://images.unsplash.com/photo-1602025882379-e01cf08baa51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmR8ZW58MXx8fHwxNzYzOTQ3ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Phụ Kiện',
    },
    {
      id: 5,
      name: 'Tai Nghe SteelSeries Arctis',
      price: 2590000,
      rating: 4.6,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1660391532247-4a8ad1060817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc2NDA0MTcyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Phụ Kiện',
    },
    {
      id: 6,
      name: 'Chuột Logitech G Pro X',
      price: 1790000,
      rating: 4.8,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMG1vdXNlfGVufDF8fHx8MTc2Mzk2NDI5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Phụ Kiện',
    },
    {
      id: 7,
      name: 'Laptop Dell XPS 15',
      price: 48990000,
      rating: 4.9,
      reviews: 134,
      image: 'https://tranphong.com.vn/images/pro/1_16942.jpg',
      category: 'Laptop',
    },
    {
      id: 8,
      name: 'Màn Hình Samsung Odyssey',
      price: 18990000,
      rating: 4.7,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1551459601-c42a28ef7506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYXdpZGUlMjBtb25pdG9yfGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Màn Hình',
    },
    {
      id: 9,
      name: 'Webcam Logitech C920',
      price: 2190000,
      rating: 4.5,
      reviews: 423,
      image: 'https://images.unsplash.com/photo-1763136469641-372e5cc4e883?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwYWNjZXNzb3JpZXMlMjBrZXlib2FyZHxlbnwxfHx8fDE3NjQwNDE3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Phụ Kiện',
    },
    {
      id: 10,
      name: 'SSD Samsung 990 Pro 2TB',
      price: 6490000,
      rating: 5.0,
      reviews: 256,
      image: 'https://haloshop.vn/wp-content/uploads/2025/02/ssd_samsung_990_pro_pcie_gen_4_0_x4_nvme_v_nand_m_2_2280_04.jpg',
      category: 'Linh Kiện',
    },
    {
      id: 11,
      name: 'RAM Corsair Vengeance 32GB',
      price: 3990000,
      rating: 4.8,
      reviews: 334,
      image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwYyUyMHNldHVwfGVufDF8fHx8MTc2NDAzMzMwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Linh Kiện',
    },
    {
      id: 12,
      name: 'Laptop MSI Katana 15',
      price: 32990000,
      rating: 4.6,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Laptop',
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-800">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl mb-4">Sản Phẩm Nổi Bật</h2>
        <p className="text-gray-400">Khám phá bộ sưu tập sản phẩm công nghệ hàng đầu</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#007AFF]/80 backdrop-blur-sm rounded-full text-sm">
                {product.category}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
              <h3 className="mb-3 group-hover:text-[#007AFF] transition-colors line-clamp-2 min-h-[3rem]">
                {product.name}
              </h3>

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

              {/* Add to Cart Button */}
              <button
                onClick={onAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-[#007AFF] hover:bg-[#0051D5] py-3 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 border border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white rounded-lg transition-colors">
          Xem Thêm Sản Phẩm
        </button>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Star, ShoppingCart, CreditCard, Truck, Shield, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductDetailPageProps {
  productId: number;
  onNavigate: (page: string, id?: number) => void;
  cartCount: number;
  onAddToCart: () => void;
}

export function ProductDetailPage({ productId, onNavigate, cartCount, onAddToCart }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  // Mock product data
  const product = {
    id: productId,
    name: 'Laptop ASUS ROG Strix G16 (2024)',
    brand: 'ASUS',
    price: 42990000,
    originalPrice: 52990000,
    rating: 4.9,
    reviews: 167,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1646153114001-495dfb56506d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjB0ZWNofGVufDF8fHx8MTc2Mzk3Mjg5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwYyUyMHNldHVwfGVufDF8fHx8MTc2NDAzMzMwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    specs: {
      cpu: 'Intel Core i7-13650HX (14 nhân, 20 luồng, tối đa 4.9GHz)',
      gpu: 'NVIDIA GeForce RTX 4070 8GB GDDR6',
      ram: '16GB DDR5-4800MHz (2x8GB, tối đa 32GB)',
      storage: '1TB PCIe 4.0 NVMe SSD',
      display: '16" QHD+ (2560x1600) 240Hz, 100% DCI-P3',
      battery: '90Wh, sạc nhanh 200W',
      os: 'Windows 11 Home',
      weight: '2.5kg',
      color: 'Eclipse Gray',
    },
    description: `
      ASUS ROG Strix G16 là laptop gaming cao cấp với hiệu năng mạnh mẽ từ Intel Core i7 thế hệ 13 và RTX 4070. 
      Màn hình QHD+ 240Hz mang đến trải nghiệm hình ảnh sắc nét và mượt mà. 
      Thiết kế tản nhiệt ROG Intelligent Cooling giúp máy luôn hoạt động ổn định ngay cả khi chơi game nặng.
      Bàn phím RGB Aura Sync tùy chỉnh đầy đủ, âm thanh Dolby Atmos sống động.
    `,
    highlights: [
      'Hiệu năng đỉnh cao với Intel Core i7 Gen 13',
      'RTX 4070 8GB - Ray Tracing & DLSS 3.0',
      'Màn hình 240Hz response time 3ms',
      'Tản nhiệt ROG Intelligent Cooling',
      'Bàn phím RGB Per-Key',
      'Wi-Fi 6E & Thunderbolt 4',
    ],
  };

  const reviews = [
    {
      id: 1,
      user: 'Nguyễn Văn A',
      rating: 5,
      date: '15/11/2024',
      comment: 'Laptop rất tuyệt vời, hiệu năng mạnh mẽ, chơi game rất mượt. Màn hình đẹp, màu sắc sống động.',
    },
    {
      id: 2,
      user: 'Trần Thị B',
      rating: 4,
      date: '10/11/2024',
      comment: 'Sản phẩm tốt, đúng như mô tả. Tuy nhiên hơi nặng một chút, nhưng đổi lại hiệu năng thì ok.',
    },
    {
      id: 3,
      user: 'Lê Văn C',
      rating: 5,
      date: '05/11/2024',
      comment: 'Máy chạy rất nhanh, đồ họa đẹp. Bàn phím gõ êm, RGB đẹp mắt. Rất hài lòng với mua hàng này.',
    },
  ];

  const relatedProducts = [
    {
      id: 2,
      name: 'Laptop MSI Katana 15',
      price: 32990000,
      rating: 4.6,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      name: 'Laptop Dell XPS 15',
      price: 48990000,
      rating: 4.9,
      reviews: 134,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 7,
      name: 'Laptop Acer Predator Helios',
      price: 38990000,
      rating: 4.7,
      reviews: 223,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 8,
      name: 'Laptop Lenovo Legion Pro',
      price: 45990000,
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar 
        cartCount={cartCount} 
        onNavigateToCart={() => onNavigate('cart')}
        onNavigateToAccount={() => onNavigate('account')}
      />
      
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => onNavigate('list')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#007AFF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách sản phẩm
          </button>
        </div>

        {/* Product Detail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Images */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-[#1a1a1a] rounded-2xl overflow-hidden mb-4 group">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-[#1a1a1a] rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-[#007AFF]' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <div className="text-sm text-[#007AFF] mb-2">{product.brand}</div>
              <h1 className="text-3xl mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400">
                    {product.rating} ({product.reviews} đánh giá)
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  product.inStock ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl text-[#007AFF]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
                <div className="inline-block px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-sm">
                  Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                </div>
              </div>

              {/* Key Specs */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 mb-6">
                <h3 className="text-lg mb-4">Thông Số Nổi Bật</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">CPU:</span>
                    <span className="text-right">{product.specs.cpu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">GPU:</span>
                    <span className="text-right">{product.specs.gpu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">RAM:</span>
                    <span>{product.specs.ram}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SSD:</span>
                    <span>{product.specs.storage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Màn hình:</span>
                    <span className="text-right">{product.specs.display}</span>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-400">Số lượng:</span>
                <div className="flex items-center border border-gray-800 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-[#1a1a1a] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-[#1a1a1a] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={onAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#007AFF] hover:bg-[#0051D5] py-4 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-4 rounded-lg transition-colors">
                  <CreditCard className="w-5 h-5" />
                  Mua ngay
                </button>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Truck className="w-5 h-5 text-[#007AFF]" />
                  <span>Miễn phí vận chuyển toàn quốc</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Shield className="w-5 h-5 text-[#007AFF]" />
                  <span>Bảo hành chính hãng 24 tháng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex gap-4 border-b border-gray-800 mb-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 transition-colors ${
                  activeTab === 'description'
                    ? 'text-[#007AFF] border-b-2 border-[#007AFF]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Mô tả
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-6 py-3 transition-colors ${
                  activeTab === 'specs'
                    ? 'text-[#007AFF] border-b-2 border-[#007AFF]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Thông số kỹ thuật
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-[#007AFF] border-b-2 border-[#007AFF]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Đánh giá ({product.reviews})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'description' && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl mb-4">Mô tả sản phẩm</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>
                <h4 className="text-lg mb-3">Điểm nổi bật:</h4>
                <ul className="space-y-2">
                  {product.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-400">
                      <span className="text-[#007AFF] mt-1">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl mb-6">Thông số kỹ thuật chi tiết</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <span className="text-sm text-gray-500 uppercase">{key}</span>
                      <span className="text-gray-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl mb-6">Đánh giá từ khách hàng</h3>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-800 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#007AFF] rounded-full flex items-center justify-center">
                            {review.user.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{review.user}</div>
                            <div className="text-sm text-gray-500">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-400">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h3 className="text-2xl mb-8">Sản phẩm tương tự</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  className="group bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden hover:border-[#007AFF] transition-all duration-300 cursor-pointer"
                  onClick={() => onNavigate('detail', relProduct.id)}
                >
                  <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
                    <img
                      src={relProduct.image}
                      alt={relProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="mb-3 group-hover:text-[#007AFF] transition-colors line-clamp-2">
                      {relProduct.name}
                    </h4>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(relProduct.rating)
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        ({relProduct.reviews})
                      </span>
                    </div>
                    <div className="text-xl text-[#007AFF]">
                      {formatPrice(relProduct.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
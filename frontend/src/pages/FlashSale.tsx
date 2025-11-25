import { Star, ShoppingCart, Timer, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface FlashSaleProps {
  onAddToCart: () => void;
}

export function FlashSale({ onAddToCart }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const products = [
    {
      id: 1,
      name: 'Gaming Laptop RTX 4070',
      price: 45990000,
      originalPrice: 59990000,
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      discount: 23,
      stock: 5,
    },
    {
      id: 2,
      name: 'Màn Hình 4K 144Hz',
      price: 12990000,
      originalPrice: 17990000,
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1551459601-c42a28ef7506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYXdpZGUlMjBtb25pdG9yfGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      discount: 28,
      stock: 12,
    },
    {
      id: 3,
      name: 'Bàn Phím Cơ RGB',
      price: 2490000,
      originalPrice: 3990000,
      rating: 4.7,
      reviews: 589,
      image: 'https://images.unsplash.com/photo-1602025882379-e01cf08baa51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmR8ZW58MXx8fHwxNzYzOTQ3ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      discount: 38,
      stock: 8,
    },
    {
      id: 4,
      name: 'Tai Nghe Gaming 7.1',
      price: 1790000,
      originalPrice: 2990000,
      rating: 4.6,
      reviews: 423,
      image: 'https://images.unsplash.com/photo-1660391532247-4a8ad1060817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc2NDA0MTcyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      discount: 40,
      stock: 15,
    },
    {
      id: 5,
      name: 'Chuột Gaming Wireless',
      price: 1290000,
      originalPrice: 1990000,
      rating: 4.8,
      reviews: 678,
      image: 'https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMG1vdXNlfGVufDF8fHx8MTc2Mzk2NDI5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      discount: 35,
      stock: 20,
    },
    {
      id: 6,
      name: 'PC Gaming RTX 4080',
      price: 68990000,
      originalPrice: 89990000,
      rating: 5.0,
      reviews: 92,
      image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwYyUyMHNldHVwfGVufDF8fHx8MTc2NDAzMzMwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      discount: 23,
      stock: 3,
    },
    {
      id: 7,
      name: 'SSD NVMe 2TB',
      price: 4990000,
      originalPrice: 6990000,
      rating: 4.9,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1646153114001-495dfb56506d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjB0ZWNofGVufDF8fHx8MTc2Mzk3Mjg5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      discount: 29,
      stock: 25,
    },
    {
      id: 8,
      name: 'Webcam 4K Pro',
      price: 3490000,
      originalPrice: 4990000,
      rating: 4.7,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1763136469641-372e5cc4e883?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwYWNjZXNzb3JpZXMlMjBrZXlib2FyZHxlbnwxfHx8fDE3NjQwNDE3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      discount: 30,
      stock: 10,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#007AFF] rounded-lg">
              <Timer className="w-6 h-6" />
            </div>
            <h2 className="text-4xl">Flash Sale</h2>
          </div>
          <p className="text-gray-400">Ưu đãi có thời hạn - Nhanh tay kẻo lỡ!</p>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-gray-400">Kết thúc sau:</span>
          <div className="flex gap-2">
            <div className="flex flex-col items-center bg-[#007AFF] rounded-lg px-3 py-2 min-w-[60px]">
              <span className="text-2xl">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-xs text-gray-300">Giờ</span>
            </div>
            <div className="flex flex-col items-center bg-[#007AFF] rounded-lg px-3 py-2 min-w-[60px]">
              <span className="text-2xl">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-xs text-gray-300">Phút</span>
            </div>
            <div className="flex flex-col items-center bg-[#007AFF] rounded-lg px-3 py-2 min-w-[60px]">
              <span className="text-2xl">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-xs text-gray-300">Giây</span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#007AFF] hover:bg-[#0051D5] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -translate-x-6"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Products Horizontal Scroll */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-80 bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden hover:border-[#007AFF] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,122,255,0.3)]"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 rounded-full">
                  -{product.discount}%
                </div>

                {/* Stock Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-sm">
                  Còn {product.stock}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="mb-3 hover:text-[#007AFF] transition-colors line-clamp-2">
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
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl text-[#007AFF]">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
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

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#007AFF] hover:bg-[#0051D5] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-x-6"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
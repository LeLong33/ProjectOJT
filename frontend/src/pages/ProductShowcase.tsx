import { ShoppingCart, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// 1. Import hook useCart
import { useCart } from '@/context/CartContext'; 

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  product_id: number;
  name: string;
  price: number;
  rating: number;
  numReviews: number;
  short_description: string;
  image_url: string;
  category?: string;
}

// Có thể bỏ props onAddToCart nếu không dùng để mở sidebar, 
// hoặc giữ lại nếu bạn muốn mở giỏ hàng sau khi add thành công.
interface ProductShowcaseProps {
  onOpenCart?: () => void; // Đổi tên thành onOpenCart cho rõ nghĩa hơn (Optional)
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function ProductShowcase({ onOpenCart }: ProductShowcaseProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Lấy hàm addToCart từ Context
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data.data as Product[]); 
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
        setError("Không thể tải sản phẩm. Kiểm tra kết nối Backend.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // 3. Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = (product: Product) => {
    addToCart({
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || '',
    }, 1); // Mặc định số lượng là 1 khi thêm từ trang chủ

    // Thông báo nhẹ (hoặc có thể dùng thư viện toast)
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);

    // Nếu muốn mở sidebar giỏ hàng sau khi thêm:
    if (onOpenCart) {
        onOpenCart();
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-xl text-gray-500">Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-xl text-red-500">{error}</div>;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-800">
      <div className="text-center mb-12">
        <h2 className="text-4xl mb-4">Sản Phẩm Nổi Bật</h2>
        <p className="text-gray-400">Khám phá bộ sưu tập sản phẩm công nghệ hàng đầu</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.product_id}
            className="group bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden hover:border-[#007AFF] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,122,255,0.2)]"
          >
            <Link to={`/product/${product.product_id}`} className="block">
              <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
                <img
                  src={product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </Link>

            <div className="p-5">
              <Link to={`/product/${product.product_id}`}>
                <h3 className="mb-3 hover:text-[#007AFF] transition-colors line-clamp-2 min-h-[3rem] text-lg font-semibold">
                  {product.name}
                </h3>
              </Link>
              
              {product.short_description && (
                <p className="mb-3 text-sm text-gray-400 line-clamp-2 min-h-[2rem]">
                  {product.short_description}
                </p>
              )}
              
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
                  {product.rating} ({product.numReviews})
                </span>
              </div>

              <div className="mb-4">
                <span className="text-2xl text-[#007AFF]">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* 4. Cập nhật sự kiện onClick */}
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full flex items-center justify-center gap-2 bg-[#007AFF] hover:bg-[#0051D5] py-3 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="px-8 py-3 border border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF] hover:text-white rounded-lg transition-colors">
          Xem Thêm Sản Phẩm
        </button>
      </div>
    </section>
  );
}
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Star, ShoppingCart, CreditCard, Truck, Shield, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProductById, fetchProducts } from '../services/api';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../services/api';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  useEffect(() => {
    loadProduct();
    loadRelatedProducts();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await fetchProductById(parseInt(id));
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      const all = await fetchProducts();
      setRelatedProducts(all.slice(0, 4));
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      specs: `${product.cpu || ''} ${product.ram || ''}`.trim(),
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  const images = product.images || [product.image];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-[#007AFF] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách sản phẩm
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative aspect-square bg-[#1a1a1a] rounded-2xl overflow-hidden mb-4 group">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
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
              )}
            </div>

            {/* Info */}
            <div>
              <div className="text-sm text-[#007AFF] mb-2">{product.brand}</div>
              <h1 className="text-3xl mb-4">{product.name}</h1>

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

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl text-[#007AFF]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {(product.cpu || product.ram || product.storage) && (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg mb-4">Thông Số Nổi Bật</h3>
                  <div className="space-y-3 text-sm">
                    {product.cpu && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">CPU:</span>
                        <span>{product.cpu}</span>
                      </div>
                    )}
                    {product.gpu && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">GPU:</span>
                        <span className="text-right">{product.gpu}</span>
                      </div>
                    )}
                    {product.ram && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">RAM:</span>
                        <span>{product.ram}</span>
                      </div>
                    )}
                    {product.storage && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">SSD:</span>
                        <span>{product.storage}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

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

              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#007AFF] hover:bg-[#0051D5] py-4 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-4 rounded-lg transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  Mua ngay
                </button>
              </div>

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

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl mb-8">Sản phẩm tương tự</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                  <div
                    key={relProduct.id}
                    className="group bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden hover:border-[#007AFF] transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/products/${relProduct.id}`)}
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
                      <div className="text-xl text-[#007AFF]">
                        {formatPrice(relProduct.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

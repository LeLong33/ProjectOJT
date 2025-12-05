import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/pages/Navbar';
import { Footer } from '@/pages/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ProductDetailData {
  product_id: number;
  name: string;
  price: number;
  rating?: number;
  numReviews?: number;
  short_description?: string;
  description?: string;
  image_url?: string;
  CPU?: string;
  GPU?: string;
  RAM?: string;
  Storage?: string;
  Display?: string;
}

function formatPrice(price?: number) {
  if (typeof price !== 'number') return '';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${API_URL}/products/${id}`)
      .then((res) => {
        const d = res.data?.data || res.data;
        setProduct(d);
        // Prefer images array attached by backend, fallback to single image_url
        const imgs = (d && (d.images && d.images.length)) ? d.images.map((it: any) => it.url) : (d?.image_url ? [d.image_url] : []);
        setMainImage(imgs[0]);
      })
      .catch((e) => {
        console.error('Failed to load product', e);
        setError('Không thể tải thông tin sản phẩm.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-300">Đang tải...</div>;
  if (error) return <div className="min-h-[60vh] flex items-center justify-center text-red-400">{error}</div>;
  if (!product) return <div className="min-h-[60vh] flex items-center justify-center text-gray-300">Không tìm thấy sản phẩm</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar cartCount={0} />

      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:underline">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:underline">Sản phẩm</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left gallery & info (bigger) */}
            <div className="lg:col-span-7">
              <div className="bg-[#080808] rounded-lg p-6">
                <img src={mainImage || (product.image_url ?? 'https://via.placeholder.com/800x800')} alt={product.name} className="w-full h-[560px] object-contain bg-black rounded" />
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {((product as any).images && (product as any).images.length ? (product as any).images.map((it: any) => it.url) : [product.image_url]).filter(Boolean).slice(0,4).map((u: string, i: number) => (
                    <button key={i} onClick={() => setMainImage(u)} className={`w-full h-24 rounded overflow-hidden ${mainImage === u ? 'ring-2 ring-[#007AFF]' : 'border border-gray-700'}`}>
                      <img src={u || 'https://via.placeholder.com/160'} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#00a3ff] font-medium">{(product as any)?.brand || 'Thương hiệu'}</div>
                    <h1 className="text-2xl font-semibold mt-1">{product.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700' } w-4 h-4`} />
                        ))}
                      </div>
                      <span className="text-gray-400">{product.rating ?? '0'} ({product.numReviews ?? 0})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#00a3ff]">{formatPrice(product.price)}</div>
                    {('original_price' in product) && (product as any).original_price ? (
                      <div className="flex items-center gap-3 justify-end mt-2">
                        <div className="text-sm text-gray-400 line-through">{formatPrice((product as any).original_price)}</div>
                        <div className="text-sm text-red-500 bg-red-900/30 px-2 py-1 rounded">Tiết kiệm {formatPrice(((product as any).original_price || 0) - (product.price || 0))}</div>
                      </div>
                    ) : null}
                  </div>
                </div>

                {product.short_description && <p className="text-gray-300 mt-4">{product.short_description}</p>}
              </div>

              {/* Tabs */}
              <div className="mt-6">
                <div className="flex items-center gap-6 border-b border-gray-800 pb-3">
                  <button onClick={() => setActiveTab('description')} className={`pb-2 ${activeTab === 'description' ? 'text-[#00a3ff] border-b-2 border-[#00a3ff]' : 'text-gray-400'}`}>Mô tả</button>
                  <button onClick={() => setActiveTab('specs')} className={`pb-2 ${activeTab === 'specs' ? 'text-[#00a3ff] border-b-2 border-[#00a3ff]' : 'text-gray-400'}`}>Thông số kỹ thuật</button>
                  <button onClick={() => setActiveTab('reviews')} className={`pb-2 ${activeTab === 'reviews' ? 'text-[#00a3ff] border-b-2 border-[#00a3ff]' : 'text-gray-400'}`}>Đánh giá ({product.numReviews ?? 0})</button>
                </div>

                <div className="mt-4 bg-[#070707] border border-gray-800 rounded-lg p-6">
                  {activeTab === 'description' && (
                    <div className="prose prose-invert max-w-none text-sm">
                      {product.description ? <div dangerouslySetInnerHTML={{ __html: product.description }} /> : <p>Không có mô tả chi tiết.</p>}
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="text-sm text-gray-300">
                      <h4 className="text-white font-medium mb-3">Thông Số Nổi Bật</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-gray-400">CPU:</div>
                        <div className="text-right">{product.CPU || '—'}</div>
                        <div className="text-gray-400">GPU:</div>
                        <div className="text-right">{product.GPU || '—'}</div>
                        <div className="text-gray-400">RAM:</div>
                        <div className="text-right">{product.RAM || '—'}</div>
                        <div className="text-gray-400">SSD:</div>
                        <div className="text-right">{product.Storage || '—'}</div>
                        <div className="text-gray-400">Màn hình:</div>
                        <div className="text-right">{product.Display || '—'}</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="text-sm text-gray-300">Chưa có đánh giá</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right sticky box (specs + buy actions) */}
            <aside className="lg:col-span-5">
              <div className="sticky top-28">
                <div className="bg-[#0b0b0b] border border-gray-800 rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#00a3ff] font-medium">{(product as any)?.brand || 'Thương hiệu'}</div>
                      <h2 className="text-xl font-semibold mt-1">{product.name}</h2>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#00a3ff]">{formatPrice(product.price)}</div>
                      {('original_price' in product) && (product as any).original_price ? (
                        <div className="text-sm text-gray-400 line-through">{formatPrice((product as any).original_price)}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 bg-[#0f0f0f] rounded-lg p-4 border border-gray-800">
                    <h4 className="text-white font-medium mb-3">Thông Số Nổi Bật</h4>
                    <div className="text-sm text-gray-300 grid grid-cols-2 gap-2">
                      <div className="text-gray-400">CPU:</div>
                      <div className="text-right">{product.CPU || '—'}</div>
                      <div className="text-gray-400">GPU:</div>
                      <div className="text-right">{product.GPU || '—'}</div>
                      <div className="text-gray-400">RAM:</div>
                      <div className="text-right">{product.RAM || '—'}</div>
                      <div className="text-gray-400">SSD:</div>
                      <div className="text-right">{product.Storage || '—'}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-gray-400 mb-2">Số lượng:</div>
                    <div className="inline-flex items-center gap-2">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded border border-gray-700 flex items-center justify-center">-</button>
                      <div className="w-14 h-10 flex items-center justify-center bg-[#0b0b0b] border border-gray-700">{quantity}</div>
                      <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded border border-gray-700 flex items-center justify-center">+</button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button className="bg-[#007AFF]">Thêm vào giỏ</Button>
                    <Button className="bg-green-600">Mua ngay</Button>
                  </div>

                  <div className="mt-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#007AFF] inline-block"/> Miễn phí vận chuyển toàn quốc</div>
                    <div className="flex items-center gap-2 mt-2"><span className="w-3 h-3 rounded-full bg-[#007AFF] inline-block"/> Bảo hành chính hãng 24 tháng</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

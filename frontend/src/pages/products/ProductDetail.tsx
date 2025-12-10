import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingCart, Truck, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/pages/Navbar';
import { Footer } from '@/pages/Footer';
import { useCart } from '@/context/CartContext'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Cập nhật interface để chấp nhận cả mảng images và field image/image_url lẻ
interface ProductDetailData {
    product_id: number;
    name: string;
    price: number;
    rating: number;
    numReviews: number;
    short_description: string;
    description: string;
    CPU?: string;
    GPU?: string;
    RAM?: string;
    Storage?: string;
    Display?: string;
    
    // Sửa phần này: Chấp nhận nhiều trường hợp trả về từ API
    image?: string;       // Trường hợp 1: API trả về field 'image'
    image_url?: string;   // Trường hợp 2: API trả về field 'image_url'
    images?: { url: string; is_main: boolean }[]; // Trường hợp 3: API trả về mảng
}

function formatPrice(price?: number) {
    if (typeof price !== 'number') return '';
    try {
        const s = Math.round(price).toLocaleString('vi-VN');
        return `${s} đ`;
    } catch (e) {
        return String(price) + ' đ';
    }
}

// Hàm lấy ảnh an toàn (Safety check cho ảnh)
function getProductImage(p: any): string {
    if (!p) return '';
    // Ưu tiên 1: Lấy từ mảng images nếu có
    if (Array.isArray(p.images) && p.images.length > 0) {
        const main = p.images.find((img: any) => img.is_main);
        if (main?.url) return main.url;
        if (p.images[0]?.url) return p.images[0].url;
    }
    // Ưu tiên 2: Lấy từ root field
    return p.image || p.image_url || '';
}

function resolvePrice(product: any): number | undefined {
    if (!product) return undefined;
    const candidates = ['price', 'unit_price', 'sale_price', 'original_price', 'gia', 'price_vnd'];
    for (const key of candidates) {
        if (key in product && product[key] != null) {
            const v = product[key];
            if (typeof v === 'number') return v;
            if (typeof v === 'string') {
                const n = parseFloat(v.replace(/[.,\s]/g, ''));
                if (!isNaN(n)) return n;
            }
        }
    }
    return undefined;
}

function normalizePriceValue(p?: number): number | undefined {
    if (p == null) return undefined;
    if (p >= 1_000_000_000) {
        const down = Math.round(p / 100);
        return down;
    }
    return p;
}

const formatPriceShort = (price: number) => formatPrice(price);

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState<ProductDetailData | null>(null);
    const [mainImage, setMainImage] = useState<string | undefined>(undefined);
    const [relatedProducts, setRelatedProducts] = useState<ProductDetailData[]>([]); 
    const [quantity, setQuantity] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description'); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- LOGIC FETCH BACKEND ---
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        axios
          .get(`${API_URL}/products/${id}`)
          .then((res) => {
            const data = res.data?.data || res.data;
            setProduct(data);
            
            // FIX: Logic lấy ảnh chính thông minh hơn
            // Kiểm tra: data.image -> data.image_url -> data.images array
            const imgUrl = getProductImage(data);
            setMainImage(imgUrl);

            if (data.price) {
                fetchRelatedProducts(data.price);
            }
          })
          .catch((e) => {
            setError('Không thể tải thông tin sản phẩm.');
          })
          .finally(() => setLoading(false));
    }, [id]);
    
    const fetchRelatedProducts = async (basePrice: number) => {
        const minPrice = Math.max(0, basePrice - 5000000);
        const maxPrice = basePrice + 5000000;
        try {
            const res = await axios.get(`${API_URL}/products`);
            const allProducts = res.data.data as ProductDetailData[];

            const filtered = allProducts.filter(p => {
                const priceNum = resolvePrice(p as any) as number | undefined;
                return p.product_id !== parseInt(id as string) && priceNum != null && priceNum >= minPrice && priceNum <= maxPrice;
            }).slice(0, 4);
            setRelatedProducts(filtered);
        } catch (e) {
            console.error('Failed to load related products', e);
        }
    };
    
    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            product_id: product.product_id,
            name: product.name,
            price: product.price,
            image_url: mainImage || '',
        }, quantity);
        alert(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng!`); 
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">Đang tải...</div>;
    if (error) return <div className="min-h-[60vh] flex items-center justify-center text-red-600">{error}</div>;
    if (!product) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">Không tìm thấy sản phẩm</div>;

    // FIX: Tạo danh sách ảnh thumbnail
    // Nếu có mảng images thì dùng, nếu không thì dùng ảnh chính tạo thành mảng 1 phần tử
    const imageURLs = (product.images && product.images.length > 0) 
        ? product.images.map(img => img.url) 
        : (mainImage ? [mainImage] : []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-inter">
            <Navbar cartCount={0} />

            <main className="pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <nav className="text-sm text-gray-500 mb-6">
                        <Link to="/" className="hover:underline">Trang chủ</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-300">{product.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 bg-[#1a1a1a] rounded-xl p-6 shadow-xl border border-gray-800">
                        
                        {/* ⬅️ CỘT TRÁI (3/7): GALLERY ẢNH */}
                        <div className="lg:col-span-3">
                            <div className="bg-[#101010] rounded-xl p-4 shadow-sm border border-gray-700">
                                <img 
                                    src={mainImage || 'https://via.placeholder.com/800x800?text=No+Image'} 
                                    alt={product.name} 
                                    className="w-full h-[380px] object-contain rounded"
                                    onError={(e) => {
                                        // Fallback nếu ảnh lỗi
                                        e.currentTarget.src = 'https://via.placeholder.com/800x800?text=Error';
                                    }}
                                />
                                {/* Gallery Thumbnails */}
                                {imageURLs.length > 1 && (
                                    <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                                        {imageURLs.filter(Boolean).slice(0, 6).map((u: string, i: number) => (
                                            <button key={i} onClick={() => setMainImage(u)} className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden ${mainImage === u ? 'ring-2 ring-red-600' : 'border border-gray-700'}`}>
                                                <img src={u} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-6 bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-gray-700">
                                <h3 className="text-lg font-semibold mb-3 text-white">Chính sách sản phẩm</h3>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-red-400"/> Hàng chính hãng - Bảo hành 12 tháng</div>
                                    <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-red-400"/> Giao hàng miễn phí toàn quốc</div>
                                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-red-400"/> Hỗ trợ kỹ thuật 24/7</div>
                                </div>
                            </div>
                        </div>

                        {/* ➡️ CỘT PHẢI (4/7): THÔNG TIN */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-5">
                                <div className="border-b border-gray-700 pb-3">
                                    <h1 className="text-3xl font-bold mt-1 mb-2 text-white">{product.name}</h1>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700' } w-4 h-4`} />
                                            ))}
                                        </div>
                                        <span className="text-gray-400">{product.rating ? product.rating.toFixed(1) : 0} ({product.numReviews || 0} Đánh giá)</span>
                                    </div>
                                </div>

                                <div className="bg-red-800/20 border border-red-700/50 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-end justify-between mb-4">
                                        {
                                            (() => {
                                                const raw = resolvePrice(product);
                                                const p = normalizePriceValue(raw as number | undefined);
                                                return p ? <span className="text-4xl font-extrabold text-red-400">{formatPrice(p)}</span> : <span className="text-lg text-gray-300">Liên hệ để biết giá</span>;
                                            })()
                                        }
                                        {('original_price' in product) && (product as any).original_price && (
                                            <span className="text-lg text-gray-500 line-through">{formatPrice((product as any).original_price)}</span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-4">
                                        <div className="text-sm text-gray-400 mb-2">Số lượng:</div>
                                        <div className="inline-flex items-center gap-2 border border-gray-600 rounded-lg">
                                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 hover:bg-gray-700 flex items-center justify-center text-white">-</button>
                                            <div className="w-10 h-10 flex items-center justify-center border-x border-gray-600 text-white font-medium">{quantity}</div>
                                            <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 hover:bg-gray-700 flex items-center justify-center text-white">+</button>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Button onClick={handleAddToCart} className="bg-red-600 hover:bg-red-700 py-3 text-lg font-semibold w-full">
                                            <ShoppingCart className="w-5 h-5 mr-2" /> Thêm vào giỏ
                                        </Button>
                                        <Button className="bg-blue-600 hover:bg-blue-700 py-3 text-lg font-semibold w-full">Mua ngay</Button>
                                    </div>
                                </div>
                                
                                {product.short_description && <p className="text-gray-400 mt-4 text-sm">{product.short_description}</p>}
                            </div>
                        </aside>
                    </div>

                    {/* === PHẦN CHI TIẾT SẢN PHẨM === */}
                    <div className="mt-12 bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-6 border-b border-gray-700 pb-3 mb-6">
                            <button onClick={() => setActiveTab('description')} className={`pb-2 text-lg font-medium ${activeTab === 'description' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}>Mô tả sản phẩm</button>
                            <button onClick={() => setActiveTab('specs')} className={`pb-2 text-lg font-medium ${activeTab === 'specs' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}>Thông số kỹ thuật</button>
                            <button onClick={() => setActiveTab('reviews')} className={`pb-2 text-lg font-medium ${activeTab === 'reviews' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}>Đánh giá ({product.numReviews})</button>
                        </div>
                        
                        <div className="min-h-[300px]">
                            {activeTab === 'description' && (
                                <div className="prose prose-invert max-w-none text-sm text-gray-300">
                                    <h3 className='text-xl font-semibold mb-4'>Mô tả chi tiết</h3>
                                    {product.description ? <div dangerouslySetInnerHTML={{ __html: product.description }} /> : <p>Không có mô tả chi tiết.</p>}
                                </div>
                            )}

                            {activeTab === 'specs' && (
                                <div className="text-sm text-gray-300">
                                    <h4 className="text-white font-medium mb-4 text-xl">Thông số kỹ thuật chi tiết</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3">
                                        <div className="text-gray-500">CPU:</div><div className="font-medium text-white">{product.CPU || '—'}</div>
                                        <div className="text-gray-500">GPU:</div><div className="font-medium text-white">{product.GPU || '—'}</div>
                                        <div className="text-gray-500">RAM:</div><div className="font-medium text-white">{product.RAM || '—'}</div>
                                        <div className="text-gray-500">Ổ cứng:</div><div className="font-medium text-white">{product.Storage || '—'}</div>
                                        <div className="text-gray-500">Màn hình:</div><div className="font-medium text-white">{product.Display || '—'}</div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="text-sm text-gray-300">
                                    <h4 className="text-white font-medium mb-4 text-xl">Đánh giá và Bình luận</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-6">
                                        <div className="md:col-span-1">
                                            <div className="text-6xl font-extrabold text-red-500 mb-2">{product.rating ? product.rating.toFixed(1) : 0} / 5</div>
                                            <div className="flex items-center gap-1 text-yellow-400">
                                                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400" />)}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">{product.numReviews || 0} lượt đánh giá</p>
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <p className='text-gray-400'>Bạn đã mua sản phẩm này? Hãy chia sẻ đánh giá của mình!</p>
                                            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Viết đánh giá</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* === SẢN PHẨM LIÊN QUAN === */}
                    <div className="mt-12 pt-12 border-t border-gray-800">
                        <h2 className="text-2xl font-bold mb-6 text-white">Sản phẩm có thể bạn thích</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {relatedProducts.length > 0 ? (
                                relatedProducts.map((p) => {
                                    // FIX: Lấy ảnh cho sản phẩm liên quan
                                    const relatedImg = getProductImage(p);
                                    return (
                                        <Link to={`/product/${p.product_id}`} key={p.product_id} className="block bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-red-500 transition-all">
                                            <img src={relatedImg || 'https://via.placeholder.com/300?text=No+Image'} alt={p.name} className="h-28 w-full object-contain mb-3" />
                                            <h4 className="text-base font-medium line-clamp-2 text-white">{p.name}</h4>
                                            <p className="text-red-500 font-semibold mt-1">{formatPriceShort(p.price)}</p>
                                        </Link>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 col-span-4">Không tìm thấy sản phẩm tương tự trong tầm giá (+/- 5 triệu).</p>
                            )}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
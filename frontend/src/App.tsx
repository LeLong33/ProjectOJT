import { Header } from "./components/Pages/Header";
import { Hero } from "./components/Pages/Hero";
import { Categories } from "./components/Pages/Categories";
import { ProductCard } from "./components/Pages/ProductCard";
import { Footer } from "./components/Pages/Footer";
import { Zap, TrendingUp } from "lucide-react";

const featuredProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1641430034785-47f6f91ab6cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc2MzU3MTI3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Laptop Gaming ASUS ROG Strix G15 - AMD Ryzen 9, RTX 4060, 16GB RAM",
    price: "29.990.000₫",
    originalPrice: "35.990.000₫",
    rating: 5,
    reviews: 124,
    badge: "-17%",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1641430034785-47f6f91ab6cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc2MzU3MTI3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "MacBook Pro 14 inch M3 Pro - 18GB RAM, 512GB SSD",
    price: "52.990.000₫",
    originalPrice: "54.990.000₫",
    rating: 5,
    reviews: 89,
    badge: "HOT",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1611648694931-1aeda329f9da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMG1vbml0b3J8ZW58MXx8fHwxNzYzNDc1MDI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Màn hình gaming Samsung Odyssey G7 32 inch 240Hz Curved WQHD",
    price: "14.990.000₫",
    originalPrice: "18.990.000₫",
    rating: 5,
    reviews: 67,
    badge: "-21%",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZHxlbnwxfHx8fDE3NjM1Mzg5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Bàn phím cơ Logitech G Pro X TKL - Wireless Gaming Keyboard",
    price: "3.990.000₫",
    rating: 4,
    reviews: 156,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMG1vdXNlfGVufDF8fHx8MTc2MzU3MTI3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Chuột gaming Razer DeathAdder V3 Pro - Wireless Gaming Mouse",
    price: "3.490.000₫",
    originalPrice: "3.990.000₫",
    rating: 5,
    reviews: 203,
    badge: "-13%",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1677086813101-496781a0f327?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkc2V0fGVufDF8fHx8MTc2MzQ3NjgwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Tai nghe gaming SteelSeries Arctis Nova Pro Wireless",
    price: "7.990.000₫",
    originalPrice: "9.990.000₫",
    rating: 5,
    reviews: 98,
    badge: "-20%",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1641430034785-47f6f91ab6cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBtb2Rlcm4lMjBkZXNrfGVufDF8fHx8MTc2MzU3MTI3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Dell XPS 15 9530 - Intel Core i7-13700H, RTX 4050, 32GB RAM",
    price: "42.990.000₫",
    rating: 5,
    reviews: 45,
    badge: "MỚI",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1611648694931-1aeda329f9da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMG1vbml0b3J8ZW58MXx8fHwxNzYzNDc1MDI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    name: "Màn hình LG UltraGear 27 inch 4K IPS 144Hz HDR 400",
    price: "11.990.000₫",
    originalPrice: "13.990.000₫",
    rating: 4,
    reviews: 72,
    badge: "-14%",
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <Categories />

      {/* Flash Sale */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 p-2 rounded">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-red-500">Flash Sale</h2>
                <p className="text-gray-600">Kết thúc trong 23:45:12</p>
              </div>
            </div>
            <a href="#" className="text-blue-600 hover:underline">
              Xem tất cả →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2>Sản phẩm nổi bật</h2>
            </div>
            <a href="#" className="text-blue-600 hover:underline">
              Xem tất cả →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(4, 8).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative rounded-lg overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1733945761533-727f49908d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb21wdXRlciUyMHNldHVwfGVufDF8fHx8MTc2MzU2NjYxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Gaming Setup"
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 text-white">
                <h3 className="mb-2">Gaming Setup</h3>
                <p className="mb-4">Giảm đến 30% cho bộ setup hoàn chỉnh</p>
                <button className="bg-white text-purple-600 px-6 py-2 rounded-lg w-fit hover:bg-gray-100 transition">
                  Khám phá ngay
                </button>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1611648694931-1aeda329f9da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMG1vbml0b3J8ZW58MXx8fHwxNzYzNDc1MDI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Monitor"
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 text-white">
                <h3 className="mb-2">Màn hình cao cấp</h3>
                <p className="mb-4">4K, 144Hz - Trải nghiệm hình ảnh đỉnh cao</p>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg w-fit hover:bg-gray-100 transition">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-8">Tại sao chọn TechStore?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-2">100% chính hãng</h3>
              <p className="text-gray-600">Cam kết sản phẩm chính hãng từ nhà sản xuất</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2">Giá tốt nhất</h3>
              <p className="text-gray-600">Cam kết giá rẻ nhất thị trường</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="mb-2">Trả góp 0%</h3>
              <p className="text-gray-600">Hỗ trợ trả góp lãi suất 0% qua thẻ tín dụng</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2">Bảo hành dài hạn</h3>
              <p className="text-gray-600">Bảo hành chính hãng lên đến 36 tháng</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

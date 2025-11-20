import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../ui/ImageWithFallback";

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block bg-yellow-400 text-gray-900 px-4 py-1 rounded-full mb-4">
              Giảm giá đến 40%
            </div>
            <h1 className="mb-4">
              Laptop Gaming Hiệu Năng Cao
            </h1>
            <p className="mb-6 text-blue-100">
              Trải nghiệm sức mạnh tối đa với dòng laptop gaming mới nhất. 
              Cấu hình khủng, giá hấp dẫn, hỗ trợ trả góp 0%.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition">
                Mua ngay
              </button>
              <button className="border-2 border-white px-8 py-3 rounded-lg hover:bg-white/10 transition">
                Xem thêm
              </button>
            </div>
          </div>
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1733945761533-727f49908d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb21wdXRlciUyMHNldHVwfGVufDF8fHx8MTc2MzU2NjYxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Gaming Setup"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
          </div>
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

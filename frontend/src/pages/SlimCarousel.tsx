import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlimHeroCarouselProps {
  category: string;
}

export function SlimHeroCarousel({ category }: SlimHeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const getSlidesByCategory = (cat: string) => {
    const allSlides = {
      laptop: [
        {
          title: 'Laptop Gaming Mới Nhất',
          subtitle: 'Hiệu năng đỉnh cao với RTX 40 Series',
          image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e…ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          title: 'Laptop Văn Phòng',
          subtitle: 'Mỏng nhẹ, pin trâu, hiệu quả',
          image: 'https://images.unsplash.com/photo-1646153114001-495dfb56506…ZWNofGVufDF8fHx8MTc2Mzk3Mjg5NHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
      monitor: [
        {
          title: 'Màn Hình Gaming 240Hz',
          subtitle: 'Độ phản hồi nhanh, màu sắc sống động',
          image: 'https://images.unsplash.com/photo-1551459601-c42a28ef7506?c…dG9yfGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
      pc: [
        {
          title: 'PC Gaming Custom',
          subtitle: 'Build theo yêu cầu, tản nhiệt tốt',
          image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1…dHVwfGVufDF8fHx8MTc2NDAzMzMwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
      accessories: [
        {
          title: 'Phụ Kiện Gaming',
          subtitle: 'Nâng cao trải nghiệm chơi game',
          image: 'https://images.unsplash.com/photo-1763136469641-372e5cc4e88…FyZHxlbnwxfHx8fDE3NjQwNDE3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
      all: [
        {
          title: 'Ưu Đãi Đặc Biệt',
          subtitle: 'Giảm giá lên đến 40% cho tất cả sản phẩm',
          image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e…ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    };

    return allSlides[cat as keyof typeof allSlides] || allSlides.all;
  };

  const slides = getSlidesByCategory(category);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
}, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-64 overflow-hidden bg-[#1a1a1a]">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  <h2 className="text-3xl mb-2">{slide.title}</h2>
                  <p className="text-gray-300">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index ? 'w-6 bg-[#007AFF]' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

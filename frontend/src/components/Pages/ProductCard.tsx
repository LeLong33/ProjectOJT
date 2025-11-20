import { ShoppingCart, Star, Heart } from "lucide-react";
import { ImageWithFallback } from "../ui/ImageWithFallback";

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export function ProductCard({
  image,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  badge,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition group">
      <div className="relative overflow-hidden rounded-t-lg">
        {badge && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full z-10">
            {badge}
          </div>
        )}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition z-10 hover:bg-red-50">
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 min-h-[3em]">{name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-500">({reviews})</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-red-600">{price}</span>
          {originalPrice && (
            <span className="text-gray-400 line-through">{originalPrice}</span>
          )}
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

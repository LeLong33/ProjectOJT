import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-2 rounded">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-white">TechStore</span>
            </div>
            <p className="mb-4">
              Chuyên cung cấp laptop, PC, linh kiện và phụ kiện máy tính chính hãng với giá tốt nhất thị trường.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-500 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-500 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-500 transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-500 transition">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Sản phẩm</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Khuyến mãi</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Tin tức</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Liên hệ</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-500 transition">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Phương thức thanh toán</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>FSA Hoà Lạc</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>1900 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>support@techstore.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; 2025 TechStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

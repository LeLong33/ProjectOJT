import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Cpu } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    company: [
      { name: 'Về Chúng Tôi', href: '#' },
      { name: 'Tuyển Dụng', href: '#' },
      { name: 'Tin Tức', href: '#' },
      { name: 'Đối Tác', href: '#' },
    ],
    support: [
      { name: 'Hỗ Trợ', href: '#' },
      { name: 'Chính Sách Bảo Hành', href: '#' },
      { name: 'Chính Sách Đổi Trả', href: '#' },
      { name: 'Hướng Dẫn Mua Hàng', href: '#' },
    ],
    customer: [
      { name: 'Tài Khoản', href: '#' },
      { name: 'Đơn Hàng', href: '#' },
      { name: 'Địa Chỉ', href: '#' },
      { name: 'Yêu Thích', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', name: 'Facebook' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', name: 'Instagram' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', name: 'Twitter' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', name: 'Youtube' },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-[#007AFF]/10 to-purple-500/10 border border-[#007AFF]/30 rounded-2xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl mb-2">Đăng Ký Nhận Tin</h3>
              <p className="text-gray-400">
                Nhận thông báo về sản phẩm mới và ưu đãi đặc biệt
              </p>
            </div>
            <div className="flex-1 w-full md:max-w-md">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email của bạn..."
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#007AFF] transition-colors"
                  />
                </div>
                <button className="px-6 py-3 bg-[#007AFF] hover:bg-[#0051D5] rounded-lg transition-colors whitespace-nowrap">
                  Đăng Ký
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl tracking-tight">TechStore</span>
            </div>
            <p className="text-gray-400 mb-6">
              Chuyên cung cấp các sản phẩm công nghệ chính hãng với giá tốt nhất thị trường. 
              Uy tín - Chất lượng - Bảo hành tận tâm.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#007AFF] mt-0.5" />
                <span className="text-gray-400">
                  Khu công nghệ cao Hoà Lạc, Thạch Thất, Hà Nội
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#007AFF]" />
                <span className="text-gray-400">1900 123456</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#007AFF]" />
                <span className="text-gray-400">support@techstore.vn</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-4">Công Ty</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#007AFF] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="mb-4">Hỗ Trợ</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#007AFF] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Links */}
          <div>
            <h4 className="mb-4">Khách Hàng</h4>
            <ul className="space-y-3">
              {footerLinks.customer.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#007AFF] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Payment */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Theo dõi chúng tôi:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#007AFF] hover:border-[#007AFF] transition-all"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © 2025 TechStore. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

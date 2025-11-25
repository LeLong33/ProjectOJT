import { Laptop, Monitor, Cpu, Headphones } from 'lucide-react';

export function CategoryGrid() {
  const categories = [
    {
      icon: <Laptop className="w-12 h-12" />,
      name: 'Laptop',
      description: 'Gaming & Văn Phòng',
      count: '156+ sản phẩm',
      image: 'https://images.unsplash.com/photo-1658262548679-776e437f95e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjB0ZWNofGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-blue-500/20 to-purple-500/20',
    },
    {
      icon: <Monitor className="w-12 h-12" />,
      name: 'Màn Hình',
      description: 'Độ phân giải cao',
      count: '89+ sản phẩm',
      image: 'https://images.unsplash.com/photo-1551459601-c42a28ef7506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYXdpZGUlMjBtb25pdG9yfGVufDF8fHx8MTc2NDA0MTcxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-cyan-500/20 to-blue-500/20',
    },
    {
      icon: <Cpu className="w-12 h-12" />,
      name: 'PC Gaming',
      description: 'Build PC theo ý muốn',
      count: '243+ sản phẩm',
      image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwYyUyMHNldHVwfGVufDF8fHx8MTc2NDAzMzMwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: <Headphones className="w-12 h-12" />,
      name: 'Phụ Kiện',
      description: 'Chuột, Bàn phím & Tai nghe',
      count: '412+ sản phẩm',
      image: 'https://images.unsplash.com/photo-1763136469641-372e5cc4e883?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwYWNjZXNzb3JpZXMlMjBrZXlib2FyZHxlbnwxfHx8fDE3NjQwNDE3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-orange-500/20 to-red-500/20',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl mb-4">Danh Mục Sản Phẩm</h2>
        <p className="text-gray-400">Khám phá các danh mục công nghệ hàng đầu</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <a
            key={index}
            href="#"
            className="group relative h-80 rounded-2xl overflow-hidden bg-[#1a1a1a] border border-gray-800 hover:border-[#007AFF] transition-all duration-300"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60`} />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-[#007AFF]/20 backdrop-blur-sm rounded-xl border border-[#007AFF]/30 text-[#007AFF] group-hover:bg-[#007AFF] group-hover:text-white transition-colors">
                  {category.icon}
                </div>
                <div className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-sm text-gray-300">
                  {category.count}
                </div>
              </div>

              <div>
                <h3 className="text-2xl mb-2 group-hover:text-[#007AFF] transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-400">{category.description}</p>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 border-2 border-[#007AFF] opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
          </a>
        ))}
      </div>
    </section>
  );
}

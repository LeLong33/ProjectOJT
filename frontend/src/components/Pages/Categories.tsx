import { Laptop, Monitor, Cpu, Keyboard, Mouse, Headphones } from "lucide-react";

const categories = [
  { icon: Laptop, name: "Laptop", count: "250+" },
  { icon: Monitor, name: "Màn hình", count: "180+" },
  { icon: Cpu, name: "Linh kiện", count: "500+" },
  { icon: Keyboard, name: "Bàn phím", count: "120+" },
  { icon: Mouse, name: "Chuột", count: "150+" },
  { icon: Headphones, name: "Tai nghe", count: "90+" },
];

export function Categories() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-8">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition group"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-gray-900">{category.name}</div>
                    <div className="text-gray-500">{category.count}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

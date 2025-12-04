import { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

interface FilterSidebarProps {
  filters: {
    brands: string[];
    priceRange: [number, number];
    cpu: string[];
    ram: string[];
    storage: string[];
    colors: string[];
  };
  onFilterChange: (filters: any) => void;
  category: string;
}

export function FilterSidebar({ filters, onFilterChange, category }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    price: true,
    cpu: true,
    ram: true,
    storage: true,
    colors: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const brands = ['ASUS', 'MSI', 'Dell', 'HP', 'Lenovo', 'Acer', 'Apple', 'Samsung', 'LG'];
  const cpuOptions = ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'];
  const ramOptions = ['8GB', '16GB', '32GB', '64GB'];
  const storageOptions = ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD'];
  const colorOptions = ['Đen', 'Trắng', 'Xám', 'Bạc', 'Xanh'];

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handleCpuToggle = (cpu: string) => {
    const newCpu = filters.cpu.includes(cpu)
      ? filters.cpu.filter(c => c !== cpu)
      : [...filters.cpu, cpu];
    onFilterChange({ ...filters, cpu: newCpu });
  };

  const handleRamToggle = (ram: string) => {
    const newRam = filters.ram.includes(ram)
      ? filters.ram.filter(r => r !== ram)
      : [...filters.ram, ram];
    onFilterChange({ ...filters, ram: newRam });
  };

  const handleStorageToggle = (storage: string) => {
    const newStorage = filters.storage.includes(storage)
      ? filters.storage.filter(s => s !== storage)
      : [...filters.storage, storage];
    onFilterChange({ ...filters, storage: newStorage });
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange] as [number, number];
    newRange[index] = value;
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const clearAllFilters = () => {
    onFilterChange({
      brands: [],
      priceRange: [0, 100000000],
      cpu: [],
      ram: [],
      storage: [],
      colors: [],
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <aside className="w-80 flex-shrink-0">
      <div className="sticky top-24 bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#007AFF]" />
            <h3 className="text-xl">Bộ Lọc</h3>
          </div>
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-400 hover:text-[#007AFF] transition-colors"
          >
            Xóa tất cả
          </button>
        </div>

        {/* Brands Filter */}
        <div className="mb-6 pb-6 border-b border-gray-800">
          <button
            onClick={() => toggleSection('brands')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-gray-300">Thương Hiệu</span>
            {expandedSections.brands ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.brands && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-4 h-4 rounded border-gray-600 bg-[#0a0a0a] text-[#007AFF] focus:ring-[#007AFF] focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="mb-6 pb-6 border-b border-gray-800">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-gray-300">Khoảng Giá</span>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.price && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Từ</label>
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#007AFF]"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Đến</label>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#007AFF]"
                  placeholder="100000000"
                />
              </div>
              <div className="text-xs text-gray-500">
                {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
              </div>
            </div>
          )}
        </div>

        {/* CPU Filter */}
        <div className="mb-6 pb-6 border-b border-gray-800">
          <button
            onClick={() => toggleSection('cpu')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-gray-300">CPU</span>
            {expandedSections.cpu ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.cpu && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cpuOptions.map(cpu => (
                <label key={cpu} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.cpu.includes(cpu)}
                    onChange={() => handleCpuToggle(cpu)}
                    className="w-4 h-4 rounded border-gray-600 bg-[#0a0a0a] text-[#007AFF] focus:ring-[#007AFF] focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    {cpu}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* RAM Filter */}
        <div className="mb-6 pb-6 border-b border-gray-800">
          <button
            onClick={() => toggleSection('ram')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-gray-300">RAM</span>
            {expandedSections.ram ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.ram && (
            <div className="space-y-2">
              {ramOptions.map(ram => (
                <label key={ram} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.ram.includes(ram)}
                    onChange={() => handleRamToggle(ram)}
                    className="w-4 h-4 rounded border-gray-600 bg-[#0a0a0a] text-[#007AFF] focus:ring-[#007AFF] focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    {ram}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Storage Filter */}
        <div className="mb-6 pb-6 border-b border-gray-800">
          <button
            onClick={() => toggleSection('storage')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-gray-300">Ổ Cứng</span>
            {expandedSections.storage ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.storage && (
            <div className="space-y-2">
              {storageOptions.map(storage => (
                <label key={storage} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.storage.includes(storage)}
                    onChange={() => handleStorageToggle(storage)}
                    className="w-4 h-4 rounded border-gray-600 bg-[#0a0a0a] text-[#007AFF] focus:ring-[#007AFF] focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    {storage}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Colors Filter */}
        <div>
          <button
            onClick={() => toggleSection('colors')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-gray-300">Màu Sắc</span>
            {expandedSections.colors ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.colors && (
            <div className="space-y-2">
              {colorOptions.map(color => (
                <label key={color} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color)}
                    onChange={() => handleColorToggle(color)}
                    className="w-4 h-4 rounded border-gray-600 bg-[#0a0a0a] text-[#007AFF] focus:ring-[#007AFF] focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    {color}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

import React, { useState } from 'react';
import './FilterBar.css';

interface FilterBarProps {
    brands: Array<{ brand_id: number; brand_name: string }>;
    categories: Array<{ category_id: number; category_name: string }>;
    onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
    brands: number[];
    priceRange: [number, number];
    categories: number[];
    sortBy: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ brands, categories, onFilterChange }) => {
    const [filters, setFilters] = useState<FilterState>({
        brands: [],
        priceRange: [9_990_000, 147_290_000],
        categories: [],
        sortBy: 'newest'
    });

    const MIN_PRICE = 9_990_000;
    const MAX_PRICE = 147_290_000;

    // Xử lý thay đổi checkbox thương hiệu
    const handleBrandChange = (brandId: number) => {
        const newBrands = filters.brands.includes(brandId)
            ? filters.brands.filter(id => id !== brandId)
            : [...filters.brands, brandId];

        const newFilters: FilterState = { ...filters, brands: newBrands };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    // Xử lý thay đổi checkbox danh mục
    const handleCategoryChange = (categoryId: number) => {
        const newCategories = filters.categories.includes(categoryId)
            ? filters.categories.filter(id => id !== categoryId)
            : [...filters.categories, categoryId];

        const newFilters: FilterState = { ...filters, categories: newCategories };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    // Xử lý thay đổi khoảng giá
    const handlePriceChange = (min: number, max: number) => {
        const newFilters: FilterState = { ...filters, priceRange: [min, max] };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    // Xử lý sắp xếp
    const handleSortChange = (sortBy: string) => {
        const newFilters: FilterState = { ...filters, sortBy };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    // Xóa tất cả filter
    const handleClearFilters = () => {
        const newFilters: FilterState = {
            brands: [],
            priceRange: [MIN_PRICE, MAX_PRICE],
            categories: [],
            sortBy: 'newest'
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="filter-bar">
            <div className="filter-header">
                <h2>🔍 Bộ lọc tìm kiếm</h2>
                <button className="clear-filters" onClick={handleClearFilters}>
                    Xóa tất cả
                </button>
            </div>

            {/* Sắp xếp */}
            <div className="filter-section">
                <h3>Sắp xếp</h3>
                <div className="sort-options">
                    <label>
                        <input
                            type="radio"
                            name="sort"
                            value="newest"
                            checked={filters.sortBy === 'newest'}
                            onChange={(e) => handleSortChange(e.target.value)}
                        />
                        Mới nhất
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="sort"
                            value="price-asc"
                            checked={filters.sortBy === 'price-asc'}
                            onChange={(e) => handleSortChange(e.target.value)}
                        />
                        Giá tăng dần
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="sort"
                            value="price-desc"
                            checked={filters.sortBy === 'price-desc'}
                            onChange={(e) => handleSortChange(e.target.value)}
                        />
                        Giá giảm dần
                    </label>
                </div>
            </div>

            {/* Hãng sản xuất */}
            <div className="filter-section">
                <h3>Hãng sản xuất</h3>
                <div className="brand-list">
                    {brands.map(brand => (
                        <label key={brand.brand_id} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={filters.brands.includes(brand.brand_id)}
                                onChange={() => handleBrandChange(brand.brand_id)}
                            />
                            {brand.brand_name}
                        </label>
                    ))}
                </div>
            </div>

            {/* Danh mục */}
            <div className="filter-section">
                <h3>Danh mục</h3>
                <div className="category-list">
                    {categories.map(category => (
                        <label key={category.category_id} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(category.category_id)}
                                onChange={() => handleCategoryChange(category.category_id)}
                            />
                            {category.category_name}
                        </label>
                    ))}
                </div>
            </div>

            {/* Khoảng giá */}
            <div className="filter-section">
                <h3>Mức giá</h3>
                <div className="price-range">
                    <div className="price-inputs">
                        <input
                            type="number"
                            placeholder="Từ"
                            value={filters.priceRange[0]}
                            onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
                            className="price-input"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Đến"
                            value={filters.priceRange[1]}
                            onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                            className="price-input"
                        />
                    </div>
                    <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        value={filters.priceRange[0]}
                        onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
                        className="price-slider"
                    />
                    <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        value={filters.priceRange[1]}
                        onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                        className="price-slider"
                    />
                    <div className="price-display">
                        {filters.priceRange[0].toLocaleString()}đ ~ {filters.priceRange[1].toLocaleString()}đ
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
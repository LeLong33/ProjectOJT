import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import ProductList from '../components/ProductList';
import './ProductsPage.css';

interface FilterState {
    brands: number[];
    priceRange: [number, number];
    categories: number[];
    sortBy: string;
}

const ProductsPage: React.FC = () => {
    const [filters, setFilters] = useState<FilterState>({
        brands: [],
        priceRange: [9_990_000, 147_290_000],
        categories: [],
        sortBy: 'newest'
    });

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    // Lấy danh sách thương hiệu và danh mục
    useEffect(() => {
        const fetchData = async () => {
            try {
                const brandsRes = await fetch('/api/brands');
                const brandsData = await brandsRes.json();
                setBrands(brandsData.data || []);

                const categoriesRes = await fetch('/api/categories');
                const categoriesData = await categoriesRes.json();
                setCategories(categoriesData.data || []);
            } catch (err) {
                console.error('Lỗi lấy dữ liệu:', err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="products-page">
            <div className="page-container">
                <FilterBar 
                    brands={brands}
                    categories={categories}
                    onFilterChange={setFilters}
                />
                <ProductList filters={filters} />
            </div>
        </div>
    );
};

export default ProductsPage;
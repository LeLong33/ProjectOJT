import React, { useState, useEffect } from 'react';
import './ProductList.css';

interface Product {
    product_id: number;
    product_name: string;
    product_image: string;
    price: number;
    discount_percent?: number;
    brand_id: number;
    category_id: number;
    rating?: number;
}

interface ProductListProps {
    filters: {
        brands: number[];
        priceRange: [number, number];
        categories: number[];
        sortBy: string;
    };
}

const ProductList: React.FC<ProductListProps> = ({ filters }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Lấy danh sách sản phẩm từ API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data.data || []);
                setLoading(false);
            } catch (err) {
                console.error('Lỗi lấy sản phẩm:', err);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Lọc sản phẩm dựa trên filters
    useEffect(() => {
        let result = [...products];

        // Lọc theo thương hiệu
        if (filters.brands.length > 0) {
            result = result.filter(p => filters.brands.includes(p.brand_id));
        }

        // Lọc theo giá
        result = result.filter(p => {
            const price = p.price * (1 - (p.discount_percent || 0) / 100);
            return price >= filters.priceRange[0] && price <= filters.priceRange[1];
        });

        // Lọc theo danh mục
        if (filters.categories.length > 0) {
            result = result.filter(p => filters.categories.includes(p.category_id));
        }

        // Sắp xếp
        if (filters.sortBy === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        } else if (filters.sortBy === 'newest') {
            result.sort((a, b) => b.product_id - a.product_id);
        }

        setFilteredProducts(result);
    }, [products, filters]);

    const handleAddToCart = (product: Product) => {
        console.log('Thêm vào giỏ hàng:', product);
        // Gọi API thêm vào giỏ hàng
    };

    if (loading) {
        return <div className="loading">Đang tải sản phẩm...</div>;
    }

    return (
        <div className="product-list">
            <div className="product-count">
                Tìm thấy {filteredProducts.length} kết quả
            </div>

            <div className="products-grid">
                {filteredProducts.map(product => {
                    const discountedPrice = product.price * (1 - (product.discount_percent || 0) / 100);
                    
                    return (
                        <div key={product.product_id} className="product-card">
                            <div className="product-image">
                                <img src={product.product_image} alt={product.product_name} />
                                {product.discount_percent && (
                                    <div className="discount-badge">
                                        -{product.discount_percent}%
                                    </div>
                                )}
                            </div>

                            <div className="product-info">
                                <h3 className="product-name">{product.product_name}</h3>
                                
                                <div className="price-section">
                                    {product.discount_percent ? (
                                        <>
                                            <span className="original-price">
                                                {product.price.toLocaleString()}đ
                                            </span>
                                            <span className="discount-price">
                                                {Math.floor(discountedPrice).toLocaleString()}đ
                                            </span>
                                        </>
                                    ) : (
                                        <span className="current-price">
                                            {product.price.toLocaleString()}đ
                                        </span>
                                    )}
                                </div>

                                {product.rating && (
                                    <div className="rating">
                                        ⭐ {product.rating}/5
                                    </div>
                                )}

                                <button 
                                    className="add-to-cart-btn"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <div className="no-products">
                    Không tìm thấy sản phẩm phù hợp với bộ lọc
                </div>
            )}
        </div>
    );
};

export default ProductList;
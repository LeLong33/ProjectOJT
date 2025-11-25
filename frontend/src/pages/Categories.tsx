import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import type { Category } from '../types/product';
import CategoryCard from '../components/CategoryCard'; 

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axiosClient.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error("Lỗi tải danh mục", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Danh Mục Sản Phẩm</h2>
      {loading ? <p>Đang tải...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
        </div>
      )}
    </div>
  );
};

export default Categories;
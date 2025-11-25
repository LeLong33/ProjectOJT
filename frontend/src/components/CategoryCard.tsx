// src/components/CategoryCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../types/product';

interface Props {
  category: Category;
}

const CategoryCard: React.FC<Props> = ({ category }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
      <img 
        src={category.image} 
        alt={category.name} 
        style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
      />
      <h3>{category.name}</h3>
      <Link to={`/category/${category.slug}`} style={{ color: 'blue', textDecoration: 'none' }}>
        Xem ngay
      </Link>
    </div>
  );
};

export default CategoryCard;
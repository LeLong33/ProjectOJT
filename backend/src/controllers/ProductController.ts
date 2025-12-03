import { Request, Response } from 'express';
import db from '../config/database'; 

interface Product {
  product_id: number;
  name: string;
  price: number;
  brand_id: number;
  category_id: number;
  description: string;
}

/**
 * @route GET /api/products
 * @description
 * @access
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const query = 'SELECT product_id, name, price, brand_id, category_id, description FROM products';
    const [rows] = await db.query(query);

    // Ép kiểu (cast) dữ liệu nhận được thành kiểu Product[]
    const products: Product[] = rows as Product[];

    if (products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy sản phẩm nào trong cơ sở dữ liệu.' 
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    if (error instanceof Error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error.message);
    } else {
        console.error('Lỗi không xác định khi lấy danh sách sản phẩm:', error);
    }
    res.status(500).json({ 
      success: false,
      message: 'Lỗi máy chủ nội bộ. Vui lòng kiểm tra kết nối DB và câu truy vấn.',
      error: error
    });
  }
};
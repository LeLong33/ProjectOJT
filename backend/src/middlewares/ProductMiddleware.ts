// backend/src/middlewares/ProductMiddleware.ts

import { authorizeRoles } from "./authMiddleware";

/**
 * Middleware phân quyền cho CRUD sản phẩm.
 * Chỉ admin và staff được phép thực hiện các hành động:
 *  - Tạo sản phẩm
 *  - Cập nhật sản phẩm
 *  - Xóa sản phẩm
 *
 * Tái sử dụng hàm authorizeRoles() để tránh trùng logic.
 */
export const allowProductCRUD = authorizeRoles('admin', 'staff');

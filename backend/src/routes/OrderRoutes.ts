// backend/src/routes/OrderRoutes.ts
import {RequestHandler, Router} from "express";
import * as OrderController from "../controllers/OrderController";
import { allowAdmin, allowStaff, allowUser } from "../middlewares/OrderMiddleware";

const router = Router();

// USER – xem đơn hàng của mình
router.get("/my-orders", allowUser as RequestHandler, OrderController.getMyOrders as RequestHandler);

// CREATE ORDER (public checkout, không cần đăng nhập)
router.post("/", OrderController.createOrder as RequestHandler);

// STAFF + ADMIN – xem danh sách đơn hàng
router.get("/", allowStaff as RequestHandler, OrderController.getAllOrders as RequestHandler);

// STAFF + ADMIN – cập nhật trạng thái
router.put("/:id/status", allowStaff as RequestHandler, OrderController.updateStatus as RequestHandler);

// ADMIN ONLY – xóa đơn hàng
router.delete("/:id", allowAdmin as RequestHandler, OrderController.deleteOrder as RequestHandler);

// ANY LOGGED USER – xem chi tiết đơn hàng
router.get("/:id", allowUser as RequestHandler, OrderController.getOrderById as RequestHandler);

export default router;

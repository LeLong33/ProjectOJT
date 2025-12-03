import {RequestHandler, Router} from "express";
import * as CartController from "../controllers/CartController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", protect as RequestHandler, CartController.getMyCart);
router.post("/", protect as RequestHandler, CartController.addItem);
router.put("/", protect as RequestHandler, CartController.updateItem);
router.delete("/:productId", protect as RequestHandler, CartController.removeItem);
router.delete("/", protect as RequestHandler, CartController.clear);

export default router;

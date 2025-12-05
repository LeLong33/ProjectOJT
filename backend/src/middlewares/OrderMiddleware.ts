// backend/src/middlewares/OrderMiddleware.ts
import { Request, Response, NextFunction } from "express";
import {getUserFromToken} from "../utils/auth";

export function allowUser(req: Request, res: Response, next: NextFunction) {
    try {
        getUserFromToken(req);
        next();
    } catch {
        return res.status(401).json({ message: "Bạn cần đăng nhập" });
    }
}

export function allowStaff(req: Request, res: Response, next: NextFunction) {
    try {
        const user = getUserFromToken(req);

        if (user.role !== "staff" && user.role !== "admin") {
            return res.status(403).json({ message: "Chỉ nhân viên hoặc admin được phép" });
        }

        next();
    } catch {
        return res.status(401).json({ message: "Bạn cần đăng nhập" });
    }
}

export function allowAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const user = getUserFromToken(req);

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Chỉ admin được phép" });
        }

        next();
    } catch {
        return res.status(401).json({ message: "Bạn cần đăng nhập" });
    }
}

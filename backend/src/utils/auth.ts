import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export function getUserFromToken(req: any) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) throw new Error("Token missing");

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded; // trả về { id, account_id, role, name }
}

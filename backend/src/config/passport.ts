// backend/src/config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as AccountModel from '../models/AccountModel';
import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL!;

// 1. Cấu hình Google Strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'] // Yêu cầu lấy thông tin hồ sơ và email
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0].value;
        const name = profile.displayName || profile.name?.givenName || 'Google User';

        if (!email) {
            return done(new Error("Không thể lấy email từ Google."), undefined);
        }

        // 2. Tìm hoặc Tạo tài khoản trong DB (Hàm sẽ được thêm vào AccountModel)
        const account = await AccountModel.findOrCreateGoogleUser(email, name);

        // 3. Trả về thông tin tài khoản đã xác thực
        return done(null, account);

    } catch (error) {
        return done(error as Error, undefined);
    }
}));

// 2. Serialize/Deserialize (Cần thiết cho Passport Session - Dù ta chủ yếu dùng JWT)
// Passport cần cơ chế này để biết cách lưu trữ thông tin user vào session.
passport.serializeUser((user: any, done) => {
    done(null, user.account_id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        // Tìm lại user từ ID nếu cần (thường dùng trong context session/cookie)
        const account = await AccountModel.findById(id); 
        done(null, account);
    } catch (error) {
        done(error as Error, undefined);
    }
});

export default passport;
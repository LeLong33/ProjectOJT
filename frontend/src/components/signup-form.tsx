import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from 'lucide-react';
import { useState, type FormEvent } from 'react'; // Import FormEvent as type
import axios from 'axios'; // Import axios

// Lấy API URL từ biến môi trường của Frontend (ví dụ: VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; 

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Kiểm tra tối thiểu 6 ký tự mật khẩu (Backend cũng kiểm tra)
            if (formData.password.length < 6) {
                setError('Mật khẩu phải có ít nhất 6 ký tự.');
                setLoading(false);
                return;
            }

            const response = await axios.post(`${API_URL}/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber, // Backend mong đợi 'phoneNumber'
            });

            if (response.data.success) {
                setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang Đăng nhập...');
                // Tùy chọn: Lưu token và chuyển hướng người dùng
                localStorage.setItem('token', response.data.token);
                window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
            }
        } catch (err) {
            console.error('Lỗi Đăng ký:', err);
            // Xử lý lỗi từ Backend (ví dụ: Email đã tồn tại)
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            } else {
                setError('Lỗi kết nối máy chủ.');
            }
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen bg-gray-50", className)} {...props}>
      <Card className="overflow-hidden p-0 max-w-sm w-full shadow-lg border-none">
        <CardContent className="p-0">
          
          <form className="p-8 space-y-6" onSubmit={handleSubmit}> 
            {/* Tiêu đề */}
            <div className="flex flex-col items-center gap-2 text-center mb-6">
                <h1 className="text-3xl font-bold text-red-600">Đăng Ký Tài Khoản Mới</h1>
            </div>
            
            {error && <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">{error}</div>}
            {success && <div className="p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg">{success}</div>}

            <FieldGroup>
                {/* 1. Trường Email */}
                <Field>
                    <FieldLabel htmlFor="email" className="text-gray-800 font-normal">Địa chỉ Email</FieldLabel>
                    <Input
                        id="email" // Thay đổi ID để khớp với state
                        type="email"
                        placeholder="vd: ban@example.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="h-12 border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                </Field>

                {/* 2. Trường Tên */}
                <Field>
                    <FieldLabel htmlFor="name" className="text-gray-800 font-normal">Họ và Tên</FieldLabel>
                    <Input
                        id="name" // Thay đổi ID để khớp với state
                        type="text"
                        placeholder="Nhập họ và tên của bạn"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="h-12 border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                </Field>

                {/* 3. Trường Số điện thoại */}
                <Field>
                    <FieldLabel htmlFor="phoneNumber" className="text-gray-800 font-normal">Số điện thoại</FieldLabel>
                    <Input
                        id="phoneNumber" // Thay đổi ID để khớp với state
                        type="tel"
                        placeholder="Nhập số điện thoại của bạn"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="h-12 border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                </Field>

                {/* 4. Trường Mật khẩu */}
                <Field>
                    <FieldLabel htmlFor="password" className="text-gray-800 font-normal">Mật khẩu</FieldLabel>
                    <div className="relative">
                        <Input 
                            id="password" // Thay đổi ID để khớp với state
                            type={showPassword ? "text" : "password"} 
                            placeholder="Ít nhất 6 ký tự"
                            required 
                            value={formData.password}
                            onChange={handleChange}
                            className="h-12 border-gray-300 focus:border-red-600 focus:ring-red-600 pr-10"
                        />
                        {/* Icon ẩn/hiện mật khẩu */}
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            disabled={loading}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {formData.password && formData.password.length < 6 && (
                        <FieldError className="text-red-500 text-xs mt-1">Mật khẩu phải có ít nhất 6 ký tự.</FieldError>
                    )}
                </Field>

                {/* Nút Đăng ký */}
                <Field className="pt-4">
                    <Button 
                        type="submit" 
                        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-base font-semibold transition duration-150"
                        disabled={loading || formData.password.length < 6}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                    </Button>
                </Field>
                
                {/* Đã có tài khoản? Đăng nhập ngay */}
                <p className="text-center text-sm pt-4">
                    Bạn đã có tài khoản? 
                    <a 
                        href="/login" // Thay đổi đường dẫn đăng nhập thực tế của bạn
                        className="font-semibold text-red-600 hover:text-red-700 hover:underline ml-1"
                    >
                        Đăng nhập ngay
                    </a>
                </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
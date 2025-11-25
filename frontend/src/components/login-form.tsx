import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from 'lucide-react'; // Sử dụng icon để mô phỏng chức năng ẩn/hiện mật khẩu
import { useState } from 'react';

// Biểu tượng Google SVG (Đã được làm gọn hơn)
const GoogleIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className="w-5 h-5"
        fill="currentColor"
    >
      <path 
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
);


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [showPassword, setShowPassword] = useState(false);

  return (
    // Đặt card giữa màn hình và tối ưu hóa cho giao diện mẫu
    <div className={cn("flex flex-col items-center justify-center min-h-screen bg-gray-50", className)} {...props}>
        {/* Card được thiết kế đơn giản, tập trung vào form */}
      <Card className="overflow-hidden p-0 max-w-sm w-full shadow-lg border-none">
        <CardContent className="p-0">
          
            {/* Form chính */}
            <form className="p-8 space-y-6"> 
                {/* Tiêu đề */}
                <div className="flex flex-col items-center gap-2 text-center mb-6">
                    <h1 className="text-3xl font-bold text-red-600">Đăng nhập TECHSTORE</h1>
                </div>
                
                <FieldGroup>
                    {/* Trường email */}
                    <Field>
                        <FieldLabel htmlFor="phone" className="text-gray-800 font-normal">Email</FieldLabel>
                        <Input
                            id="email"
                            type=""
                            placeholder="Nhập email của bạn"
                            required
                            className="h-12 border-gray-300 focus:border-red-600 focus:ring-red-600"
                        />
                    </Field>

                    {/* Trường Mật khẩu */}
                    <Field>
                        <FieldLabel htmlFor="password-input" className="text-gray-800 font-normal">Mật khẩu</FieldLabel>
                        <div className="relative">
                            <Input 
                                id="password-input" 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Nhập mật khẩu của bạn"
                                required 
                                className="h-12 border-gray-300 focus:border-red-600 focus:ring-red-600 pr-10" // Thêm padding-right cho icon
                            />
                            {/* Icon ẩn/hiện mật khẩu */}
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </Field>

                    {/* Nút Đăng nhập */}
                    <Field className="pt-2">
                        <Button 
                            type="submit" 
                            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-base font-semibold transition duration-150"
                        >
                            Đăng nhập
                        </Button>
                    </Field>
                    
                    {/* Quên mật khẩu? */}
                    <p className="text-center">
                        <a 
                            href="#" 
                            className="text-red-600 hover:text-red-700 font-medium underline-offset-4 hover:underline"
                        >
                            Quên mật khẩu?
                        </a>
                    </p>

                    {/* Hoặc đăng nhập bằng */}
                    <FieldSeparator className="py-2 *:data-[slot=field-separator-content]:bg-white text-gray-500 text-sm">
                        Hoặc đăng nhập bằng
                    </FieldSeparator>
                    
                    {/* Nút Đăng nhập bằng Google */}
                    <Field className="grid grid-cols-1 gap-4">
                        {/* Nút Google */}
                        <Button 
                            variant="outline" 
                            type="button"
                            className="h-12 border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-3"
                        >
                            <GoogleIcon />
                            <span className="text-base font-normal">Google</span>
                            <span className="sr-only">Login with Google</span>
                        </Button>
                        
                        {/* 🚫 LOẠI BỎ: Nút Zalo (theo yêu cầu) */}
                        {/* <Button variant="outline" type="button" disabled>Zalo</Button> */}
                    </Field>
                    
                    {/* Chưa có tài khoản? Đăng ký ngay */}
                    <p className="text-center text-sm pt-4">
                        Bạn chưa có tài khoản? 
                        <a 
                            href="/signup" // Thay đổi đường dẫn đăng ký thực tế của bạn
                            className="font-semibold text-red-600 hover:text-red-700 hover:underline ml-1"
                        >
                            Đăng ký ngay
                        </a>
                    </p>
                </FieldGroup>
            </form>
            
            {/* 🚫 LOẠI BỎ: Phần hình ảnh chia đôi (md:block) đã bị loại bỏ */}
            {/* 🚫 LOẠI BỎ: FieldDescription (Terms of Service) đã bị loại bỏ */}
        </CardContent>
      </Card>
    </div>
  )
}
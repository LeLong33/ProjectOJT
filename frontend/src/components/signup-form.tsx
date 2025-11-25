import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen bg-gray-50", className)} {...props}>
      <Card className="overflow-hidden p-0 max-w-sm w-full shadow-lg border-none">
        <CardContent className="p-0">
          
            <form className="p-8 space-y-6"> 
                {/* Tiêu đề */}
                <div className="flex flex-col items-center gap-2 text-center mb-6">
                    <h1 className="text-3xl font-bold text-red-600">Đăng Ký Tài Khoản Mới</h1>
                </div>
                
                <FieldGroup>
                    {/* 1. Trường Email */}
                    <Field>
                        <FieldLabel htmlFor="regEmail" className="text-gray-800 font-normal">Địa chỉ Email</FieldLabel>
                        <Input
                            id="regEmail"
                            type="email"
                            placeholder="vd: ban@example.com"
                            required
                            className="h-12 border-gray-300 focus:border-red-600 focus:ring-red-600"
                        />
                    </Field>

                    {/* 2. Trường Tên */}
                    <Field>
                        <FieldLabel htmlFor="regName" className="text-gray-800 font-normal">Họ và Tên</FieldLabel>
                        <Input
                            id="regName"
                            type="text"
                            placeholder="Nhập họ và tên của bạn"
                            required
                            className="h-12 border-gray-300 focus:border-red-600 focus:ring-red-600"
                        />
                    </Field>

                    {/* 3. Trường Số điện thoại */}
                    <Field>
                        <FieldLabel htmlFor="regPhone" className="text-gray-800 font-normal">Số điện thoại</FieldLabel>
                        <Input
                            id="regPhone"
                            type="tel"
                            placeholder="Nhập số điện thoại của bạn"
                            required
                            className="h-12 border-gray-300 focus:border-red-600 focus:ring-red-600"
                        />
                    </Field>

                    {/* 4. Trường Mật khẩu */}
                    <Field>
                        <FieldLabel htmlFor="regPasswordInput" className="text-gray-800 font-normal">Mật khẩu</FieldLabel>
                        <div className="relative">
                            <Input 
                                id="regPasswordInput" 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Ít nhất 6 ký tự"
                                required 
                                className="h-12 border-gray-300 focus:border-red-600 focus:ring-red-600 pr-10"
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

                    {/* Nút Đăng ký */}
                    <Field className="pt-4">
                        <Button 
                            type="submit" 
                            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-base font-semibold transition duration-150"
                        >
                            Đăng Ký
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
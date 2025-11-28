import React, { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { forgotPassword, isLoading, error } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    const success = await forgotPassword(email);
    
    if (success) {
      setMessage('Vui lòng kiểm tra email để đặt lại mật khẩu.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Card className="overflow-hidden p-0 max-w-sm w-full shadow-lg border-none">
        <CardContent className="p-0">
          
          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-2 text-center mb-6">
                <h1 className="text-3xl font-bold text-red-600">Quên Mật Khẩu</h1>
                <p className="text-sm text-gray-500">
                    Nhập email đã đăng ký của bạn. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
                </p>
            </div>

            {/* Hiển thị lỗi */}
            {error && (
                <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            {/* Hiển thị thông báo thành công */}
            {message && (
                <div className="p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg">
                    {message}
                </div>
            )}

            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email" className="text-gray-800 font-normal">Email</FieldLabel>
                    <Input 
                        id="email"
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        placeholder="example@mail.com"
                        className="h-12 border-gray-300 focus:border-red-600 focus:ring-red-600"
                    />
                </Field>

                <Field className="pt-2">
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-base font-semibold transition duration-150"
                    >
                        {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </Button>
                </Field>

                <p className="text-center text-sm pt-4 text-gray-600">
                    Đã nhớ mật khẩu? 
                    <Link 
                        to="/login" 
                        className="font-semibold text-red-600 hover:text-red-700 hover:underline ml-1"
                    >
                        Đăng nhập ngay
                    </Link>
                </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
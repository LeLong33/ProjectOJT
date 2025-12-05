import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Navbar } from '@/pages/Navbar'
import { Footer } from '@/pages/Footer'

function formatPrice(price?: number) {
  if (typeof price !== 'number') return ''
  try {
    const s = Math.round(price).toLocaleString('vi-VN')
    return `${s} đ`
  } catch (e) {
    return String(price) + ' đ'
  }
}

export default function CartPage() {
  const { cartItems, cartCount, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart()
  const shipping = 200000

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar cartCount={cartCount} />
        <div className="max-w-6xl mx-auto px-6 pt-28">
          <h2 className="text-3xl font-semibold mb-4">Giỏ hàng của bạn</h2>
          <div className="p-8 bg-[#111] rounded-lg text-gray-300">Giỏ hàng đang trống. <Link to="/" className="text-blue-400 underline">Tiếp tục mua sắm</Link></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar cartCount={cartCount} />
      <div className="max-w-6xl mx-auto px-6 pt-28">
        <h2 className="text-3xl font-semibold mb-6">Giỏ Hàng ({cartCount})</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map(item => (
              <div key={item.product_id} className="flex items-center gap-6 p-4 bg-[#0f0f10] border border-gray-800 rounded-xl">
                <img src={item.image_url || 'https://via.placeholder.com/160'} alt={item.name} className="w-28 h-28 object-contain bg-white/5 rounded" />

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="max-w-[60%]">
                      <div className="font-medium text-lg">{item.name}</div>
                      <div className="text-sm text-gray-400 mt-2">Mô tả ngắn hoặc thông tin phụ</div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 text-lg font-semibold">{formatPrice(item.price)}</div>
                      <div className="text-sm text-gray-400 mt-2">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-md bg-transparent border border-gray-800">
                      <button onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))} className="px-3 py-2 text-gray-300">-</button>
                      <div className="px-4 py-2 bg-[#0b0b0b] text-white">{item.quantity}</div>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="px-3 py-2 text-gray-300">+</button>
                    </div>

                    <div className="flex items-center gap-4">
                      <button onClick={() => removeFromCart(item.product_id)} className="text-gray-400 hover:text-red-400"><Trash className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between mt-4">
              <button onClick={() => clearCart()} className="text-sm text-gray-400 underline">Xóa tất cả</button>
              <Link to="/" className="text-sm text-blue-400 underline">Tiếp tục mua sắm</Link>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="p-6 bg-[#0f0f10] border border-gray-800 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Tóm Tắt Đơn Hàng</h3>
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <div>Tạm tính</div>
                <div>{formatPrice(totalAmount)}</div>
              </div>
              <div className="flex items-center justify-between text-gray-400 mb-4">
                <div>Phí vận chuyển</div>
                <div>{formatPrice(shipping)}</div>
              </div>

              <div className="border-t border-gray-800 pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-gray-300">Tổng cộng</div>
                  <div className="text-blue-400 text-xl font-bold">{formatPrice(totalAmount + shipping)}</div>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-3">Tiến hành thanh toán</Button>
              <Button className="w-full bg-transparent border border-gray-800 text-gray-300">Tiếp tục mua sắm</Button>

              <div className="mt-6 text-sm text-gray-400 space-y-2">
                <div>✓ Bảo hành chính hãng</div>
                <div>✓ Đổi trả trong 7 ngày</div>
                <div>✓ Hỗ trợ 24/7</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  )
}

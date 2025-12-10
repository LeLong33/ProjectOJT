import React, { useState, useEffect } from 'react';
import { Eye, Trash2, X, Package, RefreshCw } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

interface Order {
  order_id: number;
  account_id?: number;
  status: string;
  total_amount: number;
  final_amount: number;
  payment_method: string;
  isPaid: boolean | number;
  createdAt: string;
  guest_name?: string;
  guest_phone?: string;
  recipient_name?: string;
  phone_number?: string;
  address?: string;
  district?: string;
  city?: string;
}

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price_at_order: number;
}

interface OrderDetail extends Order {
  items?: OrderItem[];
}

export function OrderCRUD() {
  const api = useApi();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã giao':
      case 'Đã nhận':
        return 'bg-green-500/20 text-green-500';
      case 'Đang giao':
        return 'bg-blue-500/20 text-blue-500';
      case 'Chờ xác nhận':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Đã hủy':
        return 'bg-red-500/20 text-red-500';
      case 'Đã xác nhận':
        return 'bg-purple-500/20 text-purple-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setMessage('');
    try {
      // ✅ SỬA: Gọi đúng endpoint theo routes: /api/orders/admin/all
      const res = await api.get('/orders/admin/all');
      const data = res.data?.data ?? res.data;
      
      console.log('📥 Fetched orders:', data);
      
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      const error = err as any;
      console.error('❌ Fetch orders error:', error);
      setMessage(`❌ Lỗi tải đơn hàng: ${error.response?.data?.message ?? error.message ?? 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetail = async (order: Order) => {
    setIsDetailOpen(true);
    setLoadingDetail(true);
    setSelectedOrder(order);
    
    try {
      // ✅ SỬA: Gọi endpoint chi tiết đơn hàng (cho user): /api/orders/:id
      const res = await api.get(`/orders/${order.order_id}`);
      const detailData = res.data?.data ?? res.data;
      
      console.log('📥 Order detail:', detailData);
      
      setSelectedOrder(detailData);
    } catch (err) {
      const error = err as any;
      console.error('❌ Fetch order detail error:', error);
      setMessage(`❌ Lỗi tải chi tiết: ${error.response?.data?.message ?? error.message ?? 'Lỗi không xác định'}`);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setMessage('');
    try {
      // ✅ SỬA: Gọi đúng endpoint theo routes: /api/orders/admin/:orderId/status
      const res = await api.put(`/orders/admin/${orderId}/status`, { status: newStatus });
      
      console.log('✅ Update status response:', res.data);
      
      setMessage(res.data?.message ?? '✅ Cập nhật trạng thái thành công');
      
      // Cập nhật state local
      setOrders(orders.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
      
      if (selectedOrder && selectedOrder.order_id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      const error = err as any;
      console.error('❌ Update order status error:', error);
      setMessage(`❌ Lỗi cập nhật: ${error.response?.data?.message ?? error.message ?? 'Lỗi không xác định'}`);
    }
  };

  const handleDelete = async (orderId: number) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${orderId}?`)) return;
    setMessage('');
    try {
      // ✅ SỬA: Gọi đúng endpoint theo routes: /api/orders/admin/:orderId
      const res = await api.delete(`/orders/admin/${orderId}`);
      
      console.log('✅ Delete response:', res.data);
      
      setMessage(res.data?.message ?? '✅ Xóa đơn hàng thành công');
      await fetchOrders();
      if (isDetailOpen) setIsDetailOpen(false);
    } catch (err) {
      const error = err as any;
      console.error('❌ Delete order error:', error);
      setMessage(`❌ Lỗi xóa: ${error.response?.data?.message ?? error.message ?? 'Lỗi không xác định'}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">Quản lý đơn hàng</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-[#0a0a0a] transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
          <span className="text-sm text-gray-400">Tổng: {orders.length} đơn</span>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('❌') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Mã đơn</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Khách hàng</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">SĐT</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Địa chỉ</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Tổng tiền</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Thanh toán</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Trạng thái</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Ngày</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-400">
                    Đang tải...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-400">
                    Chưa có đơn hàng
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.order_id} className="border-b border-gray-800 last:border-0 hover:bg-[#0a0a0a]">
                    <td className="py-3 px-4 font-mono text-sm">#{order.order_id}</td>
                    <td className="py-3 px-4">
                      {order.recipient_name || order.guest_name || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {order.phone_number || order.guest_phone || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-400 max-w-[200px] truncate">
                      {order.address ? `${order.address}, ${order.city || ''}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-[#007AFF]">
                      {formatPrice(order.final_amount || order.total_amount)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400">{order.payment_method || '-'}</span>
                        <span className={`text-xs ${(order.isPaid === 1 || order.isPaid === true) ? 'text-green-400' : 'text-yellow-400'}`}>
                          {(order.isPaid === 1 || order.isPaid === true) ? '✓ Đã thanh toán' : '⏳ Chưa thanh toán'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="p-2 hover:bg-[#0a0a0a] rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.order_id)}
                          className="p-2 hover:bg-[#0a0a0a] rounded transition-colors text-red-400"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-[#007AFF]" />
                <div>
                  <h3 className="text-xl">Chi tiết đơn hàng #{selectedOrder.order_id}</h3>
                  <p className="text-sm text-gray-400">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="p-2 hover:bg-[#0a0a0a] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetail ? (
              <div className="text-center py-8 text-gray-400">Đang tải...</div>
            ) : (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-black/50 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400 mb-3">Thông tin khách hàng</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Tên khách hàng</p>
                      <p className="text-sm">
                        {selectedOrder.recipient_name || selectedOrder.guest_name || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Số điện thoại</p>
                      <p className="text-sm">
                        {selectedOrder.phone_number || selectedOrder.guest_phone || '-'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Địa chỉ giao hàng</p>
                      <p className="text-sm">
                        {selectedOrder.address 
                          ? `${selectedOrder.address}, ${selectedOrder.district ? selectedOrder.district + ', ' : ''}${selectedOrder.city || ''}` 
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="bg-black/50 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-400 mb-3">Sản phẩm đã đặt</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.product_name}</p>
                            <p className="text-xs text-gray-500">
                              Số lượng: {item.quantity} × {formatPrice(item.price_at_order)}
                            </p>
                          </div>
                          <p className="text-sm text-[#007AFF] font-medium">
                            {formatPrice(item.price_at_order * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div className="bg-black/50 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400 mb-3">Thanh toán</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Tổng tiền hàng</span>
                      <span className="text-sm">{formatPrice(selectedOrder.total_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Phương thức thanh toán</span>
                      <span className="text-sm">{selectedOrder.payment_method || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Trạng thái thanh toán</span>
                      <span className={`text-sm ${(selectedOrder.isPaid === 1 || selectedOrder.isPaid === true) ? 'text-green-400' : 'text-yellow-400'}`}>
                        {(selectedOrder.isPaid === 1 || selectedOrder.isPaid === true) ? '✓ Đã thanh toán' : '⏳ Chưa thanh toán'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-800">
                      <span className="font-medium">Tổng thanh toán</span>
                      <span className="text-lg text-[#007AFF] font-medium">
                        {formatPrice(selectedOrder.final_amount || selectedOrder.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-black/50 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-400 mb-3">Cập nhật trạng thái đơn hàng</h4>
                  <div className="mb-3">
                    <span className="text-xs text-gray-500">Trạng thái hiện tại: </span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Chờ xác nhận', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã nhận', 'Đã hủy'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.order_id, status)}
                        disabled={selectedOrder.status === status}
                        className={`px-4 py-2 rounded text-sm transition-colors ${
                          selectedOrder.status === status
                            ? 'bg-[#007AFF] text-white cursor-not-allowed'
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleDelete(selectedOrder.order_id)}
                    className="px-6 py-2 border border-red-500/50 text-red-400 rounded hover:bg-red-500/10 transition-colors"
                  >
                    Xóa đơn hàng
                  </button>
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="px-6 py-2 bg-[#007AFF] rounded hover:bg-[#0051D5] transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
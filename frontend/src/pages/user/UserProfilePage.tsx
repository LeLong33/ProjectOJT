import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/pages/Navbar';
import { Footer } from '@/pages/Footer';
import { Toaster, toast } from 'sonner';
import { 
  User, Package, MapPin, Shield, 
  Settings, Trash2, Plus, Eye, X, LogOut, Lock, Key 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- INTERFACES ---
interface UserProfileData {
  account_id: number;
  name: string;
  email: string;
  phone_number: string;
  date_of_birth: string | null;
}

interface Address {
  address_id: number;
  recipient_name: string;
  phone_number: string;
  address: string;
  district: string;
  city: string;
  country: string;
  is_default: number;
}

interface OrderItem {
    item_id: number;
    product_id: number;
    product_name: string;
    product_image: string;
    quantity: number;
    price_at_order: number;
}

interface OrderDetail {
    order_id: number;
    status: string;
    final_amount: number;
    createdAt: string;
    recipient_name: string;
    phone_number: string;
    address: string;
    city: string;
    items: OrderItem[];
}

interface UserProfilePageProps {
  cartCount: number;
}

export function UserProfilePage({ cartCount }: UserProfilePageProps) {
  const navigate = useNavigate();
  const { logout } = useAuth(); 
  
  // ✅ FIX LỖI 1: Lấy token trực tiếp từ localStorage vì useAuth không trả về token
  const token = localStorage.getItem('token'); 

  // ✅ Đã bỏ 'payment' và 'wishlist' khỏi danh sách tab
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'warranty' | 'settings'>('profile');
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE DATA ---
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  // State thêm địa chỉ
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipient_name: '', phone_number: '', address: '', 
    district: '', city: '', country: 'Vietnam', is_default: false
  });

  // ✅ STATE CHO ĐỔI MẬT KHẨU
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  // --- HELPERS ---
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('vi-VN') : '';
  const getStatusColor = (s: string) => {
    if(s === 'Đang giao') return 'bg-blue-500/20 text-blue-500';
    if(s === 'Đã giao') return 'bg-green-500/20 text-green-500';
    if(s === 'Đã hủy') return 'bg-red-500/20 text-red-500';
    return 'bg-gray-500/20 text-gray-500';
  };

  // --- FETCH DATA ---
  const fetchProfileAndAddress = async () => {
    if (!token) return;
    try {
      const [profileRes, addressRes] = await Promise.all([
        axios.get(`${API_URL}/users/profile`, getAuthHeaders()),
        axios.get(`${API_URL}/users/addresses`, getAuthHeaders())
      ]);
      if (profileRes.data.success) {
        const u = profileRes.data.data;
        // Format ngày sinh YYYY-MM-DD để hiển thị đúng trong input date
        if (u.date_of_birth) u.date_of_birth = u.date_of_birth.split('T')[0];
        setProfile(u);
      }
      if (addressRes.data.success) setAddresses(addressRes.data.data);
    } catch (error: any) {
      if (error.response?.status === 401) { logout(); navigate('/login'); }
    }
  };

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/orders`, getAuthHeaders());
      if (res.data.success) setOrders(res.data.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    // Gọi API ngay khi vào trang để lấp đầy dữ liệu vào ô trống
    if (activeTab === 'profile' || activeTab === 'addresses') fetchProfileAndAddress();
    if (activeTab === 'orders') fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activeTab]);

  // --- HANDLERS PROFILE ---
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      await axios.put(`${API_URL}/users/profile`, {
        name: profile?.name, phone_number: profile?.phone_number, date_of_birth: profile?.date_of_birth
      }, getAuthHeaders());
      toast.success("Cập nhật thông tin thành công!");
    } catch { toast.error("Lỗi cập nhật."); } finally { setIsLoading(false); }
  };

  // --- HANDLERS ADDRESS ---
  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Xóa địa chỉ này?")) return;
    try {
      await axios.delete(`${API_URL}/users/addresses/${id}`, getAuthHeaders());
      setAddresses(p => p.filter(a => a.address_id !== id));
      toast.success("Đã xóa.");
    } catch { toast.error("Lỗi xóa."); }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await axios.put(`${API_URL}/users/addresses/${id}/default`, {}, getAuthHeaders());
      setAddresses(p => p.map(a => ({ ...a, is_default: a.address_id === id ? 1 : 0 })));
      toast.success("Đã đặt mặc định.");
    } catch { toast.error("Lỗi."); }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users/addresses`, newAddress, getAuthHeaders());
      if (res.data.success) {
        toast.success("Thêm thành công");
        setIsAddingAddress(false);
        fetchProfileAndAddress();
        setNewAddress({ recipient_name: '', phone_number: '', address: '', district: '', city: '', country: 'VN', is_default: false });
      }
    } catch { toast.error("Lỗi thêm địa chỉ."); }
  };

  // --- HANDLER ORDER ---
  const handleViewOrderDetail = async (id: number) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/orders/${id}`, getAuthHeaders());
      if (res.data.success) setSelectedOrder(res.data.data);
    } catch { toast.error("Lỗi xem chi tiết."); } finally { setIsLoading(false); }
  };

  // --- HANDLER PASSWORD ---
  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setIsLoading(true);
      // Gọi API đổi mật khẩu
      const res = await axios.put(`${API_URL}/users/change-password`, {
        currentPassword,
        newPassword
      }, getAuthHeaders());

      if (res.data.success) {
        toast.success("Đổi mật khẩu thành công!");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if(confirm("Bạn chắc chắn muốn đăng xuất?")) { logout(); navigate('/'); }
  };

  const tabs = [
    { id: 'profile' as const, name: 'Thông tin cá nhân', icon: <User className="w-5 h-5" /> },
    { id: 'orders' as const, name: 'Đơn hàng', icon: <Package className="w-5 h-5" /> },
    { id: 'addresses' as const, name: 'Địa chỉ', icon: <MapPin className="w-5 h-5" /> },
    { id: 'warranty' as const, name: 'Bảo hành', icon: <Shield className="w-5 h-5" /> },
    { id: 'settings' as const, name: 'Cài đặt', icon: <Settings className="w-5 h-5" /> },
  ];

  if (!token) return null;
  
  // Hiển thị Loading khi chưa lấy được dữ liệu profile để tránh form bị trống
  if (!profile && activeTab === 'profile') return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Đang tải thông tin...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ✅ FIX LỖI 2: Chỉ truyền cartCount, không truyền các hàm navigate cũ */}
      <Navbar cartCount={cartCount} />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl mb-8">Tài Khoản</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar hiển thị thông tin User */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
                  <div className="w-16 h-16 bg-[#007AFF] rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : <User className="w-8 h-8"/>}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-lg truncate text-white">{profile?.name || 'Tài khoản'}</h3>
                    <p className="text-sm text-gray-400 truncate">{profile?.email}</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === tab.id ? 'bg-[#007AFF] text-white shadow-md' : 'text-gray-400 hover:bg-[#1f1f1f] hover:text-white'}`}>
                      {tab.icon} <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              
              {/* === PROFILE (Thông tin cá nhân & Sửa đổi) === */}
              {activeTab === 'profile' && profile && (
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 animate-in fade-in">
                  <h2 className="text-2xl mb-6 font-bold">Thông Tin Cá Nhân</h2>
                  {/* ✅ INPUT ĐÃ ĐƯỢC GẮN VALUE TỪ STATE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm">Họ và tên</label>
                        <input name="name" value={profile.name||''} onChange={handleProfileChange} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 focus:border-[#007AFF] outline-none transition-colors"/>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm">Email</label>
                        <input value={profile.email} disabled className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"/>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm">Số điện thoại</label>
                        <input name="phone_number" value={profile.phone_number||''} onChange={handleProfileChange} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 focus:border-[#007AFF] outline-none transition-colors"/>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm">Ngày sinh</label>
                        <input type="date" name="date_of_birth" value={profile.date_of_birth||''} onChange={handleProfileChange} className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 focus:border-[#007AFF] outline-none transition-colors"/>
                    </div>
                  </div>
                  <button onClick={handleUpdateProfile} disabled={isLoading} className="mt-8 px-8 py-3 bg-[#007AFF] rounded-lg hover:bg-[#0062cc] transition-colors font-medium disabled:opacity-50">
                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              )}

              {/* === ORDERS === */}
              {activeTab === 'orders' && (
                <div className="space-y-4 animate-in fade-in">
                  {selectedOrder ? (
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
                      <button onClick={()=>setSelectedOrder(null)} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-[#007AFF] transition-colors">← Quay lại danh sách</button>
                      <div className="flex justify-between items-start border-b border-gray-800 pb-6 mb-6">
                        <div><h2 className="text-xl font-bold mb-1">Đơn hàng #{selectedOrder.order_id}</h2><p className="text-gray-400 text-sm">{formatDate(selectedOrder.createdAt)}</p></div>
                        <span className={`px-4 py-2 rounded-full font-medium text-sm ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                      </div>
                      <div className="space-y-4">
                        {selectedOrder.items.map(i => (
                          <div key={i.item_id} className="flex gap-4 bg-[#0a0a0a] p-4 rounded-xl border border-gray-800/50">
                            <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 p-1"><img src={i.product_image} className="w-full h-full object-contain"/></div>
                            <div><p className="font-medium text-lg">{i.product_name}</p><p className="text-gray-400">Số lượng: {i.quantity}</p><p className="text-[#007AFF] font-medium">{formatPrice(i.price_at_order)}</p></div>
                          </div>
                        ))}
                        <div className="pt-4 border-t border-gray-800 flex justify-between items-center"><span className="text-gray-400">Tổng cộng:</span><span className="text-[#007AFF] font-bold text-2xl">{formatPrice(selectedOrder.final_amount)}</span></div>
                      </div>
                    </div>
                  ) : (
                    orders.length === 0 ? <div className="text-center py-12 text-gray-500 bg-[#1a1a1a] rounded-2xl border border-gray-800">Bạn chưa có đơn hàng nào.</div> :
                    orders.map(o => (
                      <div key={o.order_id} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-gray-600 transition-colors">
                        <div><h3 className="font-bold text-lg">Đơn #{o.order_id}</h3><p className="text-sm text-gray-400">{formatDate(o.createdAt)}</p></div>
                        <div className="flex items-center gap-4"><span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(o.status)}`}>{o.status}</span><p className="font-bold text-[#007AFF]">{formatPrice(o.final_amount)}</p><button onClick={()=>handleViewOrderDetail(o.order_id)} className="p-2 hover:bg-white/10 rounded-lg"><Eye className="w-5 h-5"/></button></div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* === ADDRESSES === */}
              {activeTab === 'addresses' && (
                <div className="space-y-4 animate-in fade-in">
                  {isAddingAddress ? (
                    <div className="bg-[#1a1a1a] border border-gray-800 p-6 rounded-2xl">
                       <div className="flex justify-between mb-6"><h3 className="text-xl font-bold">Thêm địa chỉ mới</h3><button onClick={()=>setIsAddingAddress(false)}><X/></button></div>
                       <form onSubmit={handleAddAddress} className="grid gap-4 md:grid-cols-2">
                         <input placeholder="Tên người nhận" value={newAddress.recipient_name} onChange={e=>setNewAddress({...newAddress, recipient_name: e.target.value})} className="bg-[#0a0a0a] border border-gray-700 p-3 rounded-lg outline-none focus:border-[#007AFF]" required/>
                         <input placeholder="Số điện thoại" value={newAddress.phone_number} onChange={e=>setNewAddress({...newAddress, phone_number: e.target.value})} className="bg-[#0a0a0a] border border-gray-700 p-3 rounded-lg outline-none focus:border-[#007AFF]" required/>
                         <input placeholder="Địa chỉ cụ thể" value={newAddress.address} onChange={e=>setNewAddress({...newAddress, address: e.target.value})} className="md:col-span-2 bg-[#0a0a0a] border border-gray-700 p-3 rounded-lg outline-none focus:border-[#007AFF]" required/>
                         <input placeholder="Quận/Huyện" value={newAddress.district} onChange={e=>setNewAddress({...newAddress, district: e.target.value})} className="bg-[#0a0a0a] border border-gray-700 p-3 rounded-lg outline-none focus:border-[#007AFF]" required/>
                         <input placeholder="Tỉnh/Thành phố" value={newAddress.city} onChange={e=>setNewAddress({...newAddress, city: e.target.value})} className="bg-[#0a0a0a] border border-gray-700 p-3 rounded-lg outline-none focus:border-[#007AFF]" required/>
                         <div className="md:col-span-2 flex gap-3 mt-2"><button type="submit" className="px-6 py-2 bg-[#007AFF] rounded-lg hover:bg-[#0062cc]">Lưu địa chỉ</button></div>
                       </form>
                    </div>
                  ) : (
                    <button onClick={()=>setIsAddingAddress(true)} className="w-full py-4 border-2 border-dashed border-gray-800 text-gray-400 rounded-2xl hover:border-[#007AFF] hover:text-[#007AFF] transition-colors flex items-center justify-center gap-2"><Plus/> Thêm địa chỉ mới</button>
                  )}
                  {addresses.map(a => (
                    <div key={a.address_id} className={`bg-[#1a1a1a] border ${a.is_default ? 'border-[#007AFF]/50' : 'border-gray-800'} p-6 rounded-2xl relative`}>
                      <div className="pr-10">
                        <p className="font-bold text-lg mb-1">{a.recipient_name} {a.is_default===1 && <span className="ml-2 text-[#007AFF] text-xs bg-[#007AFF]/10 px-2 py-0.5 rounded border border-[#007AFF]/20">Mặc định</span>}</p>
                        <p className="text-gray-400 text-sm">{a.phone_number}</p>
                        <p className="text-gray-300 mt-2">{a.address}, {a.district}, {a.city}</p>
                      </div>
                      <div className="absolute top-6 right-6 flex flex-col gap-2">
                        <button onClick={()=>handleDeleteAddress(a.address_id)} className="text-gray-500 hover:text-red-500 p-2"><Trash2 className="w-5 h-5"/></button>
                      </div>
                      {a.is_default===0 && <div className="mt-4 pt-4 border-t border-gray-800"><button onClick={()=>handleSetDefaultAddress(a.address_id)} className="text-sm px-3 py-1.5 border border-gray-700 rounded hover:bg-white/10 transition-colors">Đặt làm mặc định</button></div>}
                    </div>
                  ))}
                </div>
              )}

              {/* === WARRANTY === */}
              {activeTab === 'warranty' && <div className="text-center text-gray-500 py-12 bg-[#1a1a1a] rounded-2xl border border-gray-800">Chức năng bảo hành đang cập nhật.</div>}

              {/* === SETTINGS (ĐỔI MẬT KHẨU) === */}
              {activeTab === 'settings' && (
                 <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 animate-in fade-in">
                    <h2 className="text-2xl mb-6 font-bold">Cài Đặt Tài Khoản</h2>
                    
                    {/* ✅ FORM ĐỔI MẬT KHẨU HOÀN CHỈNH */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-[#007AFF]"/> Đổi mật khẩu</h3>
                        <div className="space-y-4 max-w-lg">
                            <div>
                                <input 
                                    type="password" 
                                    placeholder="Mật khẩu hiện tại" 
                                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 focus:border-[#007AFF] outline-none transition-colors"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                />
                            </div>
                            <div>
                                <input 
                                    type="password" 
                                    placeholder="Mật khẩu mới" 
                                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 focus:border-[#007AFF] outline-none transition-colors"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                />
                            </div>
                            <div>
                                <input 
                                    type="password" 
                                    placeholder="Xác nhận mật khẩu mới" 
                                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 focus:border-[#007AFF] outline-none transition-colors"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                />
                            </div>
                            <button 
                                onClick={handleChangePassword}
                                disabled={isLoading}
                                className="px-6 py-2 bg-[#007AFF] rounded-lg hover:bg-[#0062cc] transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                            >
                                <Key className="w-4 h-4" /> {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                            </button>
                        </div>
                    </div>

                    {/* Đăng xuất */}
                    <div className="pt-8 border-t border-gray-800">
                      <h3 className="text-lg font-medium mb-2 text-red-500">Khu vực nguy hiểm</h3>
                      <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 border border-red-500/20 bg-red-500/10 px-6 py-3 rounded-lg hover:bg-red-500/20 transition-all">
                        <LogOut className="w-5 h-5"/> Đăng xuất khỏi thiết bị
                      </button>
                    </div>
                 </div>
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}
import React, { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, ShoppingCart, LogOut, Camera, Lock, Key, Mail, Phone, Calendar, Plus, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/pages/Navbar';
import { Footer } from '@/pages/Footer';
import { Button } from '@/components/ui/button'; 
import { Toaster, toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- TYPES ---
interface Address {
    address_id: number;
    recipient_name: string;
    phone_number: string;
    address: string;
    district: string;
    city: string;
    country: string;
    is_default: boolean;
}

interface UserProfile {
    name: string;
    email: string;
    phone_number: string;
    role: string;
    date_of_birth?: string; 
    avatar_url?: string;
}

// --- COMPONENT ---
export default function UserProfilePage() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    
    // Axios instance với Token
    const api = axios.create({ 
        baseURL: API_URL, 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // State quản lý Tabs
    const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');
    
    // State dữ liệu
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

    // State Form Profile & Password
    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        date_of_birth: '',
        avatar_url: '',
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    // State Form Thêm Địa chỉ
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        recipient_name: '',
        phone_number: '',
        address: '',
        district: '',
        city: '',
        country: 'Việt Nam',
        is_default: false
    });

    // --- 1. FETCH DATA ---
    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        
        const fetchData = async () => {
            try {
                const [profileRes, addressRes] = await Promise.all([
                    api.get('/users/profile'),
                    api.get('/users/addresses')
                ]);

                const userData = profileRes.data.data;
                setProfile(userData);
                setAddresses(addressRes.data.data || []);

                // Fill dữ liệu vào form
                setFormData(prev => ({
                    ...prev,
                    name: userData.name || '',
                    phone_number: userData.phone_number || '',
                    date_of_birth: userData.date_of_birth || '',
                    avatar_url: userData.avatar_url || ''
                }));

            } catch (error: any) {
                if (error.response?.status === 401) logout();
                toast.error("Không thể tải thông tin người dùng");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated]);

    // --- 2. LOGIC CẬP NHẬT PROFILE & PASSWORD ---
    const handleUpdateProfile = async (e: FormEvent) => {
        e.preventDefault();
        const { current_password, new_password, confirm_password, ...profileInfo } = formData;

        try {
            // A. Cập nhật thông tin chung
            // Build payload with only editable fields to avoid sending empty or unwanted keys
            const payload: any = {
                name: (profileInfo.name || '').trim() || undefined,
                phone_number: (profileInfo.phone_number || '').trim() || undefined,
                date_of_birth: profileInfo.date_of_birth || undefined,
                avatar_url: profileInfo.avatar_url || undefined,
            };
            // Remove undefined keys
            Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

            await api.put('/users/profile', payload); // ensure backend accepts these fields
            
            // B. Đổi mật khẩu (nếu có nhập)
            if (current_password || new_password) {
                if (new_password !== confirm_password) {
                    toast.error("Mật khẩu xác nhận không khớp!");
                    return;
                }
                if (!current_password) {
                    toast.error("Vui lòng nhập mật khẩu hiện tại để thay đổi.");
                    return;
                }
                // Gọi API đổi mật khẩu (Giả định route)
                await api.put('/users/change-password', { 
                    currentPassword: current_password, 
                    newPassword: new_password 
                });
            }

            toast.success("Cập nhật hồ sơ thành công!");
            // Reset password fields
            setFormData(prev => ({ ...prev, current_password: '', new_password: '', confirm_password: '' }));

            // Refresh profile
            const refreshed = await api.get('/users/profile');
            setProfile(refreshed.data.data);
            setFormData(prev => ({ ...prev, avatar_url: refreshed.data.data.avatar_url || '' }));

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật hồ sơ");
        }
    };

    // --- 2b. Avatar file handling (convert to base64 and store in avatar_url)
    const handleAvatarFile = (file?: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string
            // store base64 as avatar_url (backend should accept or you can implement upload endpoint)
            setFormData(prev => ({ ...prev, avatar_url: result }));
        };
        reader.readAsDataURL(file);
    }

    // --- 3. LOGIC THÊM ĐỊA CHỈ ---
    const handleAddAddress = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/users/addresses', addressForm);
            if (res.data.success) {
                toast.success("Thêm địa chỉ thành công!");
                const newAddr = { ...addressForm, address_id: res.data.addressId } as Address;
                // If new is default, unset other defaults locally
                if (newAddr.is_default) {
                    setAddresses(prev => prev.map(a => ({ ...a, is_default: false })).concat(newAddr));
                } else {
                    setAddresses(prev => [...prev, newAddr]);
                }
                setShowAddAddress(false); // Đóng form
                setAddressForm({ recipient_name: '', phone_number: '', address: '', district: '', city: '', country: 'Việt Nam', is_default: false }); // Reset form
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi thêm địa chỉ");
        }
    };

    // --- 4. LOGIC XÓA ĐỊA CHỈ ---
    const handleDeleteAddress = async (id: number) => {
        if (!confirm('Bạn chắc chắn muốn xóa địa chỉ này?')) return;
        try {
            await api.delete(`/users/addresses/${id}`);
            setAddresses(prev => prev.filter(a => a.address_id !== id));
            toast.success("Đã xóa địa chỉ.");
        } catch (error) {
            toast.error("Lỗi xóa địa chỉ");
        }
    };

    if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center">Đang tải...</div>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-inter">
            <Navbar cartCount={0} />
            <Toaster position="top-right" />

            <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* ================= SIDEBAR (LEFT) ================= */}
                    <aside className="lg:col-span-3 self-start">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-24 w-full max-w-[260px]">
                            {/* Avatar Section */}
                            <div className="p-6 flex flex-col items-center border-b border-gray-100">
                                <div className="relative mb-3">
                                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 overflow-hidden">
                                        {profile?.avatar_url || formData.avatar_url ? (
                                            <img src={profile?.avatar_url || formData.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{profile?.name?.[0]?.toUpperCase() || 'A'}</span>
                                        )}
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900">{profile?.name}</h3>
                                <p className="text-sm text-gray-500">{profile?.email}</p>
                            </div>
                            
                            {/* Menu */}
                            <nav className="p-2">
                                <button 
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'profile' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <User className="w-4 h-4"/> Thông tin tài khoản
                                </button>
                                <button 
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'addresses' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <MapPin className="w-4 h-4"/> Địa chỉ giao hàng
                                </button>
                                <button 
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'orders' ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <ShoppingCart className="w-4 h-4"/> Đơn hàng
                                </button>
                                <button 
                                    onClick={() => { logout(); navigate('/'); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md transition-colors mt-2"
                                >
                                    <LogOut className="w-4 h-4"/> Đăng xuất
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* ================= CONTENT (RIGHT) ================= */}
                    <div className="lg:col-span-9">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="border border-gray-100 rounded p-6">
                            {/* --- TAB 1: THÔNG TIN TÀI KHOẢN (Theo bố cục ảnh) --- */}
                            {activeTab === 'profile' && (
                                <form onSubmit={handleUpdateProfile}>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Thông tin tài khoản</h2>
                                    
                                    {/* Hàng 1: Họ tên & Email */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                                            <input 
                                                type="text" 
                                                value={formData.name} 
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full h-10 px-3 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Email</label>
                                            <input 
                                                type="email" 
                                                value={profile?.email} 
                                                disabled 
                                                className="w-full h-10 px-3 rounded border border-gray-200 bg-gray-100 text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Hàng 2: SĐT & Ngày sinh */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                                            <input 
                                                type="tel" 
                                                value={formData.phone_number} 
                                                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                                                className="w-full h-10 px-3 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
                                            <div className="relative">
                                                <input 
                                                    type="date" 
                                                    value={formData.date_of_birth} 
                                                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                                                    className="w-full h-10 px-3 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hàng 3: Ảnh đại diện (Điểm tích lũy đã bỏ) */}
                                    <div className="mb-8">
                                        <label className="text-sm font-medium text-gray-700 block mb-2">Ảnh đại diện</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                                                {formData.avatar_url ? (
                                                    <img src={formData.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-8 h-8 text-gray-400"/>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="cursor-pointer px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                                                    <Camera className="w-4 h-4"/> Chọn tệp
                                                    <input type="file" className="hidden" accept="image/*" onChange={e => handleAvatarFile(e.target.files?.[0])} />
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Hoặc dán URL ảnh"
                                                    value={formData.avatar_url}
                                                    onChange={e => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                                                    className="w-64 px-3 py-2 rounded border border-gray-300 bg-white text-sm"
                                                />
                                                <span className="text-xs text-gray-500">Chọn một tệp hình ảnh hoặc nhập URL ảnh</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phần Đổi Mật Khẩu (Liền mạch theo ảnh) */}
                                    <div className="pt-2">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Đổi mật khẩu</h3>
                                        <p className="text-sm text-red-500 mb-4 italic">Để trống nếu bạn không muốn thay đổi mật khẩu.</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-1 space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                                                <input 
                                                    type="password" 
                                                    value={formData.current_password}
                                                    onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                                                    className="w-full h-10 px-3 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            {/* Spacer để giống layout 2 cột lệch */}
                                            <div className="hidden md:block"></div> 

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
                                                <input 
                                                    type="password" 
                                                    value={formData.new_password}
                                                    onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                                                    className="w-full h-10 px-3 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                                                <input 
                                                    type="password" 
                                                    value={formData.confirm_password}
                                                    onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                                                    className="w-full h-10 px-3 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nút Submit (Góc phải dưới) */}
                                    <div className="mt-8 flex justify-end">
                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 text-sm font-medium rounded shadow-sm">
                                            Cập nhật thông tin
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {/* --- TAB 2: QUẢN LÝ ĐỊA CHỈ (Có Form Thêm) --- */}
                            {activeTab === 'addresses' && (
                                <div>
                                    <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-100'>
                                        <h2 className="text-xl font-bold text-gray-900">Địa chỉ giao hàng</h2>
                                        <Button onClick={() => setShowAddAddress(!showAddAddress)} className='bg-blue-600 hover:bg-blue-700 text-white gap-2 h-9 text-sm'>
                                            <Plus className='w-4 h-4'/> {showAddAddress ? 'Đóng' : 'Thêm địa chỉ'}
                                        </Button>
                                    </div>

                                    {/* Form Thêm Địa Chỉ (Ẩn/Hiện) */}
                                    {showAddAddress && (
                                        <form onSubmit={handleAddAddress} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in">
                                            <h3 className="font-semibold mb-4 text-gray-800">Thêm địa chỉ mới</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <input required type="text" placeholder="Tên người nhận" value={addressForm.recipient_name} onChange={e => setAddressForm({...addressForm, recipient_name: e.target.value})} className="p-2 border rounded" />
                                                <input required type="tel" placeholder="Số điện thoại" value={addressForm.phone_number} onChange={e => setAddressForm({...addressForm, phone_number: e.target.value})} className="p-2 border rounded" />
                                                <input required type="text" placeholder="Địa chỉ chi tiết (Số nhà, đường...)" value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className="p-2 border rounded md:col-span-2" />
                                                <input required type="text" placeholder="Quận/Huyện" value={addressForm.district} onChange={e => setAddressForm({...addressForm, district: e.target.value})} className="p-2 border rounded" />
                                                <input required type="text" placeholder="Tỉnh/Thành phố" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="p-2 border rounded" />
                                            </div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <input type="checkbox" id="default" checked={addressForm.is_default} onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})} />
                                                <label htmlFor="default" className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Lưu địa chỉ</Button>
                                            </div>
                                        </form>
                                    )}
                                    
                                    {/* Danh sách địa chỉ */}
                                    <div className="space-y-4">
                                        {addresses.map((addr) => (
                                            <div key={addr.address_id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-start bg-white">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900">{addr.recipient_name}</span>
                                                        {addr.is_default && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Mặc định</span>}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">SĐT: {addr.phone_number}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{addr.address}, {addr.district}, {addr.city}</p>
                                                </div>
                                                <button onClick={() => handleDeleteAddress(addr.address_id)} className="text-gray-400 hover:text-red-500 p-1">
                                                    <Trash2 className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        ))}
                                        {addresses.length === 0 && !showAddAddress && (
                                            <div className="text-center py-8 text-gray-500">Chưa có địa chỉ nào.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* --- TAB 3: ĐƠN HÀNG --- */}
                            {activeTab === 'orders' && (
                                <div className="text-center py-16 text-gray-500">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
                                    <p>Chức năng đang phát triển</p>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
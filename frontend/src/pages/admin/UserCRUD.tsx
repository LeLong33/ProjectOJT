import React, { useEffect, useState } from 'react';
import { Users, Shield, User, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';

interface Account {
    account_id: number;
    name: string;
    email: string;
    role: 'user' | 'staff' | 'admin';
    phone_number: string;
}

export default function UserCRUD() {
    const { user } = useAuth();
    const api = useApi();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Hàm lấy danh sách người dùng (Endpoint Backend cần thiết: GET /api/admin/users)
    const fetchAccounts = async () => {
        setLoading(true);
        try {
            // ⚠️ Cần tạo Endpoint này ở Backend: Chỉ Admin được phép
            const res = await api.get('/admin/users'); 
            setAccounts(res.data.data || []);
            setLoading(false);
        } catch (error: any) {
            setMessage(`❌ Lỗi tải dữ liệu: ${error.response?.data?.message || 'Kiểm tra Endpoint /api/admin/users'}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAccounts();
        } else {
            setMessage('Bạn không có quyền xem danh sách người dùng.');
            setLoading(false);
        }
    }, [user?.role]);

    // TEST: Cập nhật Role (Chỉ Admin)
    const handleUpdateRole = async (accountId: number, newRole: 'user' | 'staff' | 'admin') => {
        if (user?.role !== 'admin' || !confirm(`Bạn có chắc chắn muốn thay đổi vai trò của user ID ${accountId} thành ${newRole.toUpperCase()}?`)) return;

        try {
            // ⚠️ Cần tạo Endpoint này ở Backend: PUT /api/admin/users/:id/role
            const res = await api.put(`/admin/users/${accountId}/role`, { role: newRole });
            setMessage(`✅ Cập nhật thành công role cho User ID ${accountId} thành ${newRole}.`);
            fetchAccounts(); // Tải lại danh sách
        } catch (error: any) {
            setMessage(`❌ Lỗi cập nhật: ${error.response?.data?.message || 'Lỗi server'}`);
        }
    };

    if (loading) return <div className="text-gray-400">Đang tải danh sách tài khoản...</div>;

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Users className="w-6 h-6" /> Quản lý Người dùng
            </h3>
            
            {message && <div className={`p-3 rounded-lg ${message.startsWith('❌') ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}`}>{message}</div>}

            <div className="bg-gray-800 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {accounts.map((a) => (
                            <tr key={a.account_id} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-400">{a.account_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{a.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{a.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${a.role === 'admin' ? 'bg-purple-100 text-purple-800' : a.role === 'staff' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {a.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {/* Cập nhật Role chỉ khi không phải là tài khoản hiện tại và là Admin */}
                                    {a.account_id !== user?.id && user?.role === 'admin' && (
                                        <select 
                                            value={a.role}
                                            onChange={(e) => handleUpdateRole(a.account_id, e.target.value as 'user' | 'staff' | 'admin')}
                                            className="bg-gray-700 border border-gray-600 rounded text-white text-xs p-1"
                                        >
                                            <option value="user">User</option>
                                            <option value="staff">Staff</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
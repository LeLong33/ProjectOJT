import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Edit, X, RefreshCw } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

interface User {
  account_id: number;
  name: string;
  email: string;
  phone_number?: string;
  role: 'user' | 'staff' | 'admin';
  date_of_birth?: string;
  avatar_url?: string;
  created_at?: string;
}

export function UserCRUD() {
  const api = useApi();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newRole, setNewRole] = useState<'user' | 'staff' | 'admin'>('user');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400';
      case 'staff':
        return 'bg-blue-500/20 text-blue-400';
      case 'user':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldAlert className="w-4 h-4" />;
      case 'staff':
        return <ShieldCheck className="w-4 h-4" />;
      case 'user':
        return <Shield className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'staff':
        return 'Nhân viên';
      case 'user':
        return 'Khách hàng';
      default:
        return role;
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setMessage('');
    try {
      // ✅ SỬA: Gọi đúng endpoint theo routes: /api/users/admin
      const res = await api.get('/users/admin');
      const data = res.data?.data ?? res.data;
      
      console.log('📥 Fetched users:', data);
      
      // Map account_id để đảm bảo tương thích
      const mappedData = Array.isArray(data) ? data.map((u: any) => ({
        ...u,
        account_id: u.account_id || u.id
      })) : [];
      
      setUsers(mappedData);
    } catch (err) {
      const error = err as any;
      console.error('❌ Fetch users error:', error);
      setMessage(`❌ Lỗi tải người dùng: ${error.response?.data?.message ?? error.message ?? 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsEditOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    setMessage('');

    try {
      // ✅ SỬA: Gọi đúng endpoint theo routes: /api/users/admin/:id/role
      const userId = selectedUser.account_id;
      const res = await api.put(`/users/admin/${userId}/role`, { role: newRole });
      
      console.log('✅ Update role response:', res.data);
      
      setMessage(res.data?.message ?? '✅ Cập nhật vai trò thành công');
      setIsEditOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      const error = err as any;
      console.error('❌ Update role error:', error);
      setMessage(`❌ Lỗi cập nhật: ${error.response?.data?.message ?? error.message ?? 'Lỗi không xác định'}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">Quản lý người dùng</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-[#0a0a0a] transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Tổng:</span>
            <span className="font-medium">{users.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Admin:</span>
            <span className="text-red-400">{users.filter(u => u.role === 'admin').length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Staff:</span>
            <span className="text-blue-400">{users.filter(u => u.role === 'staff').length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">User:</span>
            <span className="text-green-400">{users.filter(u => u.role === 'user').length}</span>
          </div>
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
                <th className="text-left py-3 px-4 text-gray-400 font-normal">ID</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Ảnh</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Họ tên</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Email</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">SĐT</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Ngày sinh</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Vai trò</th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    Đang tải...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    Chưa có người dùng
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.account_id} className="border-b border-gray-800 last:border-0 hover:bg-[#0a0a0a]">
                    <td className="py-3 px-4 font-mono text-sm text-gray-400">#{user.account_id}</td>
                    <td className="py-3 px-4">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#007AFF] to-[#0051D5] flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4 text-gray-400">{user.email}</td>
                    <td className="py-3 px-4 text-gray-400">{user.phone_number || '-'}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {formatDate(user.date_of_birth)}
                    </td>
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {getRoleLabel(user.role)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEditRole(user)}
                        className="p-2 hover:bg-[#0a0a0a] rounded transition-colors"
                        title="Chỉnh sửa vai trò"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Role Modal */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">Thay đổi vai trò</h3>
              <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-[#0a0a0a] rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-black/50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  {selectedUser.avatar_url ? (
                    <img
                      src={selectedUser.avatar_url}
                      alt={selectedUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#007AFF] to-[#0051D5] flex items-center justify-center text-white font-medium text-lg">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-gray-400">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-500">Vai trò hiện tại</p>
                  <div className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs mt-1 ${getRoleColor(selectedUser.role)}`}>
                    {getRoleIcon(selectedUser.role)}
                    {getRoleLabel(selectedUser.role)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Chọn vai trò mới</label>
                <div className="space-y-2">
                  {(['user', 'staff', 'admin'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setNewRole(role)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        newRole === role
                          ? 'border-[#007AFF] bg-[#007AFF]/10'
                          : 'border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded ${getRoleColor(role)}`}>
                        {getRoleIcon(role)}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{getRoleLabel(role)}</p>
                        <p className="text-xs text-gray-400">
                          {role === 'admin' && 'Toàn quyền quản trị hệ thống'}
                          {role === 'staff' && 'Quản lý sản phẩm và đơn hàng'}
                          {role === 'user' && 'Người dùng thông thường'}
                        </p>
                      </div>
                      {newRole === role && (
                        <div className="w-5 h-5 rounded-full bg-[#007AFF] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {selectedUser.role !== newRole && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-xs text-yellow-400">
                    ⚠️ Thay đổi vai trò sẽ ảnh hưởng đến quyền truy cập của người dùng
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-6 py-2 border border-gray-700 rounded hover:bg-[#0a0a0a] transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={selectedUser.role === newRole}
                className="px-6 py-2 bg-[#007AFF] rounded hover:bg-[#0051D5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
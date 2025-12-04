// Component để test navigation - Chỉ dùng khi development
interface DevNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function DevNav({ currentPage, onNavigate }: DevNavProps) {
  const pages = [
    { id: 'home', name: 'Trang chủ' },
    { id: 'list', name: 'Danh sách SP' },
    { id: 'detail', name: 'Chi tiết SP' },
    { id: 'cart', name: 'Giỏ hàng' },
    { id: 'checkout', name: 'Thanh toán' },
    { id: 'order-confirmation', name: 'Xác nhận' },
    { id: 'account', name: 'Tài khoản' },
    { id: 'login', name: 'Đăng nhập' },
    { id: 'admin', name: 'Admin' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] bg-black/90 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 shadow-2xl">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 mr-2">DEV:</span>
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onNavigate(page.id)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              currentPage === page.id
                ? 'bg-[#007AFF] text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {page.name}
          </button>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { LayoutDashboard, UtensilsCrossed, TableProperties, ClipboardList, LogOut, Receipt } from 'lucide-react';
import { MenuManagement } from './MenuManagement';
import { TableManagement } from './TableManagement';
import { OrderManagement } from './OrderManagement';
import { TransactionHistory } from './TransactionHistory';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: string;
}

interface Order {
  id: string;
  tableNumber: number;
  items: { name: string; quantity: number; price: number }[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  total: number;
  createdAt: Date;
}

interface Transaction {
  id: string;
  orderId: string;
  tableNumber: number;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  completedAt: Date;
  paymentMethod: 'cash' | 'card';
}

interface AdminDashboardProps {
  foods: FoodItem[];
  orders: any[];
  onLogout: () => void;
  onUpdateFoods: (foods: FoodItem[]) => void;
  tables: any[];
  onStatusChange?: (id: string, status: string) => void;
}

export function AdminDashboard({ foods, onLogout, onUpdateFoods, orders: incomingOrders, tables: incomingTables, onStatusChange }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'tables' | 'orders' | 'transactions'>('overview');
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (incomingOrders) {
      const formattedOrders = incomingOrders.map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt)
      }));
      setOrders(formattedOrders);

      // Tự động tạo lịch sử giao dịch
      const finishedOrders = formattedOrders.filter((o: any) => o.status === 'served');
      const realTransactions = finishedOrders.map((o: any) => ({
        id: `TXN-${o.id}`,
        orderId: o.id,
        tableNumber: o.tableNumber,
        items: o.items || [],
        total: o.total,
        completedAt: o.createdAt,
        paymentMethod: 'cash' as 'cash' | 'card'
      }));
      setTransactions(realTransactions);
    }

    if (incomingTables) {
       setTables(incomingTables);
    }
  }, [incomingOrders, incomingTables]);

  const handleUpdateTableStatus = (id: string, status: Table['status']) => {
    setTables(tables.map((table) => table.id === id ? { ...table, status } : table));
  };

  // 🔥 LOGIC FIX NÚT CONFIRM (QUAN TRỌNG)
  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    // 1. Cập nhật giao diện NGAY LẬP TỨC (Không chờ Server) -> Hết bị đơ
    const updatedOrders = orders.map(o => 
      o.id === id ? { ...o, status: status } : o
    );
    setOrders(updatedOrders);

    // 2. Âm thầm gửi lệnh về Server lưu lại
    if (onStatusChange) {
      onStatusChange(id, status);
    }
  };

  // Các hàm xử lý món ăn
  const handleAddFood = (food: Omit<FoodItem, 'id'>) => onUpdateFoods([...foods, { ...food, id: Date.now().toString() }]);
  const handleUpdateFood = (id: string, updatedFood: Partial<FoodItem>) => onUpdateFoods(foods.map(f => f.id === id ? { ...f, ...updatedFood } : f));
  const handleDeleteFood = (id: string) => onUpdateFoods(foods.filter(f => f.id !== id));

  const tabs = [
    { id: 'overview' as const, name: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'menu' as const, name: 'Menu Management', icon: <UtensilsCrossed size={20} /> },
    { id: 'tables' as const, name: 'Table Management', icon: <TableProperties size={20} /> },
    { id: 'orders' as const, name: 'Order Management', icon: <ClipboardList size={20} /> },
    { id: 'transactions' as const, name: 'Transaction History', icon: <Receipt size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 h-screen sticky top-0">
        <div className="mb-8">
          <h1 className="text-xl text-gray-800 font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-600">Vietnamese Restaurant</p>
        </div>
        <nav className="space-y-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors mt-auto">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Dishes</h3>
                  <div className="p-2 bg-orange-100 rounded-lg"><UtensilsCrossed size={20} className="text-orange-600" /></div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{foods.length}</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Available Tables</h3>
                  <div className="p-2 bg-green-100 rounded-lg"><TableProperties size={20} className="text-green-600" /></div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{tables.filter(t => t.status === 'available').length}/{tables.length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Active Orders</h3>
                  <div className="p-2 bg-blue-100 rounded-lg"><ClipboardList size={20} className="text-blue-600" /></div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{orders.filter(o => o.status !== 'served' && o.status !== 'cancelled').length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Today's Revenue</h3>
                  <div className="p-2 bg-purple-100 rounded-lg"><Receipt size={20} className="text-purple-600" /></div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{transactions.reduce((sum, t) => sum + t.total, 0).toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
            
             {/* Recent Orders - Bảng nhỏ bên dưới */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-gray-800">Order #{order.id}</p>
                      <p className="text-xs text-gray-500">{order.createdAt.toLocaleTimeString('vi-VN')}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === 'served' ? 'bg-green-100 text-green-700' : 
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && <MenuManagement foods={foods} onAddFood={handleAddFood} onUpdateFood={handleUpdateFood} onDeleteFood={handleDeleteFood} />}
        {activeTab === 'tables' && <TableManagement tables={tables} onUpdateTableStatus={handleUpdateTableStatus} />}
        {activeTab === 'orders' && <OrderManagement orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />}
        {activeTab === 'transactions' && <TransactionHistory transactions={transactions} />}
      </main>
    </div>
  );
}
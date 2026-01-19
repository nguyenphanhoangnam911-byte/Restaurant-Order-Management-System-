import { useState } from 'react';
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
  onLogout: () => void;
  onUpdateFoods: (foods: FoodItem[]) => void;
}

export function AdminDashboard({ foods, onLogout, onUpdateFoods }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'tables' | 'orders' | 'transactions'>('overview');
  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 1, seats: 4, status: 'available' },
    { id: '2', number: 2, seats: 2, status: 'occupied', currentOrder: '001' },
    { id: '3', number: 3, seats: 6, status: 'reserved' },
    { id: '4', number: 4, seats: 4, status: 'available' },
    { id: '5', number: 5, seats: 8, status: 'occupied', currentOrder: '002' },
    { id: '6', number: 6, seats: 2, status: 'available' },
    { id: '7', number: 7, seats: 4, status: 'available' },
    { id: '8', number: 8, seats: 6, status: 'reserved' },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '001',
      tableNumber: 2,
      items: [
        { name: 'Beefeef PhoPho', quantity: 2, price: 45000 },
        { name: 'VietnameseVietnamese IcedIced CoffeeCoffee', quantity: 1, price: 20000 },
      ],
      status: 'preparing',
      total: 110000,
      createdAt: new Date(),
    },
    {
      id: '002',
      tableNumber: 5,
      items: [
        { name: 'Grilledrilled ChickeChicken Rice Rice', quantity: 3, price: 40000 },
        { name: 'Fresh SprFresh Springg RollsRolls', quantity: 2, price: 30000 },
      ],
      status: 'pending',
      total: 180000,
      createdAt: new Date(Date.now() - 5 * 60000),
    },
    {
      id: '003',
      tableNumber: 3,
      items: [
        { name: 'Grilled Pork Grilled Pork Baanh Mii', quantity: 1, price: 25000 },
      ],
      status: 'ready',
      total: 25000,
      createdAt: new Date(Date.now() - 15 * 60000),
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      orderId: '100',
      tableNumber: 1,
      items: [
        { name: 'Beef Pho', quantity: 2, price: 45000 },
        { name: 'Fresh Spring Rolls', quantity: 1, price: 30000 },
      ],
      total: 120000,
      completedAt: new Date(Date.now() - 2 * 60 * 60000),
      paymentMethod: 'cash',
    },
    {
      id: 'TXN002',
      orderId: '101',
      tableNumber: 4,
      items: [
        { name: 'Grilled Chicken Rice', quantity: 1, price: 40000 },
        { name: 'Bubble Milk Tea', quantity: 2, price: 25000 },
      ],
      total: 90000,
      completedAt: new Date(Date.now() - 1.5 * 60 * 60000),
      paymentMethod: 'card',
    },
    {
      id: 'TXN003',
      orderId: '102',
      tableNumber: 7,
      items: [
        { name: 'Yang Chow Fried Rice', quantity: 2, price: 35000 },
        { name: 'Vietnamese Iced Coffee', quantity: 2, price: 20000 },
      ],
      total: 110000,
      completedAt: new Date(Date.now() - 1 * 60 * 60000),
      paymentMethod: 'cash',
    },
    {
      id: 'TXN004',
      orderId: '103',
      tableNumber: 2,
      items: [
        { name: 'Beef Stir-Fry', quantity: 1, price: 50000 },
        { name: 'Grilled Pork Banh Mi', quantity: 1, price: 25000 },
      ],
      total: 75000,
      completedAt: new Date(Date.now() - 0.5 * 60 * 60000),
      paymentMethod: 'card',
    },
  ]);

  const handleAddFood = (food: Omit<FoodItem, 'id'>) => {
    const newFood = {
      ...food,
      id: Date.now().toString(),
    };
    onUpdateFoods([...foods, newFood]);
  };

  const handleUpdateFood = (id: string, updatedFood: Partial<FoodItem>) => {
    const updatedFoods = foods.map((food) =>
      food.id === id ? { ...food, ...updatedFood } : food
    );
    onUpdateFoods(updatedFoods);
  };

  const handleDeleteFood = (id: string) => {
    const updatedFoods = foods.filter((food) => food.id !== id);
    onUpdateFoods(updatedFoods);
  };

  const handleUpdateTableStatus = (id: string, status: Table['status']) => {
    setTables(tables.map((table) =>
      table.id === id ? { ...table, status } : table
    ));
  };

  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map((order) =>
      order.id === id ? { ...order, status } : order
    ));
    
    // If order is marked as served, create a transaction
    if (status === 'served') {
      const completedOrder = orders.find(o => o.id === id);
      if (completedOrder) {
        const newTransaction: Transaction = {
          id: `TXN${String(transactions.length + 1).padStart(3, '0')}`,
          orderId: completedOrder.id,
          tableNumber: completedOrder.tableNumber,
          items: completedOrder.items,
          total: completedOrder.total,
          completedAt: new Date(),
          paymentMethod: Math.random() > 0.5 ? 'cash' : 'card', // Random for demo
        };
        setTransactions([newTransaction, ...transactions]);
      }
    }
  };

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
          <h1 className="text-xl text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-600">Vietnamese Restaurant</p>
        </div>

        <nav className="space-y-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl text-gray-800">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">Total Dishes</h3>
                  <UtensilsCrossed size={20} className="text-orange-500" />
                </div>
                <p className="text-3xl text-gray-800">{foods.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">Available Tables</h3>
                  <TableProperties size={20} className="text-green-500" />
                </div>
                <p className="text-3xl text-gray-800">
                  {tables.filter((t) => t.status === 'available').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">Active Orders</h3>
                  <ClipboardList size={20} className="text-blue-500" />
                </div>
                <p className="text-3xl text-gray-800">
                  {orders.filter((o) => o.status !== 'served' && o.status !== 'cancelled').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">Today's Revenue</h3>
                  <span className="text-orange-500">đ</span>
                </div>
                <p className="text-3xl text-gray-800">
                  {transactions.reduce((sum, tt) => sum + tt.total, 0).toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg text-gray-800 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm text-gray-800">Order #{order.id} - Table {order.tableNumber}</p>
                      <p className="text-xs text-gray-500">
                        {order.createdAt.toLocaleTimeString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-800">{order.total.toLocaleString('vi-VN')}đ</p>
                      <p className="text-xs text-gray-500">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <MenuManagement
            foods={foods}
            onAddFood={handleAddFood}
            onUpdateFood={handleUpdateFood}
            onDeleteFood={handleDeleteFood}
          />
        )}

        {activeTab === 'tables' && (
          <TableManagement tables={tables} onUpdateTableStatus={handleUpdateTableStatus} />
        )}

        {activeTab === 'orders' && (
          <OrderManagement orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />
        )}

        {activeTab === 'transactions' && (
          <TransactionHistory transactions={transactions} />
        )}
      </main>
    </div>
  );
}
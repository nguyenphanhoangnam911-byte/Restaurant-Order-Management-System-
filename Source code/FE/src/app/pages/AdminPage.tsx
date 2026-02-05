import { useState, useEffect } from 'react';
import { AdminLogin } from '@/app/components/admin/AdminLogin';
import { AdminDashboard } from '@/app/components/admin/AdminDashboard';
import { api } from '@/services/api';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);

  const handleAdminLogin = async (username: string, password: string) => {
    try {
        const res = await api.adminLogin(username, password);
        if (res.success) setIsAdminLoggedIn(true);
        else alert(res.message);
    } catch(e) { alert("Lỗi kết nối"); }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setFoodItems([]);
    setOrders([]);
    setTables([]);
  };

  const fetchDashboardData = async () => {
      try {
        const data = await api.getAdminDashboard();
        if(data) {
            if(data.foods) setFoodItems(data.foods);
            if(data.orders) setOrders(data.orders);
            if(data.tables) setTables(data.tables);
        }
      } catch (error) { console.error("Lỗi data"); }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 3000); // Tự động cập nhật 3 giây
        return () => clearInterval(interval);
    }
  }, [isAdminLoggedIn]);

  return (
    <>
      {!isAdminLoggedIn ? (
        <AdminLogin onLogin={handleAdminLogin} />
      ) : (
        <AdminDashboard 
          foods={foodItems} 
          orders={orders}
          tables={tables}
          onLogout={handleAdminLogout}
          onUpdateFoods={setFoodItems}
          onStatusChange={async (id: string, newStatus: string) => {
              // Gọi API lưu xuống DB nhưng không cần đợi nó xong để refresh ngay
              // Vì giao diện đã đổi màu trước rồi (nhờ code ở Bước 1)
              await api.updateOrderStatus(id, newStatus);
          }}
        />
      )}
    </>
  );
}
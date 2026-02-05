const BASE_URL = 'http://127.0.0.1:5000/api';

export const api = {
  // --- KHÁCH HÀNG ---
  getMenu: async () => {
    const res = await fetch(`${BASE_URL}/customer/menu?_t=${Date.now()}`);
    return await res.json();
  },
  
  customerRegister: async (name: string, phone: string, pass: string) => {
    const res = await fetch(`${BASE_URL}/customer/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, password: pass }) });
    return await res.json();
  },

  customerLogin: async (phone: string, pass: string) => {
    const res = await fetch(`${BASE_URL}/customer/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, password: pass }) });
    return await res.json();
  },

  placeOrder: async (data: any) => {
    const res = await fetch(`${BASE_URL}/customer/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return await res.json();
  },

  // --- ADMIN ---
  adminLogin: async (username: string, pass: string) => {
    const res = await fetch(`${BASE_URL}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password: pass }) });
    return await res.json();
  },

  getAdminDashboard: async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard?_t=${Date.now()}`);
    return await res.json();
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const res = await fetch(`${BASE_URL}/admin/order/update-status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: orderId, status }) });
    return await res.json();
  },

  addFood: async (food: any) => {
    await fetch(`${BASE_URL}/admin/food/add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(food) });
  },

  updateFood: async (food: any) => {
    await fetch(`${BASE_URL}/admin/food/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(food) });
  },

  deleteFood: async (id: string) => {
    await fetch(`${BASE_URL}/admin/food/delete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
  },

  updateTableStatus: async (id: string, status: string) => {
    await fetch(`${BASE_URL}/admin/table/update-status`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id, status }) 
    });
  },

  addTable: async (table: any) => {
    await fetch(`${BASE_URL}/admin/table/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(table)
    });
  }
};
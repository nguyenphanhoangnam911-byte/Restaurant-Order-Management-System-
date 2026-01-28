import { Clock, CheckCircle, XCircle, ChefHat } from 'lucide-react';

interface Order {
  id: string;
  tableNumber: number;
  items: { name: string; quantity: number; price: number }[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  total: number;
  createdAt: Date;
}

interface OrderManagementProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
}

export function OrderManagement({ orders, onUpdateOrderStatus }: OrderManagementProps) {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'preparing':
        return 'bg-blue-100 text-blue-700';
      case 'ready':
        return 'bg-green-100 text-green-700';
      case 'served':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready';
      case 'served':
        return 'Served';
      case 'cancelled':
        return 'Cancelled';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={18} />;
      case 'preparing':
        return <ChefHat size={18} />;
      case 'ready':
      case 'served':
        return <CheckCircle size={18} />;
      case 'cancelled':
        return <XCircle size={18} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-gray-800">Order Management</h2>
        <div className="text-sm text-gray-600">
          Total: {orders.length} orders
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg text-gray-800">Order #{order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Table {order.tableNumber} • {order.createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg text-orange-600">{order.total.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>

            <div className="mb-4 space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-gray-600">{item.price.toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              {order.status === 'pending' && (
                <>
                  <button
                    onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                    className="px-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </>
              )}
              {order.status === 'preparing' && (
                <button
                  onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Complete
                </button>
              )}
              {order.status === 'ready' && (
                <button
                  onClick={() => onUpdateOrderStatus(order.id, 'served')}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Served
                </button>
              )}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg">
            <p className="text-gray-500">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
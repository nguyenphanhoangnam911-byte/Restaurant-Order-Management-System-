import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

interface CartItem extends FoodItem {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  isMember: boolean;
  onCheckout: () => void; 
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, isMember, onCheckout }: CartProps) {  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = isMember ? subtotal * 0.05 : 0;
  const total = subtotal - discount;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingBag size={24} className="text-orange-500" />
              <h2 className="text-xl text-gray-800">Shopping Cart</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          {isMember && (
            <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-700">🎉 You get 5% member discount!</p>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-gray-50 rounded-lg p-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-orange-600 mb-2">{item.price.toLocaleString('vi-VN')}đ</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Total */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800">{subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            {isMember && (
              <div className="flex justify-between text-sm">
                <span className="text-orange-600">Discount (5%)</span>
                <span className="text-orange-600">-{discount.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-gray-800">Total</span>
              <span className="text-xl text-orange-600">{total.toLocaleString('vi-VN')}đ</span>
            </div>
            <button 
            onClick={onCheckout}   // <--- THÊM DÒNG QUAN TRỌNG NÀY VÀO
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Place Order
          </button>
          </div>
        )}
      </div>
    </>
  );
}
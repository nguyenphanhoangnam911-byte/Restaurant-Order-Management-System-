import { useState, useEffect } from 'react';
import { UtensilsCrossed, Soup, Coffee, IceCream, Menu } from 'lucide-react';
import { CategorySidebar } from '@/app/components/CategorySidebar';
import { FoodCard } from '@/app/components/FoodCard';
import { MenuDrawer } from '@/app/components/MenuDrawer';
import { CartButton } from '@/app/components/CartButton';
import { CustomerAuth } from '@/app/components/customer/CustomerAuth';
import { Cart } from '@/app/components/customer/Cart';
import { api } from '@/services/api'; // <--- IMPORT API

interface Category {
  id: string;
  name: string;
  icon: JSX.Element;
}

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

interface Customer {
  name: string;
  phone: string;
}

export default function CustomerPage() {
  const categories: Category[] = [
    { id: 'main-dishes', name: 'Main Dishes', icon: <UtensilsCrossed size={20} /> },
    { id: 'soups', name: 'Soups', icon: <Soup size={20} /> },
    { id: 'drinks', name: 'Drinks', icon: <Coffee size={20} /> },
    { id: 'desserts', name: 'Desserts', icon: <IceCream size={20} /> },
  ];

  // 1. STATE RỖNG
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  
  const [activeCategory, setActiveCategory] = useState<string>('main-dishes');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);

  // 2. GỌI API LẤY MENU
  useEffect(() => {
    const loadMenu = async () => {
        const data = await api.getMenu();
        if(data) setFoodItems(data);
    }
    loadMenu();
  }, []);

  const filteredFoods = foodItems.filter(food => food.categoryId === activeCategory);

  const handleAddToCart = (food: FoodItem) => {
    const existingItem = cartItems.find(item => item.id === food.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // 3. XỬ LÝ LOGIN API
  const handleCustomerLogin = async (phone: string, password: string) => {
    try {
        const res = await api.customerLogin(phone, password);
        if (res.success) {
            setCustomer({ name: res.name, phone: phone });
            setIsCustomerAuthOpen(false);
        } else {
            alert(res.message);
        }
    } catch(e) { alert("Lỗi kết nối server"); }
  };

  const handleCustomerLogout = () => {
    setCustomer(null);
  };

  // 4. XỬ LÝ REGISTER API
  const handleRegisterCustomer = async (name: string, phone: string, password: string) => {
    try {
        const res = await api.customerRegister(name, phone, password);
        if (res.success) {
            alert("Đăng ký thành công! Đang đăng nhập...");
            handleCustomerLogin(phone, password);
        } else {
            alert(res.message);
        }
    } catch(e) { alert("Lỗi kết nối server"); }
  };

  // 5. XỬ LÝ CHECKOUT API
  const handleCheckout = async () => {
    if(cartItems.length === 0) return;
    try {
        const payload = {
            member_phone: customer?.phone,
            items: cartItems.map(i => ({ item_id: Number(i.id), quantity: i.quantity }))
        }
        const res = await api.placeOrder(payload);
        if(res.success) {
            alert("Đặt món thành công! Mã đơn: " + res.order_id);
            setCartItems([]);
            setIsCartOpen(false);
        }
    } catch(e) { alert("Lỗi đặt món"); }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <CategorySidebar categories={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl text-gray-800 mb-2">Vietnamese Restaurant</h1>
              <p className="text-gray-600">Discover authentic flavors</p>
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={28} className="text-gray-700" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map(food => (
              <FoodCard key={food.id} food={food} onAddToCart={handleAddToCart} isMember={customer !== null} />
            ))}
          </div>
        </main>
      </div>
      <CartButton itemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onClick={() => setIsCartOpen(true)} />
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} isLoggedIn={customer !== null} customerName={customer?.name} onLoginClick={() => { setIsMenuOpen(false); setIsCustomerAuthOpen(true); }} onLogoutClick={handleCustomerLogout} />
      {isCustomerAuthOpen && <CustomerAuth onClose={() => setIsCustomerAuthOpen(false)} onLogin={handleCustomerLogin} onRegister={handleRegisterCustomer} />}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} isMember={customer !== null} onCheckout={handleCheckout} />
    </>
  );
}
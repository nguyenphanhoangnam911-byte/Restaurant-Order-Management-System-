import { useState } from 'react';
import { Menu, Coffee, Soup, UtensilsCrossed, IceCream } from 'lucide-react';
import { CategorySidebar } from './components/CategorySidebar';
import { FoodCard } from './components/FoodCard';
import { MenuDrawer } from './components/MenuDrawer';
import { CartButton } from './components/CartButton';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomerAuth } from './components/customer/CustomerAuth';
import { Cart } from './components/customer/Cart';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface Customer {
  name: string;
  phone: string;
}

interface CartItem extends FoodItem {
  quantity: number;
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState('main-dishes');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [registeredCustomers, setRegisteredCustomers] = useState<{ phone: string; password: string; name: string }[]>([
    { phone: '0912345678', password: '123456', name: 'John Doe' }
  ]);

  const categories: Category[] = [
    { id: 'main-dishes', name: 'Món Chính', icon: <UtensilsCrossed size={20} /> },
    { id: 'soups', name: 'Món Nước', icon: <Soup size={20} /> },
    { id: 'drinks', name: 'Đồ Uống', icon: <Coffee size={20} /> },
    { id: 'desserts', name: 'Tráng Miệng', icon: <IceCream size={20} /> },
  ];

  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: '1',
      name: 'Phở Bò Tái',
      description: 'Phở bò tái truyền thống với nước dùng thanh ngọt, thịt bò tái mềm',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwbm9vZGxlfGVufDF8fHx8MTc2Nzc4NDI4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      categoryId: 'soups',
    },
    {
      id: '2',
      name: 'Bánh Mì Thịt Nướng',
      description: 'Bánh mì giòn rụm với thịt nướng thơm lừng, rau sống tươi ngon',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1599719455360-ff0be7c4dd06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5oJTIwbWklMjBzYW5kd2ljaHxlbnwxfHx8fDE3Njc4MTI2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      categoryId: 'main-dishes',
    },
    {
      id: '3',
      name: 'Cơm Chiên Dương Châu',
      description: 'Cơm chiên thập cẩm với tôm, thịt, trứng và rau củ đầy đủ',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1646340916384-9845d7686e2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2UlMjBhc2lhbnxlbnwxfHx8fDE3Njc4MDY0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      categoryId: 'main-dishes',
    },
    {
      id: '4',
      name: 'Gỏi Cuốn Tôm Thịt',
      description: 'Gỏi cuốn tươi mát với tôm, thịt heo và rau sống, chấm mắm nêm',
      price: 30000,
      image: 'https://images.unsplash.com/photo-1656945843375-207bb6e47750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjByb2xscyUyMHZpZXRuYW1lc2V8ZW58MXx8fHwxNzY3NzM4MzM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      categoryId: 'main-dishes',
    },
    {
      id: '5',
      name: 'Cơm Gà Nướng',
      description: 'Cơm với gà nướng thơm phức, kèm rau củ và nước sốt đặc biệt',
      price: 40000,
      image: 'https://images.unsplash.com/photo-1698556410824-4059a7ba055d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMHJpY2V8ZW58MXx8fHwxNzY3ODEyOTMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      categoryId: 'main-dishes',
    },
    {
      id: '6',
      name: 'Bò Xào Rau Củ',
      description: 'Thịt bò xào mềm với rau củ tươi ngon, đậm đà',
      price: 50000,
      image: 'https://images.unsplash.com/photo-1708388464878-5df2d66b758e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RpciUyMGZyeXxlbnwxfHx8fDE3Njc3MTg2Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      categoryId: 'main-dishes',
    },
    {
      id: '7',
      name: 'Cà Phê Sữa Đá',
      description: 'Cà phê phin truyền thống với sữa đặc ngọt ngào',
      price: 20000,
      image: 'https://images.unsplash.com/photo-1471922597728-92f81bfe2445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY29mZmVlfGVufDF8fHx8MTc2NzgwMDA2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      categoryId: 'drinks',
    },
    {
      id: '8',
      name: 'Trà Sữa Trân Châu',
      description: 'Trà sữa ngọt ngào với trân châu dai dai, thơm ngon',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1670468642364-6cacadfb7bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBkcmlua3xlbnwxfHx8fDE3Njc4MTI5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      categoryId: 'drinks',
    },
  ]);

  const filteredFoods = foodItems.filter(food => food.categoryId === activeCategory);

  const handleAddToCart = (food: FoodItem) => {
    const existingItem = cartItems.find(item => item.id === food.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }]);
    }
  };

  const handleCartClick = () => {
    alert(`Bạn có ${cartItems.length} món trong giỏ hàng!`);
  };

  const handleAdminLogin = (username: string, password: string) => {
    // Demo credentials
    if (username === 'admin' && password === 'admin123') {
      setIsAdminLoggedIn(true);
    } else {
      alert('Invalid username or password!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminMode(false);
  };

  const handleCustomerLogin = (phone: string, password: string) => {
    const registeredCustomer = registeredCustomers.find(c => c.phone === phone && c.password === password);
    if (registeredCustomer) {
      setCustomer({ name: registeredCustomer.name, phone: registeredCustomer.phone });
      setIsCustomerAuthOpen(false);
    } else {
      alert('Invalid phone number or password!');
    }
  };

  const handleCustomerLogout = () => {
    setCustomer(null);
  };

  const handleRegisterCustomer = (name: string, phone: string, password: string) => {
    const isPhoneExists = registeredCustomers.some(c => c.phone === phone);
    if (isPhoneExists) {
      alert('Phone number already exists!');
    } else {
      setRegisteredCustomers([...registeredCustomers, { name, phone, password }]);
      setCustomer({ name, phone });
      setIsCustomerAuthOpen(false);
    }
  };

  // Show admin login if admin mode is active but not logged in
  if (isAdminMode && !isAdminLoggedIn) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  // Show admin dashboard if logged in
  if (isAdminMode && isAdminLoggedIn) {
    return (
      <AdminDashboard 
        foods={foodItems} 
        onLogout={handleAdminLogout}
        onUpdateFoods={setFoodItems}
      />
    );
  }

  // Customer view
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar bên trái */}
      <CategorySidebar 
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Nội dung chính */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl text-gray-800 mb-2">Vietnamese Restaurant</h1>
            <p className="text-gray-600">Discover authentic flavors</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Nút Admin */}
            <button
              onClick={() => setIsAdminMode(true)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Admin
            </button>
            
            {/* Nút menu 3 gạch góc trên bên phải */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={28} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Lưới món ăn */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map(food => (
            <FoodCard 
              key={food.id} 
              food={food}
              onAddToCart={handleAddToCart}
              isMember={customer !== null}
            />
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No dishes in this category</p>
          </div>
        )}
      </main>

      {/* Menu drawer */}
      <MenuDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        isLoggedIn={customer !== null}
        customerName={customer?.name}
        onLoginClick={() => setIsCustomerAuthOpen(true)}
        onLogoutClick={handleCustomerLogout}
      />

      {/* Nút giỏ hàng góc phải dưới */}
      <CartButton 
        itemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onClick={() => setIsCartOpen(true)} 
      />

      {/* Customer Auth */}
      {isCustomerAuthOpen && (
        <CustomerAuth
          onClose={() => setIsCustomerAuthOpen(false)}
          onLogin={handleCustomerLogin}
          onRegister={handleRegisterCustomer}
        />
      )}

      {/* Cart */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(id, quantity) => {
          setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, quantity } : item
          ));
        }}
        onRemoveItem={(id) => {
          setCartItems(cartItems.filter(item => item.id !== id));
        }}
        isMember={customer !== null}
      />
    </div>
  );
}
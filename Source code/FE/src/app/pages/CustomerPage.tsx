import { useState, useEffect } from 'react';
import { UtensilsCrossed, Soup, Coffee, IceCream, Menu, MapPin, QrCode, X } from 'lucide-react';
import { CategorySidebar } from '@/app/components/CategorySidebar';
import { FoodCard } from '@/app/components/FoodCard';
import { MenuDrawer } from '@/app/components/MenuDrawer';
import { CartButton } from '@/app/components/CartButton';
import { CustomerAuth } from '@/app/components/customer/CustomerAuth';
import { Cart } from '@/app/components/customer/Cart';
import { api } from '@/services/api';
import QrScanner from 'react-qr-scanner';

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

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('main-dishes');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  
  // STATE SỐ BÀN & CAMERA
  const [tableNumber, setTableNumber] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false); // Trạng thái bật/tắt camera

  // 1. Tự động kiểm tra URL trước (Phòng trường hợp khách quét bằng app Zalo/Camera thường)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table'); 
    if (tableParam) {
      setTableNumber(parseInt(tableParam));
      sessionStorage.setItem('currentTable', tableParam);
    } else {
      const savedTable = sessionStorage.getItem('currentTable');
      if (savedTable) setTableNumber(parseInt(savedTable));
    }
  }, []);

  // 2. Tải Menu
  useEffect(() => {
    const loadMenu = async () => {
        const data = await api.getMenu();
        if(data) setFoodItems(data);
    }
    loadMenu();
  }, []);

  // 3. HÀM XỬ LÝ KHI CAMERA QUÉT ĐƯỢC MÃ
  const handleScan = (data: any) => {
    if (data && data.text) {
      try {
        // data.text sẽ là cái link: "http://192.168.1.5:5173?table=5"
        // Mình cần cắt lấy số 5
        const url = new URL(data.text);
        const tableParam = url.searchParams.get('table');
        
        if (tableParam) {
          const num = parseInt(tableParam);
          setTableNumber(num);
          sessionStorage.setItem('currentTable', tableParam);
          setIsScanning(false); // Tắt camera
          alert(` Đã nhận diện Bàn số ${num}!`);
        }
      } catch (error) {
        console.log("Đang dò mã...");
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    // Không alert lỗi để tránh spam popup
  };

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
    if (quantity === 0) setCartItems(cartItems.filter(item => item.id !== id));
    else setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
  };
  const handleRemoveItem = (id: string) => setCartItems(cartItems.filter(item => item.id !== id));
  
  const handleCustomerLogin = async (phone: string, password: string) => {
    try {
        const res = await api.customerLogin(phone, password);
        if (res.success) { setCustomer({ name: res.name, phone: phone }); setIsCustomerAuthOpen(false); }
        else { alert(res.message); }
    } catch(e) { alert("Lỗi kết nối server"); }
  };
  const handleCustomerLogout = () => setCustomer(null);
  const handleRegisterCustomer = async (name: string, phone: string, password: string) => {
    try {
        const res = await api.customerRegister(name, phone, password);
        if (res.success) { alert("Đăng ký thành công!"); handleCustomerLogin(phone, password); }
        else { alert(res.message); }
    } catch(e) { alert("Lỗi kết nối server"); }
  };

  const handleCheckout = async () => {
    if(cartItems.length === 0) return;

    // 1. Kiểm tra kỹ số bàn
    if (tableNumber === 0) {
        alert("⚠️ Vui lòng quét mã QR dán trên bàn để gọi món!");
        setIsScanning(true);
        return;
    }

    try {
        console.log("Đang đặt món cho bàn:", tableNumber); // Debug log

        const payload = {
            tableNumber: tableNumber,   
            table_number: tableNumber,  
            table_id: tableNumber,      
            
            member_phone: customer?.phone,
            items: cartItems.map(i => ({ 
                item_id: i.id, 
                quantity: i.quantity,
                name: i.name,  
                price: i.price
            })),
            total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }        
        const res = await api.placeOrder(payload);       
        if(res.success) {
            alert(` Đặt món thành công cho Bàn ${tableNumber}!`);
            setCartItems([]);
            setIsCartOpen(false);
        } else {
            // Nếu backend trả về lỗi, hiện thông báo 
            alert("Lỗi từ server: " + (res.message || "Không xác định"));
        }
    } catch(e) { 
        console.error(e);
        alert("Lỗi kết nối khi đặt món"); 
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <CategorySidebar categories={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl text-gray-800 mb-2 font-bold">Vietnamese Restaurant</h1>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2">
                    <MapPin size={18} className={tableNumber > 0 ? "text-green-600" : "text-gray-400"} />
                    {tableNumber > 0 ? (
                        <span className="text-green-600 font-medium text-lg">Bàn {tableNumber}</span>
                    ) : (
                        <span className="text-orange-500 font-medium">Chưa chọn bàn</span>
                    )}
                 </div>
                 
                 {}
                 <button 
                    onClick={() => setIsScanning(true)}
                    className="flex items-center gap-2 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                 >
                    <QrCode size={16} />
                    {tableNumber > 0 ? "Quét lại" : "Quét mã QR"}
                 </button>
              </div>
            </div>
            
            <button onClick={() => setIsMenuOpen(true)} className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={28} className="text-gray-700" />
            </button>
          </div>

          {/* DANH SÁCH MÓN ĂN */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map(food => (
              <FoodCard key={food.id} food={food} onAddToCart={handleAddToCart} isMember={customer !== null} />
            ))}
          </div>

          {/* --- GIAO DIỆN QUÉT CAMERA (MODAL) --- */}
          {isScanning && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
                <div className="relative w-full max-w-md bg-transparent rounded-2xl overflow-hidden border-2 border-orange-500">
                    {/* Camera */}
                    <QrScanner
                        delay={300}
                        style={{ width: '100%', height: '100%' }}
                        onError={handleError}
                        onScan={handleScan}
                        // Dùng camera sau (environment) trên điện thoại
                        constraints={{ video: { facingMode: "environment" } }} 
                    />
                    
                    {/* Khung ngắm */}
                    <div className="absolute inset-0 border-2 border-transparent">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-orange-400 rounded-lg shadow-[0_0_100px_rgba(0,0,0,0.5)]"></div>
                        <p className="absolute bottom-10 left-0 right-0 text-center text-white font-medium shadow-black drop-shadow-md">
                            Di chuyển camera vào mã QR
                        </p>
                    </div>

                    {/* Nút đóng */}
                    <button 
                        onClick={() => setIsScanning(false)}
                        className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 backdrop-blur-sm"
                    >
                        <X size={24} />
                    </button>
                </div>
                <p className="text-gray-400 text-sm mt-4 text-center">Nếu camera không bật, hãy cấp quyền truy cập máy ảnh.</p>
            </div>
          )}

        </main>
      </div>

      <CartButton itemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onClick={() => setIsCartOpen(true)} />
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} isLoggedIn={customer !== null} customerName={customer?.name} onLoginClick={() => { setIsMenuOpen(false); setIsCustomerAuthOpen(true); }} onLogoutClick={handleCustomerLogout} />
      {isCustomerAuthOpen && <CustomerAuth onClose={() => setIsCustomerAuthOpen(false)} onLogin={handleCustomerLogin} onRegister={handleRegisterCustomer} />}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} isMember={customer !== null} onCheckout={handleCheckout} />
    </>
  );
}
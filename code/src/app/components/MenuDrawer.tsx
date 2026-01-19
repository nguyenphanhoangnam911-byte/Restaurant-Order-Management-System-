import { X, User, Settings, LogOut, Heart, LogIn } from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  customerName?: string;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export function MenuDrawer({ isOpen, onClose, isLoggedIn, customerName, onLoginClick, onLogoutClick }: MenuDrawerProps) {
  if (!isOpen) return null;

  const handleLoginClick = () => {
    onLoginClick();
    onClose();
  };

  const handleLogoutClick = () => {
    onLogoutClick();
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl text-gray-800">Menu</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {isLoggedIn && customerName && (
            <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
                  {customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-gray-800">{customerName}</p>
                  <p className="text-xs text-orange-600">Member - 5% Off</p>
                </div>
              </div>
            </div>
          )}

          <nav className="space-y-2">
            {!isLoggedIn ? (
              <button
                onClick={handleLoginClick}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                <LogIn size={20} />
                <span>Login / Register</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    console.log('Tài khoản');
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <User size={20} />
                  <span>Account</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Yêu thích');
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <Heart size={20} />
                  <span>Favorites</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Cài đặt');
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
import { ShoppingCart } from 'lucide-react';

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
}

export function CartButton({ itemCount, onClick }: CartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-30"
    >
      <ShoppingCart size={24} />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}

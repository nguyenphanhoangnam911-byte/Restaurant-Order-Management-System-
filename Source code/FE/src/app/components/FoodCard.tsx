import { Plus } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface FoodCardProps {
  food: FoodItem;
  onAddToCart: (food: FoodItem) => void;
  isMember?: boolean;
}

export function FoodCard({ food, onAddToCart, isMember = false }: FoodCardProps) {
  const discountedPrice = isMember ? food.price * 0.95 : food.price;
  
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={food.image} 
          alt={food.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg text-gray-800 mb-2">{food.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{food.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {isMember && (
              <span className="text-xs text-gray-400 line-through">{food.price.toLocaleString('vi-VN')}đ</span>
            )}
            <span className="text-orange-500">
              {discountedPrice.toLocaleString('vi-VN')}đ
              {isMember && <span className="ml-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">-5%</span>}
            </span>
          </div>
          <button 
            onClick={() => onAddToCart(food)}
            className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
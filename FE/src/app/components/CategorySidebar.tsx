import { Coffee, Soup, UtensilsCrossed, IceCream } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface CategorySidebarProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategorySidebar({ categories, activeCategory, onSelectCategory }: CategorySidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 h-screen sticky top-0">
      <h2 className="text-xl mb-6 text-gray-800">Categories</h2>
      <nav className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeCategory === category.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
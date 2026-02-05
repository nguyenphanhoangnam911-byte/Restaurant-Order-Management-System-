import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

interface MenuManagementProps {
  foods: FoodItem[];
  onAddFood: (food: Omit<FoodItem, 'id'>) => void;
  onUpdateFood: (id: string, food: Partial<FoodItem>) => void;
  onDeleteFood: (id: string) => void;
}

export function MenuManagement({ foods, onAddFood, onUpdateFood, onDeleteFood }: MenuManagementProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    categoryId: 'main-dishes',
  });

  const handleSaveNew = () => {
    if (formData.name && formData.price > 0) {
      onAddFood(formData);
      setFormData({
        name: '',
        description: '',
        price: 0,
        image: '',
        categoryId: 'main-dishes',
      });
      setIsAdding(false);
    }
  };

  const handleEdit = (food: FoodItem) => {
    setEditingId(food.id);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      image: food.image,
      categoryId: food.categoryId,
    });
  };

  const handleSaveEdit = () => {
    if (editingId) {
      onUpdateFood(editingId, formData);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        image: '',
        categoryId: 'main-dishes',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-gray-800">Menu Management</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          {isAdding ? <X size={20} /> : <Plus size={20} />}
          {isAdding ? 'Cancel' : 'Add Dish'}
        </button>
      </div>

      {/* Form thêm mới */}
      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg text-gray-800 mb-4">Add New Dish</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Dish name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="number"
              placeholder="Price (đ)"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 col-span-2"
            />
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="main-dishes">Main Dishes</option>
              <option value="soups">Soups</option>
              <option value="drinks">Drinks</option>
              <option value="desserts">Desserts</option>
            </select>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 col-span-2"
              rows={3}
            />
          </div>
          <button
            onClick={handleSaveNew}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Save size={20} />
            Save
          </button>
        </div>
      )}

      {/* Danh sách món */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm text-gray-700">Dish Name</th>
              <th className="px-6 py-3 text-left text-sm text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-sm text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {foods.map((food) => (
              <tr key={food.id} className="hover:bg-gray-50">
                {editingId === food.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="main-dishes">Main Dishes</option>
                        <option value="soups">Soups</option>
                        <option value="drinks">Drinks</option>
                        <option value="desserts">Desserts</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="px-2 py-1 border border-gray-300 rounded w-24"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-800">{food.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{food.categoryId}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{food.price.toLocaleString('vi-VN')}đ</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(food)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => onDeleteFood(food.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
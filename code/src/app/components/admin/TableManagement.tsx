import { Users, CheckCircle, XCircle } from 'lucide-react';

interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: string;
}

interface TableManagementProps {
  tables: Table[];
  onUpdateTableStatus: (id: string, status: Table['status']) => void;
}

export function TableManagement({ tables, onUpdateTableStatus }: TableManagementProps) {
  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'occupied':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const getStatusText = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'occupied':
        return 'Occupied';
      case 'reserved':
        return 'Reserved';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-gray-800">Table Management</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-600">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">Reserved</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`p-6 rounded-lg border-2 ${getStatusColor(table.status)} transition-all hover:shadow-md`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl mb-1">Table {table.number}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <Users size={16} />
                  <span>{table.seats} seats</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs">
                {getStatusText(table.status)}
              </span>
            </div>

            {table.currentOrder && (
              <p className="text-sm mb-3">Order: #{table.currentOrder}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onUpdateTableStatus(table.id, 'available')}
                className="flex-1 bg-green-500 text-white py-2 px-3 rounded hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-1"
                disabled={table.status === 'available'}
              >
                <CheckCircle size={16} />
                Available
              </button>
              <button
                onClick={() => onUpdateTableStatus(table.id, 'occupied')}
                className="flex-1 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-1"
                disabled={table.status === 'occupied'}
              >
                <XCircle size={16} />
                Occupied
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
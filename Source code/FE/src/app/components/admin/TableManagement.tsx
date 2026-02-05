import { QrCode, CheckCircle, XCircle, Users } from 'lucide-react';

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
  onAddTable: () => void; // <--- Thêm cái này
}

export function TableManagement({ tables, onUpdateTableStatus, onAddTable }: TableManagementProps) {
  
  const getQRUrl = (tableNum: number) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}?table=${tableNum}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(link)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Table Management</h2>
        
        {}
        <button 
            onClick={onAddTable}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium flex items-center gap-2"
        >
          <span>+ Add Table</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative group transition-all hover:shadow-md">
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Table {table.number}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                   <Users size={16} />
                   <span>{table.seats} Seats</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                table.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {table.status === 'available' ? 'AVAILABLE' : 'OCCUPIED'}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
               <img src={getQRUrl(table.number)} alt={`QR Table ${table.number}`} className="w-32 h-32 mix-blend-multiply"/>
               <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <QrCode size={14} /> <span>Scan to order</span>
               </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => onUpdateTableStatus(table.id, 'available')}
                disabled={table.status === 'available'}
                className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 font-medium flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <CheckCircle size={16} /> Free
              </button>
              <button 
                onClick={() => onUpdateTableStatus(table.id, 'occupied')}
                disabled={table.status === 'occupied'}
                className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <XCircle size={16} /> Busy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
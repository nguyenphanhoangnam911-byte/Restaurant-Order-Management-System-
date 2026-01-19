import { DollarSign, Calendar, TrendingUp } from "lucide-react";

interface Transaction {
  id: string;
  orderId: string;
  tableNumber: number;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  completedAt: Date;
  paymentMethod: "cash" | "card";
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({
  transactions,
}: TransactionHistoryProps) {
  const totalRevenue = transactions.reduce(
    (sum, t) => sum + t.total,
    0,
  );
  const cashTotal = transactions
    .filter((t) => t.paymentMethod === "cash")
    .reduce((sum, t) => sum + t.total, 0);
  const cardTotal = transactions
    .filter((t) => t.paymentMethod === "card")
    .reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-gray-800">
          Transaction History
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-sm text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm opacity-90">
              Total Revenue
            </h3>
            <TrendingUp size={20} />
          </div>
          <p className="text-3xl">
            {totalRevenue.toLocaleString("vi-VN")}đ
          </p>
          <p className="text-xs opacity-75 mt-2">
            {transactions.length} transactions
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600">
              Cash Payment
            </h3>
            <DollarSign size={20} className="text-green-500" />
          </div>
          <p className="text-2xl text-gray-800">
            {cashTotal.toLocaleString("vi-VN")}đ
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {
              transactions.filter(
                (t) => t.paymentMethod === "cash",
              ).length
            }{" "}
            transactions
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600">
              Card Payment
            </h3>
            <DollarSign size={20} className="text-blue-500" />
          </div>
          <p className="text-2xl text-gray-800">
            {cardTotal.toLocaleString("vi-VN")}đ
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {
              transactions.filter(
                (t) => t.paymentMethod === "card",
              ).length
            }{" "}
            transactions
          </p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-700">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-sm text-gray-700">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm text-gray-700">
                  Table
                </th>
                <th className="px-6 py-3 text-left text-sm text-gray-700">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-sm text-gray-700">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-sm text-gray-700">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No transactions today
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {transaction.completedAt.toLocaleTimeString(
                        "vi-VN",
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      #{transaction.orderId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      Table {transaction.tableNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="max-w-xs">
                        {transaction.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="block truncate"
                          >
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          transaction.paymentMethod === "cash"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {transaction.paymentMethod === "cash"
                          ? "Cash"
                          : "Card"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-orange-600">
                      {transaction.total.toLocaleString(
                        "vi-VN",
                      )}
                      đ
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm text-gray-600 mb-4">
              Average Transaction
            </h3>
            <p className="text-2xl text-gray-800">
              {Math.round(
                totalRevenue / transactions.length,
              ).toLocaleString("vi-VN")}
              đ
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm text-gray-600 mb-4">
              Peak Hour
            </h3>
            <p className="text-2xl text-gray-800">
              {transactions.length > 0
                ? new Date(
                    Math.max(
                      ...transactions.map((t) =>
                        t.completedAt.getTime(),
                      ),
                    ),
                  ).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Package, Download, FileText, Calendar, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    total: number;
    product: {
      id: string;
      name: string;
      description: string;
    };
  }>;
  licenses: Array<{
    id: string;
    licenseKey: string;
    status: string;
  }>;
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get<Order[]>('/payment/orders');
      setOrders(response);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING':
      case 'PROCESSING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'CANCELLED':
      case 'REFUNDED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      <DollarSign className="w-5 h-5 inline" />
                      {Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <h3 className="font-semibold text-gray-900">Items</h3>
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${Number(item.total).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {order.licenses.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">License Keys</h3>
                    <div className="space-y-2">
                      {order.licenses.map((license) => (
                        <div
                          key={license.id}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <code className="font-mono text-sm text-gray-900">{license.licenseKey}</code>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            license.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {license.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 flex gap-3">
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

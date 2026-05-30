import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Download, Home, FileText, Package } from 'lucide-react';
import { api } from '../lib/api';

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: Array<{
    product: {
      name: string;
    };
  }>;
}

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = location.state?.orderId || id;
    if (orderId) {
      fetchOrder(orderId);
    } else {
      navigate('/');
    }
  }, [location, id, navigate]);

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await api.get<Order>(`/payment/orders/${orderId}`);
      setOrder(response);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono font-semibold text-gray-900">{order.id}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Items Purchased</p>
            {order.orderItems.map((item, index) => (
              <p key={index} className="text-sm font-medium text-gray-900">
                {item.product.name}
              </p>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/licenses')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              View License Keys
            </button>

            <button
              onClick={() => navigate('/invoices')}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              View Invoice
            </button>

            <button
              onClick={() => navigate('/orders')}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              View Order History
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-3 text-gray-600 hover:text-gray-900 transition flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Return to Home
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check your email for order confirmation</li>
            <li>• Your license keys are available in your account</li>
            <li>• Download your products from the order page</li>
            <li>• Contact support if you have any questions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

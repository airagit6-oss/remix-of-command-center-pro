import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { RefreshCw, DollarSign, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Refund {
  id: string;
  orderId: string;
  amount: number;
  reason: string | null;
  status: string;
  processedAt: string | null;
  createdAt: string;
}

export default function RefundsPage() {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ amount: '', reason: '' });

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      const response = await api.get<Refund[]>('/payment/refunds');
      setRefunds(response);
    } catch (error) {
      console.error('Failed to fetch refunds:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestRefund = async () => {
    if (!selectedOrderId || !formData.amount) {
      alert('Please fill in all fields');
      return;
    }

    setRequestingId(selectedOrderId);
    try {
      await api.post('/payment/refund', {
        orderId: selectedOrderId,
        amount: parseFloat(formData.amount),
        reason: formData.reason
      });
      await fetchRefunds();
      setShowModal(false);
      setFormData({ amount: '', reason: '' });
      setSelectedOrderId(null);
      alert('Refund request submitted successfully');
    } catch (error) {
      console.error('Failed to request refund:', error);
      alert('Failed to request refund. Please try again.');
    } finally {
      setRequestingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Refunds</h1>

        {refunds.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <RefreshCw className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No refunds yet</h2>
            <p className="text-gray-500 mb-6">Your refund requests will appear here</p>
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              View Orders
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {refunds.map((refund) => (
              <div key={refund.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(refund.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(refund.status)}`}>
                        {refund.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Order ID: {refund.orderId}</p>
                    <p className="text-sm text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Requested: {new Date(refund.createdAt).toLocaleDateString()}
                    </p>
                    {refund.processedAt && (
                      <p className="text-sm text-gray-500">
                        Processed: {new Date(refund.processedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      <DollarSign className="w-5 h-5 inline" />
                      {Number(refund.amount).toFixed(2)}
                    </p>
                  </div>
                </div>

                {refund.reason && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Reason</h3>
                    <p className="text-sm text-gray-600">{refund.reason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Refund</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter reason for refund"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={requestRefund}
                  disabled={requestingId !== null}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {requestingId ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

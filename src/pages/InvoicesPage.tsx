// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { FileText, Download, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: string;
  paidAt: string | null;
  dueDate: string | null;
  createdAt: string;
  order: {
    id: string;
    orderItems: Array<{
      product: {
        name: string;
      };
    }>;
  };
}

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get<Invoice[]>('/invoices');
      setInvoices(response);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download invoice:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Invoices</h1>

        {invoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No invoices yet</h2>
            <p className="text-gray-500 mb-6">Your invoices will appear here after you make a purchase</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(invoice.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Invoice #: {invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      <DollarSign className="w-5 h-5 inline" />
                      {Number(invoice.total).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <h3 className="font-semibold text-gray-900">Items</h3>
                  {invoice.order.orderItems.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {item.product.name}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4 flex gap-3">
                  <button
                    onClick={() => downloadInvoice(invoice.id)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
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
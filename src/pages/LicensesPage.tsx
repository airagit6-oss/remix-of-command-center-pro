import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Key, Copy, CheckCircle, Clock, XCircle, Monitor, RefreshCw } from 'lucide-react';

interface License {
  id: string;
  licenseKey: string;
  type: string;
  status: string;
  validFrom: string;
  validUntil: string | null;
  maxActivations: number;
  currentActivations: number;
  order: {
    orderItems: Array<{
      product: {
        name: string;
      };
    }>;
  };
  activations: Array<{
    id: string;
    deviceName: string | null;
    activatedAt: string;
    lastSeenAt: string;
    isActive: boolean;
  }>;
}

export default function LicensesPage() {
  const navigate = useNavigate();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const response = await api.get<License[]>('/licenses');
      setLicenses(response);
    } catch (error) {
      console.error('Failed to fetch licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    // Use a timeout for UI feedback only, not for business logic
    const timeoutId = setTimeout(() => setCopiedKey(null), 2000);
    return () => clearTimeout(timeoutId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'EXPIRED':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'REVOKED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Key className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVOKED':
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">License Keys</h1>

        {licenses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Key className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No licenses yet</h2>
            <p className="text-gray-500 mb-6">Your license keys will appear here after you make a purchase</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {licenses.map((license) => (
              <div key={license.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(license.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(license.status)}`}>
                        {license.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Type: {license.type}</p>
                    <p className="text-sm text-gray-500">
                      Valid from: {new Date(license.validFrom).toLocaleDateString()}
                    </p>
                    {license.validUntil && (
                      <p className="text-sm text-gray-500">
                        Valid until: {new Date(license.validUntil).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {license.currentActivations} / {license.maxActivations} activations
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <code className="font-mono text-sm text-gray-900">{license.licenseKey}</code>
                    <button
                      onClick={() => copyToClipboard(license.licenseKey)}
                      className="p-2 hover:bg-gray-200 rounded transition"
                    >
                      {copiedKey === license.licenseKey ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Product</h3>
                  <p className="text-sm text-gray-600">
                    {license.order.orderItems[0]?.product.name || 'Unknown Product'}
                  </p>
                </div>

                {license.activations.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Active Devices</h3>
                    <div className="space-y-2">
                      {license.activations.map((activation) => (
                        <div
                          key={activation.id}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-900">
                              {activation.deviceName || 'Unknown Device'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last seen: {new Date(activation.lastSeenAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

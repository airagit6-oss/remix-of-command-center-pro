import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  Download,
  Send,
  MessageSquare,
  FileText,
  ExternalLink,
} from 'lucide-react';
import {
  testDummyProducts,
} from '../../tests/authorEndToEndTest';
// Note: approvalWorkflow moved to tests/authorEndToEndTest - update usage if needed

interface ApprovalProduct {
  id: string;
  name: string;
  description: string;
  authorName: string;
  status: string;
  approvalStatus: string;
  fileSize: string;
  demoUrl?: string;
  metaTags: any;
  checks: any;
  timeline: any;
  files?: any[];
}

export const MarketplaceManagerApprovalsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [products, setProducts] = useState<ApprovalProduct[]>(testDummyProducts.filter(p => p.approvalStatus === 'PENDING_REVIEW'));
  const [selectedProduct, setSelectedProduct] = useState<ApprovalProduct | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('PENDING_REVIEW');
  const [allReviews, setAllReviews] = useState<any[]>([]);

  const handleApprove = (productId: string) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        setAllReviews([
          ...allReviews,
          {
            productId,
            action: 'APPROVED',
            timestamp: new Date().toISOString(),
            manager: 'marketplace-manager-001',
            notes: reviewNotes,
            feedback: 'Product meets all marketplace standards',
          },
        ]);
        return { ...p, approvalStatus: 'APPROVED', status: 'APPROVED' };
      }
      return p;
    });
    setProducts(updated.filter(p => p.approvalStatus !== 'APPROVED'));
    setSelectedProduct(null);
    setReviewNotes('');
  };

  const handleReject = (productId: string, reason: string) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        setAllReviews([
          ...allReviews,
          {
            productId,
            action: 'REJECTED',
            timestamp: new Date().toISOString(),
            manager: 'marketplace-manager-001',
            reason,
            feedback: feedbackText,
          },
        ]);
        return { ...p, approvalStatus: 'REJECTED', status: 'REJECTED' };
      }
      return p;
    });
    setProducts(updated.filter(p => p.approvalStatus !== 'REJECTED'));
    setSelectedProduct(null);
    setFeedbackText('');
    setReviewNotes('');
  };

  const handleRequestChanges = (productId: string) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        setAllReviews([
          ...allReviews,
          {
            productId,
            action: 'NEEDS_CHANGES',
            timestamp: new Date().toISOString(),
            manager: 'marketplace-manager-001',
            changeRequests: reviewNotes,
          },
        ]);
        return { ...p, approvalStatus: 'NEEDS_CHANGES', status: 'NEEDS_CHANGES' };
      }
      return p;
    });
    setProducts(updated.filter(p => p.approvalStatus !== 'NEEDS_CHANGES'));
    setSelectedProduct(null);
    setReviewNotes('');
  };

  const stats = {
    total: testDummyProducts.length,
    pending: products.length,
    approved: allReviews.filter((r: any) => r.action === 'APPROVED').length,
    rejected: allReviews.filter((r: any) => r.action === 'REJECTED').length,
    needsChanges: allReviews.filter((r: any) => r.action === 'NEEDS_CHANGES').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">👨‍💼 Marketplace Manager Dashboard</h1>
          <p className="text-slate-400">Review and approve products submitted for publication</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Products', value: stats.total, icon: '📦', color: 'bg-blue-500/10 text-blue-400' },
            { label: 'Pending Review', value: stats.pending, icon: '⏳', color: 'bg-amber-500/10 text-amber-400' },
            { label: 'Approved', value: stats.approved, icon: '✅', color: 'bg-emerald-500/10 text-emerald-400' },
            { label: 'Rejected', value: stats.rejected, icon: '❌', color: 'bg-red-500/10 text-red-400' },
            { label: 'Needs Changes', value: stats.needsChanges, icon: '🔄', color: 'bg-purple-500/10 text-purple-400' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} rounded-lg p-4 text-center border border-slate-700`}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-xs text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">📋 Pending Submissions ({products.length})</h2>

            {products.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
                <CheckCircle2 size={48} className="mx-auto text-emerald-400 mb-4" />
                <p className="text-slate-300 text-lg font-semibold">All caught up!</p>
                <p className="text-slate-400">No products pending review at the moment.</p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`bg-slate-800/50 border-2 rounded-lg p-4 cursor-pointer transition hover:border-blue-500 ${
                    selectedProduct?.id === product.id ? 'border-blue-500 bg-blue-500/5' : 'border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{product.name}</h3>
                      <p className="text-sm text-slate-400">{product.authorName}</p>
                    </div>
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium">
                      {product.approvalStatus}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 line-clamp-2 mb-2">{product.description}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>📦 {product.fileSize}</span>
                    {product.demoUrl && <span>🎬 Demo available</span>}
                    <span className="ml-auto text-xs text-slate-400">
                      {product.timeline?.pendingSince && `⏱️ ${product.timeline.pendingSince}`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Review Panel */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 h-fit sticky top-6">
            {selectedProduct ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">📑 Review Details</h3>

                  {/* Product Info */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                    <div>
                      <p className="text-xs text-slate-400">Product</p>
                      <p className="text-white font-semibold">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Author</p>
                      <p className="text-white">{selectedProduct.authorName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">File Size</p>
                      <p className="text-white">{selectedProduct.fileSize}</p>
                    </div>
                    {selectedProduct.demoUrl && (
                      <div>
                        <p className="text-xs text-slate-400">Demo URL</p>
                        <a
                          href={selectedProduct.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                        >
                          <ExternalLink size={14} />
                          Test Demo
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Meta Tags Check */}
                  <div className="mb-6 pb-6 border-b border-slate-700">
                    <p className="text-xs text-slate-400 mb-2">Meta Tags Status</p>
                    <div className="space-y-2">
                      {selectedProduct.checks?.metaTags?.status === 'passed' ? (
                        <div className="flex items-center gap-2 text-emerald-400 text-sm">
                          <CheckCircle2 size={16} />
                          All required meta tags present
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                          <XCircle size={16} />
                          Meta tags missing or invalid
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Notes */}
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Review Notes</label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add feedback or change requests..."
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm h-24"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleApprove(selectedProduct.id)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <CheckCircle2 size={18} />
                    Approve & Publish
                  </button>

                  <button
                    onClick={() => handleRequestChanges(selectedProduct.id)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <AlertCircle size={18} />
                    Request Changes
                  </button>

                  <button
                    onClick={() => setFeedbackText('Issues found') || handleReject(selectedProduct.id, 'Rejected by marketplace manager')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>

                  {selectedProduct.demoUrl && (
                    <button
                      onClick={() => window.open(selectedProduct.demoUrl, '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <Eye size={18} />
                      View Demo
                    </button>
                  )}
                </div>

                {selectedProduct.files && selectedProduct.files.length > 0 && (
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-400 mb-2">Files</p>
                    <div className="space-y-1">
                      {selectedProduct.files.map((file: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-300 hover:text-blue-400 cursor-pointer">
                          <FileText size={14} />
                          <span className="truncate">{file.name}</span>
                          <span className="text-xs text-slate-500">({file.size})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare size={32} className="mx-auto text-slate-600 mb-2" />
                <p className="text-slate-400">Select a product to review</p>
              </div>
            )}
          </div>
        </div>

        {/* Review History */}
        {allReviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">📜 Review History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allReviews.map((review, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.action === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : review.action === 'REJECTED'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {review.action}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(review.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Product ID: <span className="font-mono text-xs text-slate-400">{review.productId}</span>
                  </p>
                  {review.feedback && (
                    <p className="text-sm text-slate-400 mt-2 line-clamp-2">{review.feedback}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceManagerApprovalsPage;

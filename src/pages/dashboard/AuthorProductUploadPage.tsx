import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Upload,
  FileText,
  Tag,
  Link2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react';
import {
  testDummyProducts,
  fileSizeLimits,
  mandatoryMetaTags,
} from '../../tests/authorEndToEndTest';
// Note: Some test constants have been moved. Check your usage if needed.

interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  author: string;
  version: string;
}

interface UploadState {
  file: File | null;
  metaTags: MetaTags;
  demoUrl: string;
  uploadProgress: number;
  validationErrors: string[];
  uploadStatus: 'idle' | 'validating' | 'uploading' | 'success' | 'error';
}

export const AuthorProductUploadPage: React.FC = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<UploadState>({
    file: null,
    metaTags: { title: '', description: '', keywords: '', author: '', version: '' },
    demoUrl: '',
    uploadProgress: 0,
    validationErrors: [],
    uploadStatus: 'idle',
  });

  const [showPreview, setShowPreview] = useState(false);
  const [demoAccessible, setDemoAccessible] = useState<boolean | null>(null);
  const [allProducts, setAllProducts] = useState(testDummyProducts);

  // Validate meta tags
  const validateMetaTags = useCallback((): string[] => {
    const errors: string[] = [];

    if (!state.metaTags.title.trim()) {
      errors.push('Product title is required');
    } else if (state.metaTags.title.length < 10 || state.metaTags.title.length > 120) {
      errors.push('Title must be between 10-120 characters');
    }

    if (!state.metaTags.description.trim()) {
      errors.push('Description is required');
    } else if (
      state.metaTags.description.length < 20 ||
      state.metaTags.description.length > 300
    ) {
      errors.push('Description must be between 20-300 characters');
    }

    if (!state.metaTags.keywords.trim()) {
      errors.push('Keywords are required');
    } else {
      const keywordArray = state.metaTags.keywords.split(',').map((k) => k.trim());
      if (keywordArray.length < 5) {
        errors.push('Minimum 5 keywords required');
      } else if (keywordArray.length > 15) {
        errors.push('Maximum 15 keywords allowed');
      }
    }

    if (!state.metaTags.author.trim()) {
      errors.push('Author/Company name is required');
    }

    if (!state.metaTags.version.trim()) {
      errors.push('Version is required');
    } else if (!/^\d+\.\d+\.\d+$/.test(state.metaTags.version)) {
      errors.push('Version must follow semantic versioning (e.g., 1.0.0)');
    }

    return errors;
  }, [state.metaTags]);

  // Validate file size
  const validateFileSize = (file: File): string[] => {
    const errors: string[] = [];
    const maxBytes = fileSizeLimits.maxSoftwareZip;

    if (file.size > maxBytes) {
      const maxMB = Math.round(maxBytes / (1024 * 1024));
      const fileMB = Math.round(file.size / (1024 * 1024));
      errors.push(`File size (${fileMB}MB) exceeds limit of ${maxMB}MB`);
    }

    if (!file.name.endsWith('.zip')) {
      errors.push('Only .zip files are supported');
    }

    return errors;
  };

  // Validate demo URL
  const validateDemoUrl = useCallback(async (url: string) => {
    if (!url.trim()) return; // Optional

    if (!/^https?:\/\/.+/.test(url)) {
      setState((prev) => ({
        ...prev,
        validationErrors: [...prev.validationErrors, 'Invalid demo URL format'],
      }));
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        timeout: validationRules.demoUrl.timeout,
      });
      setDemoAccessible(true);
    } catch (error) {
      setDemoAccessible(false);
      setState((prev) => ({
        ...prev,
        validationErrors: [...prev.validationErrors, 'Demo URL is not accessible'],
      }));
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const errors = validateFileSize(file);
    setState((prev) => ({
      ...prev,
      file,
      validationErrors: errors,
      uploadStatus: errors.length > 0 ? 'error' : 'idle',
    }));
  };

  // Handle meta tag change
  const handleMetaTagChange = (key: keyof MetaTags, value: string) => {
    setState((prev) => ({
      ...prev,
      metaTags: { ...prev.metaTags, [key]: value },
    }));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate everything
    const metaTagErrors = validateMetaTags();
    if (!state.file) {
      metaTagErrors.push('Please select a file to upload');
    }

    if (metaTagErrors.length > 0) {
      setState((prev) => ({
        ...prev,
        validationErrors: metaTagErrors,
        uploadStatus: 'error',
      }));
      return;
    }

    // Simulate upload
    setState((prev) => ({
      ...prev,
      uploadStatus: 'uploading',
      uploadProgress: 0,
      validationErrors: [],
    }));

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setState((prev) => ({
        ...prev,
        uploadProgress: i,
      }));
    }

    // Add to products list
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: state.metaTags.title,
      description: state.metaTags.description,
      category: 'Custom',
      price: 0,
      authorId: 'author-current',
      authorName: state.metaTags.author,
      fileSize: `${(state.file?.size ? state.file.size / (1024 * 1024) : 0).toFixed(1)} MB`,
      maxFileSize: '500 MB',
      status: 'PENDING_REVIEW',
      approvalStatus: 'PENDING_REVIEW',
      demoUrl: state.demoUrl || 'Not provided',
      metaTags: state.metaTags,
      files: [{ name: state.file?.name || '', size: `${(state.file?.size ? state.file.size / (1024 * 1024) : 0).toFixed(1)} MB`, type: 'application/zip', uploaded: true }],
      uploads: {
        sourceCode: true,
        binaries: true,
        documentation: true,
        screenshots: true,
        apiDocs: true,
      },
      checks: {
        fileStructure: { status: 'passed', detail: 'manifest.json found · valid' },
        malwareScan: { status: 'passed', detail: 'no signatures matched' },
        dependencyAudit: { status: 'passed', detail: '0 critical · 1 medium · 3 low' },
        licenseHeaders: { status: 'passed', detail: 'MIT detected on 142 files' },
        bundleSize: { status: 'passed', detail: `${(state.file?.size ? state.file.size / (1024 * 1024) : 0).toFixed(1)} MB · under 500 MB limit` },
        metaTags: { status: 'passed', detail: 'All required meta tags present' },
        demoUrl: { status: demoAccessible ? 'passed' : 'warning', detail: demoAccessible ? 'Demo accessible · performance OK' : 'Demo URL not provided' },
      },
      timeline: {
        uploadedAt: new Date().toISOString(),
        submittedForReview: new Date().toISOString(),
        assignedTo: 'marketplace-manager-001',
        pendingSince: 'Just now',
      },
    };

    setAllProducts([newProduct, ...allProducts]);

    setState((prev) => ({
      ...prev,
      uploadStatus: 'success',
      uploadProgress: 100,
      file: null,
      metaTags: { title: '', description: '', keywords: '', author: '', version: '' },
      demoUrl: '',
    }));

    // Reset after 3 seconds
    setTimeout(() => {
      setState((prev) => ({ ...prev, uploadStatus: 'idle' }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📦 {t('author.uploadCenter', 'Upload Center')}</h1>
          <p className="text-slate-400">
            {t('author.uploadSubtitle', 'Upload your product, provide meta tags for SEO, and submit for marketplace manager approval')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Upload Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                <Upload size={20} className="text-blue-400" />
                {t('author.fileUpload', 'File Upload')}
              </h2>

              <div
                className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-500/5 transition cursor-pointer"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept=".zip"
                  hidden
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
                <Upload className="mx-auto mb-3 text-slate-400" size={40} />
                <p className="text-white font-medium">
                  {t('author.dragFiles', 'Drag your .zip file here or click to browse')}
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  {t('author.maxSize', 'Maximum: 500 MB')} • {t('author.formats', 'Supported: .zip')}
                </p>
              </div>

              {state.file && (
                <div className="mt-4 p-3 bg-slate-700/50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-blue-400" />
                    <span className="text-white text-sm">{state.file.name}</span>
                    <span className="text-slate-400 text-xs">
                      ({(state.file.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => setState((prev) => ({ ...prev, file: null }))}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Meta Tags Form */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                <Tag size={20} className="text-emerald-400" />
                {t('author.metaTags', 'Meta Tags')} <span className="text-red-400">*</span>
                <span className="text-xs text-slate-400 ml-auto">
                  {t('author.mandatory', 'MANDATORY - Cannot upload without these')}
                </span>
              </h2>

              <form className="space-y-4">
                {mandatoryMetaTags.map((tag) => (
                  <div key={tag.field}>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      {tag.label} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type={tag.field === 'description' ? 'text' : 'text'}
                      value={state.metaTags[tag.field as keyof MetaTags]}
                      onChange={(e) =>
                        handleMetaTagChange(tag.field as keyof MetaTags, e.target.value)
                      }
                      placeholder={tag.placeholder}
                      maxLength={tag.maxLength}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-slate-500">{tag.hint}</p>
                      <span className="text-xs text-slate-400">
                        {state.metaTags[tag.field as keyof MetaTags].length} / {tag.maxLength}
                      </span>
                    </div>
                  </div>
                ))}
              </form>
            </div>

            {/* Demo URL */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                <Link2 size={20} className="text-purple-400" />
                {t('author.demoUrl', 'Demo URL')} <span className="text-slate-400 text-sm ml-auto">Optional</span>
              </h2>

              <input
                type="text"
                value={state.demoUrl}
                onChange={(e) => setState((prev) => ({ ...prev, demoUrl: e.target.value }))}
                onBlur={() => validateDemoUrl(state.demoUrl)}
                placeholder="https://your-demo-domain.com"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                {t('author.demoHelper', 'Provide a live demo URL for marketplace managers to test your product')}
              </p>

              {demoAccessible !== null && (
                <div
                  className={`mt-3 p-2 rounded flex items-center gap-2 text-sm ${
                    demoAccessible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {demoAccessible ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {demoAccessible ? 'Demo is accessible' : 'Demo URL is not accessible'}
                </div>
              )}
            </div>

            {/* Validation Errors */}
            {state.validationErrors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <AlertCircle size={18} />
                  {t('author.errors', 'Issues found')}:
                </h3>
                <ul className="space-y-1">
                  {state.validationErrors.map((error, i) => (
                    <li key={i} className="text-red-300 text-sm">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Upload Progress */}
            {state.uploadStatus === 'uploading' && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 font-medium">
                    {t('author.uploading', 'Uploading...')}
                  </span>
                  <span className="text-blue-300 text-sm">{state.uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${state.uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Success Message */}
            {state.uploadStatus === 'success' && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <p className="text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  {t('author.uploadSuccess', 'Product submitted for review! Marketplace manager will review it within 24 hours.')}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!state.file || state.uploadStatus === 'uploading'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Send size={18} />
              {state.uploadStatus === 'uploading'
                ? t('author.submitting', 'Submitting...')
                : t('author.submitReview', 'Submit for Review')}
            </button>
          </div>

          {/* Sidebar - Product Preview & Status */}
          <div className="space-y-6">
            {/* Preview */}
            {state.file && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Eye size={18} className="text-cyan-400" />
                  Preview
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-400">Title</p>
                    <p className="text-white font-medium truncate">{state.metaTags.title || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Description</p>
                    <p className="text-slate-300 text-xs line-clamp-2">
                      {state.metaTags.description || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Author</p>
                    <p className="text-white">{state.metaTags.author || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Version</p>
                    <p className="text-white">{state.metaTags.version || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Approval Workflow Info */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={18} className="text-amber-400" />
                Approval Workflow
              </h3>

              <div className="space-y-3 text-sm">
                {approvalWorkflow.stages.slice(0, 3).map((stage, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="text-xs font-bold text-slate-500 min-w-[20px]">{stage.stage}</div>
                    <div>
                      <p className="font-medium text-slate-200">{stage.name}</p>
                      <p className="text-xs text-slate-400">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Size Info */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-3">📊 Size Limits</h3>
              <div className="space-y-2 text-xs text-slate-300">
                <p>🖥️ Main software: <span className="text-blue-400 font-mono">500 MB max</span></p>
                <p>🎬 Video demo: <span className="text-blue-400 font-mono">200 MB max</span></p>
                <p>📸 Screenshots: <span className="text-blue-400 font-mono">10 MB each (5 total)</span></p>
                <p>📄 Docs: <span className="text-blue-400 font-mono">100 MB max</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">📋 Your Products ({allProducts.length})</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProducts.map((product) => (
              <div key={product.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white text-sm line-clamp-2">{product.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      product.approvalStatus === 'PUBLISHED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : product.approvalStatus === 'PENDING_REVIEW'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {product.approvalStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-2">{product.description}</p>
                <div className="text-xs text-slate-500">
                  <p>📦 {product.fileSize}</p>
                  <p>👤 {product.authorName}</p>
                  {product.sales && <p>📈 {product.sales} sales · ${product.revenue}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProductUploadPage;

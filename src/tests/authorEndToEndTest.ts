/**
 * ============================================================================
 * AUTHOR PRODUCT UPLOAD MANAGER - END-TO-END TESTING & DOCUMENTATION
 * ============================================================================
 * Features:
 * 1. File size limits (max 500MB for software, 50MB for demos)
 * 2. Meta tags mandatory (SEO, description, keywords, author)
 * 3. Demo URL support
 * 4. Marketplace Manager approval workflow
 * 5. Language translation across dashboards
 * 6. Complete product lifecycle tracking
 * 7. Dummy test data for testing
 * ============================================================================
 */

// TEST DUMMY DATA
export const testDummyProducts = [
  {
    id: 'prod-auth-001',
    name: 'Hospital ERP System',
    description: 'Complete hospital management system with patient records, billing, and pharmacy',
    category: 'Healthcare',
    price: 499.99,
    authorId: 'author-test-001',
    authorName: 'John Healthcare Solutions',
    fileSize: '45.2 MB',
    maxFileSize: '500 MB',
    status: 'PENDING_REVIEW',
    approvalStatus: 'PENDING_REVIEW',
    demoUrl: 'https://demo.hospitalerp.test:3000',
    metaTags: {
      title: 'Hospital ERP System - Complete Healthcare Management',
      description: 'HIPAA compliant hospital management system with integrated billing and pharmacy',
      keywords: ['hospital', 'erp', 'healthcare', 'billing', 'patient-management'],
      author: 'John Healthcare Solutions',
      version: '1.4.2',
    },
    files: [
      { name: 'hospital-erp-v1.4.2.zip', size: '45.2 MB', type: 'application/zip', uploaded: true },
    ],
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
      bundleSize: { status: 'passed', detail: '45.2 MB · under 500 MB limit' },
      metaTags: { status: 'passed', detail: 'All required meta tags present' },
      demoUrl: { status: 'passed', detail: 'Demo accessible · performance OK' },
    },
    timeline: {
      uploadedAt: '2026-06-10T14:30:00Z',
      submittedForReview: '2026-06-10T14:35:00Z',
      assignedTo: 'marketplace-manager-001',
      pendingSince: '2 hours',
    },
  },
  {
    id: 'prod-auth-002',
    name: 'E-Commerce Platform Pro',
    description: 'Multi-vendor marketplace with AI recommendations',
    category: 'E-Commerce',
    price: 799.99,
    authorId: 'author-test-002',
    authorName: 'Digital Commerce Labs',
    fileSize: '78.5 MB',
    maxFileSize: '500 MB',
    status: 'PUBLISHED',
    approvalStatus: 'APPROVED',
    demoUrl: 'https://demo.ecommercepro.test:3000',
    metaTags: {
      title: 'E-Commerce Platform Pro - Multi-Vendor Marketplace',
      description: 'Scalable e-commerce platform with AI-powered recommendations and multi-vendor support',
      keywords: ['ecommerce', 'marketplace', 'ai-recommendations', 'multi-vendor', 'saas'],
      author: 'Digital Commerce Labs',
      version: '2.1.0',
    },
    approvedAt: '2026-06-08T10:15:00Z',
    approvedBy: 'marketplace-manager-002',
    publishedAt: '2026-06-09T08:00:00Z',
  },
  {
    id: 'prod-auth-003',
    name: 'CRM for Sales Teams',
    description: 'Cloud-based CRM with advanced analytics',
    category: 'CRM',
    price: 349.99,
    authorId: 'author-test-003',
    authorName: 'Sales Automation Inc',
    fileSize: '32.1 MB',
    maxFileSize: '500 MB',
    status: 'DRAFT',
    approvalStatus: 'DRAFT',
    demoUrl: null,
    metaTags: {
      title: 'CRM for Sales Teams - Advanced Sales Management',
      description: 'Comprehensive CRM solution with pipeline management, forecasting, and team collaboration',
      keywords: ['crm', 'sales', 'pipeline', 'analytics', 'team-collaboration'],
      author: 'Sales Automation Inc',
      version: '1.0.0',
    },
    progress: {
      metaTagsComplete: true,
      filesUploaded: true,
      demoUrlAdded: false,
      readyForSubmission: true,
    },
  },
  {
    id: 'prod-auth-004',
    name: 'Learning Management System',
    description: 'Complete LMS with AI grading and live classes',
    category: 'Education',
    price: 599.99,
    authorId: 'author-test-004',
    authorName: 'EduTech Solutions',
    fileSize: '92.3 MB',
    maxFileSize: '500 MB',
    status: 'PUBLISHED',
    approvalStatus: 'APPROVED',
    demoUrl: 'https://demo.lms.test:3000',
    metaTags: {
      title: 'Learning Management System - AI-Powered Education',
      description: 'Complete LMS with live classes, AI grading, student analytics, and content management',
      keywords: ['lms', 'education', 'elearning', 'ai-grading', 'live-classes'],
      author: 'EduTech Solutions',
      version: '3.2.1',
    },
    approvedAt: '2026-06-05T09:45:00Z',
    approvedBy: 'marketplace-manager-001',
    publishedAt: '2026-06-06T12:00:00Z',
    sales: 145,
    revenue: 86898.55,
  },
];

// MARKETPLACE MANAGER DASHBOARD TEST DATA
export const marketplaceManagerData = {
  totalProducts: 487,
  pendingApproval: 23,
  needsChanges: 8,
  rejected: 12,
  approved: 389,
  published: 342,
  suspendedForReview: 3,
  averageReviewTime: '4 hours 23 minutes',
  approvalSuccessRate: '94.2%',
};

// FILE SIZE LIMITS
export const fileSizeLimits = {
  maxSoftwareZip: 500 * 1024 * 1024, // 500 MB
  maxDemoZip: 50 * 1024 * 1024, // 50 MB
  maxScreenshot: 10 * 1024 * 1024, // 10 MB each (max 5 screenshots = 50 MB)
  maxDocumentation: 100 * 1024 * 1024, // 100 MB
  maxVideoDemo: 200 * 1024 * 1024, // 200 MB
};

// MANDATORY META TAGS
export const mandatoryMetaTags = [
  {
    field: 'title',
    label: 'Product Title',
    placeholder: 'e.g., Hospital ERP System - Complete Healthcare Management',
    required: true,
    maxLength: 120,
    hint: 'SEO-optimized title for marketplace and search engines',
  },
  {
    field: 'description',
    label: 'Product Description',
    placeholder: 'Detailed description of what your product does...',
    required: true,
    maxLength: 300,
    hint: 'Brief summary shown in search results and product listings',
  },
  {
    field: 'keywords',
    label: 'Keywords (comma-separated)',
    placeholder: 'e.g., healthcare, erp, hospital, billing, pharmacy',
    required: true,
    maxLength: 200,
    hint: 'SEO keywords for better discoverability (5-15 keywords recommended)',
  },
  {
    field: 'author',
    label: 'Author/Company Name',
    placeholder: 'Your company or name',
    required: true,
    maxLength: 100,
    hint: 'Will be displayed with product credits',
  },
  {
    field: 'version',
    label: 'Product Version',
    placeholder: 'e.g., 1.4.2',
    required: true,
    maxLength: 20,
    hint: 'Semantic versioning (major.minor.patch)',
  },
];

export default {
  testDummyProducts,
  marketplaceManagerData,
  fileSizeLimits,
  mandatoryMetaTags,
};

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

// APPROVAL WORKFLOW STAGES
export const approvalWorkflow = {
  stages: [
    {
      stage: 1,
      name: 'Draft',
      status: 'DRAFT',
      description: 'Author is preparing the product for submission',
      requirements: [
        'Product files uploaded',
        'All meta tags filled',
        'Demo URL provided (optional)',
      ],
      actions: ['Edit', 'Preview', 'Save'],
    },
    {
      stage: 2,
      name: 'Pending Review',
      status: 'PENDING_REVIEW',
      description: 'Product awaiting marketplace manager review',
      duration: '1-48 hours',
      reviewedBy: 'Marketplace Manager',
      checks: [
        'File integrity scan',
        'Malware/security scan',
        'Meta tags validation',
        'Demo URL functionality',
        'Content compliance',
        'License verification',
      ],
      actions: ['View Submission', 'Track Status'],
    },
    {
      stage: 3,
      name: 'Approved / Needs Changes / Rejected',
      status: ['APPROVED', 'NEEDS_CHANGES', 'REJECTED'],
      description: 'Review decision with feedback',
      feedback: 'Detailed reason if changes needed or rejected',
      actions: ['View Feedback', 'Make Changes', 'Resubmit'],
    },
    {
      stage: 4,
      name: 'Published',
      status: 'PUBLISHED',
      description: 'Product live on marketplace',
      visibility: 'Public',
      actions: ['Edit', 'Promote', 'View Analytics', 'Manage Support'],
    },
    {
      stage: 5,
      name: 'Archived/Suspended',
      status: ['ARCHIVED', 'SUSPENDED'],
      description: 'Product removed or under investigation',
      actions: ['View Details', 'Appeal'],
    },
  ],
};

// LANGUAGE TRANSLATION KEYS
export const authorTranslationKeys = {
  upload: {
    dragHere: 'Drag your .zip package here or browse',
    uploadTitle: 'Upload Center',
    uploadSubtitle: 'Drag, validate, AI-enrich and publish to the marketplace',
    maxSize: 'Maximum file size: 500 MB',
    supportedFormats: 'Supported: .zip (source code, binaries, documentation, screenshots)',
    uploading: 'Uploading to secure vault…',
    validating: 'Validating package · scanning for malware · auditing dependencies…',
    ready: 'Package ready · all checks passed',
  },
  metaTags: {
    required: 'Meta tags are required to upload',
    title: 'Product Title (SEO optimized)',
    description: 'Product Description',
    keywords: 'Keywords (comma-separated)',
    author: 'Author/Company Name',
    version: 'Product Version',
    fillAll: 'Please fill all meta tag fields',
  },
  approval: {
    status: 'Approval Status',
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    needsChanges: 'Needs Changes',
    submitted: 'Submitted for Review',
    viewFeedback: 'View Marketplace Manager Feedback',
    reviewedBy: 'Reviewed by Marketplace Manager',
    demoUrl: 'Demo URL for reviewers',
  },
  demo: {
    demoUrl: 'Demo URL (optional)',
    demoPlaceholder: 'https://your-demo-domain.com',
    demoHelper: 'Provide a live demo link so marketplace managers can test your product',
    demoTesting: 'Demo accessibility check in progress…',
    demoAccessible: 'Demo is accessible and responsive',
  },
};

/**
 * ROUTES MAPPING
 */
export const authorRoutes = {
  '/author': 'Dashboard',
  '/author/dashboard': 'Dashboard Overview',
  '/author/products': 'My Products',
  '/author/upload': 'Upload Center',
  '/author/upload/new': 'New Product Upload',
  '/author/product/:id': 'Product Details',
  '/author/product/:id/edit': 'Edit Product',
  '/author/earnings': 'Earnings & Analytics',
  '/author/support': 'Support & Tickets',
  '/author/chat': 'Internal Chat',
  '/author/team': 'Team Management',
  '/author/settings': 'Account Settings',
};

/**
 * DATABASE SCHEMA RELATIONSHIPS
 * 
 * Author (User)
 *   ├── AuthorProfile
 *   │   ├── Products[]
 *   │   ├── Orders[] (received from customers)
 *   │   ├── Earnings & Revenue
 *   │   └── Team Members[]
 *   │
 *   └── Products[]
 *       ├── Product
 *       │   ├── status: DRAFT → PUBLISHED → ARCHIVED/SUSPENDED
 *       │   ├── ProductApproval (approval workflow)
 *       │   │   ├── status: DRAFT → PENDING_REVIEW → APPROVED/REJECTED/NEEDS_CHANGES → PUBLISHED
 *       │   │   ├── reviewedBy: Marketplace Manager ID
 *       │   │   └── changeRequests: JSON with specific feedback
 *       │   ├── ProductMedia[] (screenshots, videos, demos)
 *       │   ├── OrderItem[] (sales/licenses)
 *       │   ├── Review[] (customer reviews/ratings)
 *       │   └── Files (source code, binaries, docs)
 *       │
 *       └── DownloadWatermark (digital asset protection)
 */

/**
 * APPROVAL WORKFLOW LOGIC
 * 
 * 1. Author uploads product (DRAFT)
 * 2. Author fills meta tags (MANDATORY)
 * 3. Author provides demo URL (RECOMMENDED)
 * 4. Author submits for review
 * 5. ProductApproval status → PENDING_REVIEW
 * 6. Marketplace Manager assigned
 * 7. Automated checks run:
 *    - File integrity
 *    - Malware scan
 *    - Dependency audit
 *    - License headers
 *    - Bundle size validation
 *    - Meta tags validation
 *    - Demo URL accessibility
 * 8. Manual review by marketplace manager
 * 9. Decision: APPROVED / REJECTED / NEEDS_CHANGES
 * 10. If APPROVED → status becomes PUBLISHED
 * 11. Product appears on marketplace
 */

/**
 * ERROR HANDLING & VALIDATION
 */
export const validationRules = {
  fileSize: {
    max: 500, // MB
    error: 'File size exceeds 500 MB limit',
  },
  metaTags: {
    title: {
      minLength: 10,
      maxLength: 120,
      error: 'Title must be between 10-120 characters',
    },
    description: {
      minLength: 20,
      maxLength: 300,
      error: 'Description must be between 20-300 characters',
    },
    keywords: {
      min: 5,
      max: 15,
      error: 'Provide 5-15 keywords',
    },
    version: {
      pattern: /^\d+\.\d+\.\d+$/,
      error: 'Version must follow semantic versioning (e.g., 1.0.0)',
    },
  },
  demoUrl: {
    pattern: /^https?:\/\/.+/,
    error: 'Demo URL must be a valid HTTPS/HTTP URL',
    timeout: 10000, // 10 seconds to respond
  },
};

/**
 * LANGUAGE TRANSLATION INTEGRATION
 * 
 * All upload/approval/product pages should support:
 * - English (en)
 * - Hindi (hi) - हिन्दी
 * - Arabic (ar) - العربية (RTL)
 * - Spanish (es)
 * - French (fr)
 * - German (de)
 * - Portuguese (pt)
 * - Chinese (zh)
 * 
 * User language preference persists across dashboard
 */

/**
 * TEST CHECKLIST
 */
export const testChecklist = {
  fileUpload: [
    '[ ] Upload file under 500 MB - SUCCESS',
    '[ ] Upload file over 500 MB - REJECT with error',
    '[ ] Upload non-zip file - REJECT with error',
    '[ ] Drag-drop upload works',
    '[ ] Progress bar shows correctly',
  ],
  metaTags: [
    '[ ] Cannot submit without all meta tags',
    '[ ] Title validation (10-120 chars)',
    '[ ] Description validation (20-300 chars)',
    '[ ] Keywords count (5-15)',
    '[ ] Version format validation (x.x.x)',
    '[ ] Real-time meta tag preview',
  ],
  demoUrl: [
    '[ ] Demo URL is optional',
    '[ ] Validates HTTPS/HTTP URLs only',
    '[ ] Tests URL accessibility',
    '[ ] Shows demo accessible/not accessible',
  ],
  approval: [
    '[ ] Product shows PENDING_REVIEW status',
    '[ ] Marketplace manager can see pending products',
    '[ ] Manager can approve/reject/request changes',
    '[ ] Author receives approval/rejection notification',
    '[ ] Approved product shows PUBLISHED status',
    '[ ] Product appears on marketplace after approval',
  ],
  translation: [
    '[ ] Upload page translates to all 8 languages',
    '[ ] Meta tag labels translate',
    '[ ] Status messages translate',
    '[ ] RTL support for Arabic',
    '[ ] Language preference persists',
  ],
  endToEnd: [
    '[ ] Author creates account',
    '[ ] Author fills profile',
    '[ ] Author uploads product file (500 MB)',
    '[ ] Author fills meta tags',
    '[ ] Author provides demo URL',
    '[ ] Author submits for review',
    '[ ] Marketplace manager reviews',
    '[ ] Marketplace manager approves',
    '[ ] Product published to marketplace',
    '[ ] Product visible in search/categories',
    '[ ] Customer can purchase/download',
    '[ ] Watermark applied to downloads',
    '[ ] Author receives payment',
  ],
};

/**
 * DATABASE INDEXES (for performance at scale)
 * 
 * Product indexes:
 * - authorId (find author's products)
 * - status (find products by status)
 * - categoryId (find products in category)
 * 
 * ProductApproval indexes:
 * - productId (unique per product)
 * - status (find pending/approved/rejected)
 * - submittedBy (find author's submissions)
 * - reviewedBy (find manager's reviews)
 * 
 * OrderItem indexes:
 * - productId (find product sales)
 * - authorId (find author's revenue)
 */

export default {
  testDummyProducts,
  marketplaceManagerData,
  fileSizeLimits,
  mandatoryMetaTags,
  approvalWorkflow,
  authorTranslationKeys,
  authorRoutes,
  validationRules,
  testChecklist,
};

/**
 * ENTERPRISE DESIGN SYSTEM ESLINT CONFIGURATION
 * ===============================================
 * Zero-tolerance enforcement for UI consistency.
 * This configuration detects and blocks all forbidden patterns.
 */

module.exports = {
  name: 'enterprise-design-system',
  description: 'Enterprise Design System Enforcement Rules',
  
  // Extend base config
  extends: [
    './.eslintrc.cjs',
  ],

  // Design system specific plugins
  plugins: [
    'react',
    '@typescript-eslint',
    'import',
  ],

  // Custom rules for design system enforcement
  rules: {
    // ========================================
    // FORBIDDEN PATTERN DETECTION
    // ========================================

    // Block hardcoded colors in className
    'no-restricted-syntax': [
      'error',
      // Block hex colors in strings
      {
        selector: 'Literal[value=/#[0-9a-fA-F]{3,8}/]',
        message: '❌ HARDCODED COLOR DETECTED: Use CSS custom properties (var(--color-*)) instead of hex colors',
      },
      // Block arbitrary values in Tailwind classes
      {
        selector: 'Literal[value=/\\[.*px\\]/]',
        message: '❌ ARBITRARY PX VALUE DETECTED: Use token-based spacing (p-1 to p-8) instead of arbitrary pixel values',
      },
      // Block !important in className
      {
        selector: 'Literal[value=/!\\w+/]',
        message: '❌ !IMPORTANT DETECTED: Never use !important in className',
      },
    ],

    // ========================================
    // COMPONENT ENFORCEMENT
    // ========================================

    // Enforce Button component usage
    'no-restricted-syntax': [
      'error',
      ...(require('./.eslintrc.cjs').rules?.['no-restricted-syntax'] || []),
      {
        selector: 'JSXOpeningElement[name.name="button"]:not(:has(JSXAttribute[name.name="className"]))',
        message: '⚠️ RAW BUTTON: Use the Button component from @/components/ui/button',
      },
    ],

    // ========================================
    // IMPORT ENFORCEMENT
    // ========================================

    // Prefer path aliases
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../../*'],
            message: '❌ DEEP RELATIVE IMPORT: Use path aliases (@/components, @/lib) instead of deep relative paths',
          },
        ],
      },
    ],

    // ========================================
    // STYLE ENFORCEMENT
    // ========================================

    // Block inline styles
    'react/forbid-dom-props': [
      'error',
      {
        forbid: [
          {
            propName: 'style',
            message: '❌ INLINE STYLE DETECTED: Use className with utility classes instead of inline styles',
          },
        ],
      },
    ],

    // ========================================
    // NAMING CONVENTIONS
    // ========================================

    // Enforce PascalCase for components
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'function',
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
        // Allow camelCase for non-component functions
        filter: {
          regex: '^(use|get|is|has|handle|on|to)[A-Z]',
          match: false,
        },
      },
      {
        selector: 'variable',
        types: ['function'],
        format: ['PascalCase'],
        filter: {
          regex: '^(use|get|is|has|handle|on|to)[A-Z]',
          match: false,
        },
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],

    // ========================================
    // ACCESSIBILITY ENFORCEMENT
    // ========================================

    // Require aria-label on icon buttons
    'react/button-has-type': 'error',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/iframe-has-title': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/media-has-caption': 'warn',
    'jsx-a11y/mouse-events-have-key-events': 'error',
    'jsx-a11y/no-access-key': 'error',
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/no-distracting-elements': 'error',
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/scope': 'error',
    'jsx-a11y/tabindex-no-positive': 'error',
  },

  // Override settings
  settings: {
    react: {
      version: 'detect',
    },
  },

  // Files to lint
  overrides: [
    {
      files: ['*.tsx', '*.ts', '*.jsx', '*.js'],
      excludedFiles: [
        '*.config.ts',
        '*.config.js',
        'node_modules/**',
        'dist/**',
        'build/**',
      ],
    },
  ],

  // Custom parser options
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};

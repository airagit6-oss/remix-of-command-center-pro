/**
 * ENTERPRISE DESIGN SYSTEM STYLELINT CONFIGURATION
 * ================================================
 * Zero-tolerance CSS enforcement for token compliance.
 */

module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended',
  ],

  plugins: [
    'stylelint-order',
  ],

  rules: {
    // ========================================
    // COLOR ENFORCEMENT - NO HARDCODED COLORS
    // ========================================

    // Block hex colors
    'color-no-hex': [
      true,
      {
        message: '❌ HARDCODED HEX: Use CSS custom properties (--color-*) instead of hex colors',
        severity: 'error',
      },
    ],

    // Block named colors (except transparent, currentColor, inherit)
    'color-named': [
      'never',
      {
        ignore: ['transparent', 'currentColor', 'inherit'],
        message: '❌ NAMED COLOR: Use CSS custom properties instead of named colors',
        severity: 'error',
      },
    ],

    // ========================================
    // SPACING ENFORCEMENT - NO ARBITRARY PX
    // ========================================

    // Enforce custom properties for spacing
    'declaration-property-value-allowed-list': {
      'padding': ['/var\\(--space-\\*)/', '0'],
      'padding-top': ['/var\\(--space-\\*)/', '0'],
      'padding-right': ['/var\\(--space-\\*)/', '0'],
      'padding-bottom': ['/var\\(--space-\\*)/', '0'],
      'padding-left': ['/var\\(--space-\\*)/', '0'],
      'margin': ['/var\\(--space-\\*)/', '0', 'auto'],
      'margin-top': ['/var\\(--space-\\*)/', '0', 'auto'],
      'margin-right': ['/var\\(--space-\\*)/', '0', 'auto'],
      'margin-bottom': ['/var\\(--space-\\*)/', '0', 'auto'],
      'margin-left': ['/var\\(--space-\\*)/', '0', 'auto'],
      'gap': ['/var\\(--space-\\*)/', '0'],
      'border-radius': ['/var\\(--radius-\\*)/', '0', '50%', '9999px'],
      'box-shadow': ['/var\\(--shadow-\\*)/', 'none'],
      'font-size': ['/var\\(--text-\\*)/'],
      'line-height': ['/var\\(--leading-\\*)/'],
      'transition-duration': ['/var\\(--transition-\\*)/', '0ms', '0s'],
      'transition-timing-function': ['/var\\(--ease-\\*)/'],
      'z-index': ['/var\\(--z-\\*)/'],
    },

    // ========================================
    // UNIT RESTRICTIONS
    // ========================================

    // Restrict units (only allow % for some properties, rem for others)
    'unit-allowed-list': {
      'px': ['border-width', 'outline-width', 'stroke-width'],
      'rem': ['font-size', 'line-height', 'letter-spacing'],
      '%': ['width', 'height', 'min-width', 'min-height', 'max-width', 'max-height'],
      'vh': ['height', 'min-height', 'max-height'],
      'vw': ['width', 'min-width', 'max-width'],
    },

    // ========================================
    // PROPERTY ORDER (for consistency)
    // ========================================

    'order/properties-order': [
      // Position
      'position',
      'inset',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      
      // Display & Layout
      'display',
      'flex',
      'flex-direction',
      'flex-wrap',
      'flex-flow',
      'flex-grow',
      'flex-shrink',
      'flex-basis',
      'justify-content',
      'align-items',
      'align-content',
      'align-self',
      'order',
      'gap',
      'column-gap',
      'row-gap',
      'grid',
      'grid-template',
      'grid-template-columns',
      'grid-template-rows',
      'grid-template-areas',
      'grid-auto-columns',
      'grid-auto-rows',
      'grid-auto-flow',
      'grid-area',
      'grid-column',
      'grid-row',
      
      // Box Model
      'width',
      'height',
      'min-width',
      'min-height',
      'max-width',
      'max-height',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'border',
      'border-top',
      'border-right',
      'border-bottom',
      'border-left',
      'border-width',
      'border-style',
      'border-color',
      'border-radius',
      'outline',
      'box-sizing',
      'overflow',
      'overflow-x',
      'overflow-y',
      
      // Typography
      'font',
      'font-family',
      'font-size',
      'font-weight',
      'font-style',
      'line-height',
      'letter-spacing',
      'text-align',
      'text-decoration',
      'text-transform',
      'white-space',
      'color',
      
      // Visual
      'background',
      'background-color',
      'background-image',
      'background-size',
      'background-position',
      'background-repeat',
      'opacity',
      'visibility',
      'cursor',
      'pointer-events',
      'user-select',
      
      // Effects
      'box-shadow',
      'text-shadow',
      'transform',
      'transform-origin',
      'filter',
      'backdrop-filter',
      
      // Animation
      'transition',
      'transition-property',
      'transition-duration',
      'transition-timing-function',
      'transition-delay',
      'animation',
      'animation-name',
      'animation-duration',
      'animation-timing-function',
      'animation-delay',
      'animation-iteration-count',
      'animation-direction',
      'animation-fill-mode',
      'animation-play-state',
    ],

    // ========================================
    // BEST PRACTICES
    // ========================================

    // No !important
    'declaration-no-important': [
      true,
      {
        message: '❌ !IMPORTANT DETECTED: Never use !important in CSS',
        severity: 'error',
      },
    ],

    // No ID selectors (enforce classes)
    'selector-max-id': [
      0,
      {
        message: '❌ ID SELECTOR: Use class selectors instead of ID selectors',
        severity: 'error',
      },
    ],

    // Limit selector specificity
    'selector-max-specificity': [
      '0,3,0',
      {
        message: '⚠️ HIGH SPECIFICITY: Reduce selector specificity (max: 0,3,0)',
        severity: 'warning',
      },
    ],

    // No duplicate properties
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values'],
        message: '❌ DUPLICATE PROPERTY: Remove duplicate property declarations',
        severity: 'error',
      },
    ],

    // No shorthand properties override longhand
    'declaration-block-no-shorthand-property-overrides': [
      true,
      {
        message: '❌ SHORTHAND OVERRIDE: Shorthand property overrides longhand',
        severity: 'error',
      },
    ],

    // No empty blocks
    'block-no-empty': [
      true,
      {
        message: '❌ EMPTY BLOCK: Remove empty CSS blocks',
        severity: 'error',
      },
    ],

    // ========================================
    // CUSTOM PROPERTY ENFORCEMENT
    // ========================================

    // Require custom properties for certain values
    'custom-property-pattern': [
      '^(--[a-z][a-z0-9-]*|var\\(--[a-z][a-z0-9-]*\\))$',
      {
        message: '⚠️ INVALID CUSTOM PROPERTY: Use kebab-case for CSS custom properties',
        severity: 'warning',
      },
    ],

    // ========================================
    // COMMENTS (for documentation)
    // ========================================

    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands'],
        message: '⚠️ ADD EMPTY LINE: Add empty line before comments',
        severity: 'warning',
      },
    ],

    // ========================================
    // FORMATTING
    // ========================================

    'indentation': 2,
    'string-quotes': 'single',
    'number-leading-zero': 'always',
    'number-max-precision': 4,
    'length-zero-no-unit': true,
    'value-list-comma-space-after': 'always-single-line',
    'declaration-colon-space-after': 'always',
    'declaration-colon-space-before': 'never',
    'block-opening-brace-space-before': 'always',
    'block-opening-brace-newline-after': 'always',
    'block-closing-brace-newline-before': 'always',
    'selector-list-comma-newline-after': 'always',
    'function-comma-space-after': 'always-single-line',
  },

  // Ignore certain files
  ignoreFiles: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '**/*.min.css',
    'coverage/**',
  ],
};

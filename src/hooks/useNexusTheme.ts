/**
 * NEXUS Theme Hook
 * Single source of truth for all color applications
 * Use in any component: const colors = useNexusTheme();
 */

import { useMemo } from 'react';
import NEXUS_COLORS, {
  getModuleColor,
  getStatusColor,
  getChartColor,
  applyGlow,
} from '@/styles/nexusColorSystem';

export interface INexusTheme {
  // Brand Colors
  brand: {
    blue: string;
    cyan: string;
    emerald: string;
  };

  // Foundation
  bg: {
    main: string;
    page: string;
    sidebar: string;
    card: string;
    modal: string;
  };

  // Text
  text: {
    primary: string;
    secondary: string;
    muted: string;
    disabled: string;
  };

  // Status
  status: {
    success: string;
    warning: string;
    danger: string;
    critical: string;
    info: string;
  };

  // AI
  ai: {
    primary: string;
    secondary: string;
    glow: string;
    premium: string;
  };

  // Sidebar
  sidebar: {
    bg: string;
    active: string;
    hover: string;
    icons: string;
    activeIcons: string;
  };

  // Glows
  glow: {
    blue: string;
    cyan: string;
    green: string;
    purple: string;
    red: string;
  };

  // Shadows
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    glow: string;
  };

  // Utilities
  getModuleColor: (moduleName: string) => string;
  getStatusColor: (status: 'success' | 'warning' | 'danger' | 'critical' | 'info') => string;
  getChartColor: (seriesIndex: 1 | 2 | 3 | 4 | 5 | 6) => string;
  applyGlow: (color: 'blue' | 'cyan' | 'green' | 'purple' | 'red') => string;
}

/**
 * useNexusTheme - Hook to access the complete NEXUS color system
 * Usage in components:
 *   const colors = useNexusTheme();
 *   return <div style={{ backgroundColor: colors.bg.card }}>...</div>
 */
export const useNexusTheme = (): INexusTheme => {
  return useMemo(
    () => ({
      brand: {
        blue: NEXUS_COLORS.BRAND.blue,
        cyan: NEXUS_COLORS.BRAND.cyan,
        emerald: NEXUS_COLORS.BRAND.emerald,
      },
      bg: {
        main: NEXUS_COLORS.FOUNDATION.mainBackground,
        page: NEXUS_COLORS.FOUNDATION.pageBackground,
        sidebar: NEXUS_COLORS.FOUNDATION.sidebarBackground,
        card: NEXUS_COLORS.FOUNDATION.cardBackground,
        modal: NEXUS_COLORS.FOUNDATION.modalBackground,
      },
      text: {
        primary: NEXUS_COLORS.TEXT.primary,
        secondary: NEXUS_COLORS.TEXT.secondary,
        muted: NEXUS_COLORS.TEXT.muted,
        disabled: NEXUS_COLORS.TEXT.disabled,
      },
      status: {
        success: NEXUS_COLORS.STATUS.success,
        warning: NEXUS_COLORS.STATUS.warning,
        danger: NEXUS_COLORS.STATUS.danger,
        critical: NEXUS_COLORS.STATUS.critical,
        info: NEXUS_COLORS.STATUS.info,
      },
      ai: {
        primary: NEXUS_COLORS.AI.primary,
        secondary: NEXUS_COLORS.AI.secondary,
        glow: NEXUS_COLORS.AI.glow,
        premium: NEXUS_COLORS.AI.premium,
      },
      sidebar: {
        bg: NEXUS_COLORS.SIDEBAR.background,
        active: NEXUS_COLORS.SIDEBAR.activeItem,
        hover: NEXUS_COLORS.SIDEBAR.hover,
        icons: NEXUS_COLORS.SIDEBAR.icons,
        activeIcons: NEXUS_COLORS.SIDEBAR.activeIcons,
      },
      glow: {
        blue: NEXUS_COLORS.GLOW.blueGlow,
        cyan: NEXUS_COLORS.GLOW.cyanGlow,
        green: NEXUS_COLORS.GLOW.greenGlow,
        purple: NEXUS_COLORS.GLOW.purpleGlow,
        red: NEXUS_COLORS.GLOW.redGlow,
      },
      shadows: {
        sm: NEXUS_COLORS.SHADOWS.sm,
        md: NEXUS_COLORS.SHADOWS.md,
        lg: NEXUS_COLORS.SHADOWS.lg,
        xl: NEXUS_COLORS.SHADOWS.xl,
        glow: NEXUS_COLORS.SHADOWS.glow,
      },
      getModuleColor,
      getStatusColor,
      getChartColor,
      applyGlow,
    }),
    [],
  );
};

export default useNexusTheme;

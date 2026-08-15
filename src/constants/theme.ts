import { StyleSheet } from 'react-native';

export const COLORS = {
  // Dark background palette
  bg0: '#07070E',
  bg1: '#0D0D1C',
  bg2: '#12122B',
  bg3: '#1A1A35',

  // Violet accent
  violet: '#7C3AED',
  violetLight: '#A855F7',
  violetGlow: 'rgba(124, 58, 237, 0.3)',

  // Cyan accent
  cyan: '#06B6D4',
  cyanLight: '#22D3EE',
  cyanGlow: 'rgba(6, 182, 212, 0.25)',

  // Text
  textPrimary: '#F1F1FA',
  textSecondary: '#8B8BA8',
  textMuted: '#4B4B6B',

  // Glass UI
  glassBg: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.1)',
  glassHighlight: 'rgba(255,255,255,0.08)',

  // Status
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',

  // Gradient arrays (for LinearGradient)
  gradientViolet: ['#7C3AED', '#A855F7'],
  gradientCyan: ['#06B6D4', '#7C3AED'],
  gradientDark: ['#0D0D1C', '#1A1A35'],
  gradientCard: ['rgba(124,58,237,0.15)', 'rgba(6,182,212,0.08)'],
};

export const FONTS = {
  regular: undefined, // system font
  bold: undefined,
  weight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.bg0,
  },
  title: {
    fontSize: 28,
    fontWeight: FONTS.weight.extrabold,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: FONTS.weight.medium,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
});

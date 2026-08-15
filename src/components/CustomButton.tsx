import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function CustomButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  fullWidth = false,
}: CustomButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <Animated.View
        style={[
          { transform: [{ scale }] },
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          style={{ borderRadius: RADIUS.full }}
        >
          <LinearGradient
            colors={
              isDisabled
                ? (['#3A3A5C', '#2A2A4C'] as [string, string])
                : (COLORS.gradientCyan as [string, string])
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.button, isDisabled && styles.disabled]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.primaryText}>{title}</Text>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }

  if (variant === 'secondary') {
    return (
      <Animated.View
        style={[
          { transform: [{ scale }] },
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          style={[styles.secondaryButton, isDisabled && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.violetLight} size="small" />
          ) : (
            <Text style={styles.secondaryText}>{title}</Text>
          )}
        </Pressable>
      </Animated.View>
    );
  }

  // Ghost
  return (
    <Animated.View
      style={[
        { transform: [{ scale }] },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={styles.ghostButton}
      >
        <Text style={styles.ghostText}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

// Simple glowing pulse loader for full-screen use
export function LoadingSpinner({ label }: { label?: string }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.spinnerContainer, { opacity }]}>
      <ActivityIndicator size="large" color={COLORS.violetLight} />
      {label && <Text style={styles.spinnerLabel}>{label}</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullWidth: { width: '100%' },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  disabled: { opacity: 0.5 },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.violetLight,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  secondaryText: {
    color: COLORS.violetLight,
    fontSize: 15,
    fontWeight: '600',
  },
  ghostButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    padding: SPACING.xl,
  },
  spinnerLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: SPACING.sm,
  },
});

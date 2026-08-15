import React from 'react';
import { StyleSheet, View, ViewStyle, useWindowDimensions, Platform } from 'react-native';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  maxWidth?: number;
}

export function ResponsiveWrapper({ children, style, maxWidth = 1200 }: ResponsiveWrapperProps) {
  const { width } = useWindowDimensions();
  
  // Only apply constraint on web, or on very wide tablets
  const shouldConstrain = Platform.OS === 'web' || width > 800;

  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.inner, 
        shouldConstrain && { maxWidth, width: '100%', alignSelf: 'center' }
      ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  }
});

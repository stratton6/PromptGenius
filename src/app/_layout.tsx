import { ApiKeyProvider, useApiKey } from '@/hooks/useApiKey';
import { ThemeProvider, DarkTheme } from 'expo-router';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoadingSpinner } from '../components/CustomButton';
import { COLORS } from '../constants/theme';

SplashScreen.preventAutoHideAsync();

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { apiKey, isLoading } = useApiKey();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
      if (!apiKey) {
        router.replace('/onboarding');
      }
    }
  }, [apiKey, isLoading]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.bg0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LoadingSpinner label="Loading PromptGenius..." />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ApiKeyProvider>
      <SafeAreaProvider>
        <NavigationGuard>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </NavigationGuard>
      </SafeAreaProvider>
    </ApiKeyProvider>
  );
}

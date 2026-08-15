import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../components/CustomButton';
import { GlassCard } from '../components/GlassCard';
import { ResponsiveWrapper } from '../components/ResponsiveWrapper';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useApiKey } from '../hooks/useApiKey';
import { validateApiKey } from '../services/gemini';

SplashScreen.preventAutoHideAsync();

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const isWebLarge = Platform.OS === 'web' && width > 900;
  
  const { setKey } = useApiKey();
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    SplashScreen.hideAsync();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 6,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, glowAnim]);

  const handleSave = async () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setError('Please enter your API key.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const valid = await validateApiKey(trimmed);
      if (!valid) {
        setError('Could not verify this key with Gemini. Please check and try again.');
        return;
      }
      await setKey(trimmed);
      router.replace('/(tabs)');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <Animated.View
      style={[
        styles.formContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        isWebLarge && styles.formContainerWeb
      ]}
    >
      {/* Logo / Badge */}
      <View style={styles.logoBadge}>
        <LinearGradient
          colors={['#7C3AED', '#06B6D4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoGradient}
        >
          <Text style={styles.logoEmoji}>✦</Text>
        </LinearGradient>
      </View>

      {/* Heading */}
      <Text style={[styles.heading, isWebLarge && { textAlign: 'left' }]}>
        Welcome to{'\n'}PromptGenius
      </Text>
      <Text style={[styles.subheading, isWebLarge && { textAlign: 'left', maxWidth: '100%' }]}>
        Your AI-powered prompt engineering & brand strategy assistant.
        To get started, connect your free Gemini API key.
      </Text>

      {/* Input Card */}
      <GlassCard style={styles.card}>
        <Text style={styles.cardLabel}>GEMINI API KEY</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Paste your API Key here..."
          placeholderTextColor={COLORS.textMuted}
          value={keyInput}
          onChangeText={(t) => {
            setKeyInput(t);
            setError('');
          }}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={false}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <CustomButton
          title="Verify & Save Key"
          onPress={handleSave}
          loading={loading}
          fullWidth
          style={{ marginTop: SPACING.md }}
        />
      </GlassCard>

      {/* Get Key Link */}
      <TouchableOpacity
        onPress={() =>
          Linking.openURL('https://aistudio.google.com/app/apikey')
        }
        style={styles.linkRow}
      >
        <Text style={styles.linkText}>
          🔑 Don't have a key? Get a free one from Google AI Studio →
        </Text>
      </TouchableOpacity>

      {/* Privacy note */}
      <GlassCard style={styles.privacyCard}>
        <Text style={styles.privacyText}>
          🔒 Your API key is stored only on this device using encrypted
          local storage. It is never sent to any third-party server.
        </Text>
      </GlassCard>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#07070E', '#0D0B2B', '#07070E']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Glow orbs */}
      <Animated.View style={[styles.glowOrb1, { opacity: glowAnim }]} />
      <Animated.View style={[styles.glowOrb2, { opacity: glowAnim }]} />

      <ResponsiveWrapper maxWidth={1200}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              isWebLarge && styles.scrollContentWeb
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {isWebLarge ? (
              <View style={styles.webSplitLayout}>
                {/* Left Side: Illustration */}
                <View style={styles.webImageContainer}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop' }} 
                    style={styles.webImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', COLORS.bg0]}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
                
                {/* Right Side: Form */}
                <View style={styles.webFormSide}>
                  {formContent}
                </View>
              </View>
            ) : (
              formContent
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </ResponsiveWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg0 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  scrollContentWeb: {
    padding: 0,
  },
  webSplitLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  webImageContainer: {
    flex: 1.2,
    position: 'relative',
    borderRightWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  webImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
  webFormSide: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xxl * 1.5,
  },
  formContainer: { alignItems: 'center', gap: SPACING.lg },
  formContainerWeb: { alignItems: 'flex-start' },
  glowOrb1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.violetGlow,
    top: -80,
    left: -80,
  },
  glowOrb2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.cyanGlow,
    bottom: 50,
    right: -60,
  },
  logoBadge: {
    marginBottom: SPACING.sm,
    shadowColor: COLORS.violet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 36, color: '#fff' },
  heading: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  subheading: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  card: { width: '100%' },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: RADIUS.md,
    color: COLORS.textPrimary,
    padding: 14,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  inputError: { borderColor: COLORS.error },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginTop: SPACING.xs,
  },
  linkRow: {
    paddingVertical: SPACING.sm,
  },
  linkText: {
    color: COLORS.cyanLight,
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  privacyCard: { width: '100%', backgroundColor: 'rgba(16,185,129,0.08)' },
  privacyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});

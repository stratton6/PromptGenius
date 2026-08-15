import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton, LoadingSpinner } from '../../components/CustomButton';
import { GlassCard } from '../../components/GlassCard';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useApiKey } from '../../hooks/useApiKey';
import { generateMasterPrompt } from '../../services/gemini';

export default function PromptGeneratorScreen() {
  const { apiKey } = useApiKey();
  const [userGoal, setUserGoal] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const resultAnim = useRef(new Animated.Value(0)).current;

  const handleGenerate = async () => {
    if (!userGoal.trim()) {
      setError('Please describe what you want to achieve.');
      return;
    }
    if (!apiKey) return;
    setLoading(true);
    setError('');
    setResult('');
    try {
      const prompt = await generateMasterPrompt(userGoal.trim(), apiKey);
      setResult(prompt);
      Animated.timing(resultAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setUserGoal('');
    setResult('');
    setError('');
    resultAnim.setValue(0);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <LinearGradient
            colors={['rgba(124,58,237,0.15)', 'transparent']}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <Text style={styles.badge}>✦  PROMPT GENERATOR</Text>
              <Text style={styles.title}>Craft the Perfect{'\n'}Master Prompt</Text>
              <Text style={styles.subtitle}>
                Describe your goal in plain English — we'll engineer a powerful, structured prompt for any AI.
              </Text>
            </View>
          </LinearGradient>

          {/* Input section */}
          <GlassCard style={styles.inputCard}>
            <Text style={styles.inputLabel}>YOUR GOAL</Text>
            <TextInput
              style={styles.textArea}
              placeholder="e.g. Write a cold email campaign for a SaaS productivity tool targeting startup founders..."
              placeholderTextColor={COLORS.textMuted}
              value={userGoal}
              onChangeText={(t) => {
                setUserGoal(t);
                setError('');
              }}
              multiline
              textAlignVertical="top"
              returnKeyType="default"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.actionRow}>
              {result ? (
                <CustomButton
                  title="Clear"
                  variant="ghost"
                  onPress={handleClear}
                />
              ) : null}
              <CustomButton
                title={loading ? 'Generating...' : '✦  Generate Prompt'}
                onPress={handleGenerate}
                loading={loading}
                disabled={!userGoal.trim()}
                fullWidth={!result}
                style={{ flex: result ? 1 : undefined }}
              />
            </View>
          </GlassCard>

          {/* Result */}
          {loading && !result ? (
            <LoadingSpinner label="Engineering your master prompt..." />
          ) : null}

          {result ? (
            <Animated.View style={{ opacity: resultAnim }}>
              <GlassCard gradient style={styles.resultCard}>
                {/* Result header */}
                <View style={styles.resultHeader}>
                  <View style={styles.resultBadge}>
                    <Text style={styles.resultBadgeText}>✅ MASTER PROMPT</Text>
                  </View>
                  <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
                    <Text style={styles.copyButtonText}>
                      {copied ? '✓ Copied!' : '⎘ Copy'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.resultText}>{result}</Text>
              </GlassCard>

              {/* Tips */}
              <GlassCard style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
                <Text style={styles.tipsText}>
                  • Paste this prompt directly into ChatGPT, Claude, or Gemini{'\n'}
                  • Refine by adding more context about your audience{'\n'}
                  • Use as a system prompt for even better results
                </Text>
              </GlassCard>
            </Animated.View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg0 },
  scrollContent: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  headerGradient: { borderRadius: RADIUS.lg, marginBottom: SPACING.sm },
  header: { padding: SPACING.md },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.violetLight,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  inputCard: {},
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  textArea: {
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: RADIUS.md,
    color: COLORS.textPrimary,
    padding: 14,
    fontSize: 15,
    minHeight: 120,
    lineHeight: 22,
  },
  errorText: { color: COLORS.error, fontSize: 13, marginTop: SPACING.xs },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  resultCard: { marginTop: SPACING.sm },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  resultBadge: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  resultBadgeText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  copyButton: {
    backgroundColor: COLORS.violetGlow,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.violetLight,
  },
  copyButtonText: { color: COLORS.violetLight, fontSize: 13, fontWeight: '600' },
  resultText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 24,
  },
  tipsCard: { backgroundColor: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)' },
  tipsTitle: { color: COLORS.warning, fontWeight: '700', fontSize: 14, marginBottom: SPACING.sm },
  tipsText: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 22 },
});

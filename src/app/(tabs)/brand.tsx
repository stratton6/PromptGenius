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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton, LoadingSpinner } from '../../components/CustomButton';
import { GlassCard } from '../../components/GlassCard';
import { ResponsiveWrapper } from '../../components/ResponsiveWrapper';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useApiKey } from '../../hooks/useApiKey';
import { generateBrandStrategy, BrandStrategy } from '../../services/gemini';

function SectionCard({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <GlassCard gradient style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEmoji}>{emoji}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </GlassCard>
  );
}

export default function BrandStrategyScreen() {
  const { apiKey } = useApiKey();
  const [brandName, setBrandName] = useState('');
  const [niche, setNiche] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [strategy, setStrategy] = useState<BrandStrategy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultAnim = useRef(new Animated.Value(0)).current;

  const handleGenerate = async () => {
    if (!brandName.trim() || !niche.trim()) {
      setError('Please fill out the required fields.');
      return;
    }
    if (!apiKey) return;

    setLoading(true);
    setError('');
    setStrategy(null);
    try {
      const res = await generateBrandStrategy(brandName, niche, targetAudience, apiKey);
      setStrategy(res);
      Animated.timing(resultAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to generate strategy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setBrandName('');
    setNiche('');
    setTargetAudience('');
    setStrategy(null);
    setError('');
    resultAnim.setValue(0);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ResponsiveWrapper>
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
              colors={['rgba(6,182,212,0.15)', 'transparent']}
              style={styles.headerGradient}
            >
              <View style={styles.header}>
                <Text style={styles.badge}>◈  BRAND STRATEGY</Text>
                <Text style={styles.title}>Define Your{'\n'}Digital Identity</Text>
              </View>
            </LinearGradient>

            {/* Input Form */}
            <GlassCard style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>BRAND NAME *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Acme Corp"
                  placeholderTextColor={COLORS.textMuted}
                  value={brandName}
                  onChangeText={setBrandName}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NICHE / INDUSTRY *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. B2B Productivity Software"
                  placeholderTextColor={COLORS.textMuted}
                  value={niche}
                  onChangeText={setNiche}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>TARGET AUDIENCE</Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="e.g. Remote teams looking to save time on meetings..."
                  placeholderTextColor={COLORS.textMuted}
                  value={targetAudience}
                  onChangeText={setTargetAudience}
                  multiline
                />
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.actionRow}>
                {strategy ? (
                  <CustomButton
                    title="Clear"
                    variant="ghost"
                    onPress={handleClear}
                  />
                ) : null}
                <CustomButton
                  title={loading ? 'Analyzing...' : '◈  Generate Strategy'}
                  onPress={handleGenerate}
                  loading={loading}
                  disabled={!brandName.trim() || !niche.trim()}
                  fullWidth={!strategy}
                  style={{ flex: strategy ? 1 : undefined }}
                />
              </View>
            </GlassCard>

            {loading && !strategy ? <LoadingSpinner label="AI is crafting your brand persona..." /> : null}

            {strategy ? (
              <Animated.View style={{ opacity: resultAnim, gap: SPACING.md, marginTop: SPACING.sm }}>
                {/* Brand Persona */}
                <SectionCard title="Brand Persona" emoji="🎭">
                  <View style={styles.personaRow}>
                    <View style={styles.personaItem}>
                      <Text style={styles.personaKey}>Archetype</Text>
                      <Text style={styles.personaValue}>{strategy.persona?.archetype}</Text>
                    </View>
                    <View style={styles.personaItem}>
                      <Text style={styles.personaKey}>Tone</Text>
                      <Text style={styles.personaValue}>{strategy.persona?.tone}</Text>
                    </View>
                  </View>
                  <View style={styles.badgeList}>
                    {strategy.persona?.personality?.map((p, i) => (
                      <View key={i} style={styles.badgeItem}>
                        <Text style={styles.badgeItemText}>{p}</Text>
                      </View>
                    ))}
                  </View>
                </SectionCard>

                {/* Audience Insight */}
                <SectionCard title="Audience Insights" emoji="👥">
                  <Text style={styles.insightText}>
                    <Text style={styles.insightBold}>Demographics:</Text> {strategy.audience?.demographics}
                  </Text>
                  <Text style={styles.insightText}>
                    <Text style={styles.insightBold}>Psychographics:</Text> {strategy.audience?.psychographics}
                  </Text>
                  
                  <Text style={[styles.insightBold, { marginTop: SPACING.sm }]}>Pain Points</Text>
                  {strategy.audience?.painPoints?.map((p, i) => (
                    <Text key={i} style={styles.listItem}>• {p}</Text>
                  ))}

                  <Text style={[styles.insightBold, { marginTop: SPACING.sm }]}>Core Desires</Text>
                  {strategy.audience?.desiredOutcomes?.map((p, i) => (
                    <Text key={i} style={styles.listItem}>• {p}</Text>
                  ))}
                </SectionCard>

                {/* Marketing Hooks */}
                <SectionCard title="Marketing Hooks" emoji="🎣">
                  {strategy.hooks?.map((h, i) => (
                    <View key={i} style={styles.hookItem}>
                      <Text style={styles.hookType}>{h.type?.toUpperCase()}</Text>
                      <Text style={styles.hookHeadline}>"{h.headline}"</Text>
                      <Text style={styles.hookSubtext}>{h.subtext}</Text>
                    </View>
                  ))}
                </SectionCard>
              </Animated.View>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </ResponsiveWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg0 },
  scrollContent: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  headerGradient: { borderRadius: RADIUS.lg, marginBottom: SPACING.xs },
  header: { padding: SPACING.md },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cyanLight,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  formCard: { gap: SPACING.md },
  inputGroup: { gap: SPACING.xs },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  input: {
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: RADIUS.md,
    color: COLORS.textPrimary,
    padding: 14,
    fontSize: 15,
  },
  errorText: { color: COLORS.error, fontSize: 13 },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  sectionCard: {},
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder, paddingBottom: SPACING.sm, marginBottom: SPACING.md },
  sectionEmoji: { fontSize: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  sectionContent: {},
  personaRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  personaItem: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: SPACING.sm, borderRadius: RADIUS.sm },
  personaKey: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', marginBottom: 2, textTransform: 'uppercase' },
  personaValue: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  badgeList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badgeItem: { backgroundColor: COLORS.violetGlow, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.violetLight },
  badgeItemText: { color: COLORS.violetLight, fontSize: 12, fontWeight: '600' },
  insightText: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22, marginBottom: SPACING.xs },
  insightBold: { color: COLORS.textPrimary, fontWeight: '700' },
  listItem: { color: COLORS.textSecondary, fontSize: 14, marginLeft: SPACING.sm, lineHeight: 22 },
  hookItem: { marginBottom: SPACING.md },
  hookType: { color: COLORS.cyanLight, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  hookHeadline: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  hookSubtext: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
});

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
import { BrandStrategy, generateBrandStrategy } from '../../services/gemini';

function SectionCard({
  title,
  emoji,
  children,
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <GlassCard style={styles.sectionCard}>
      <TouchableOpacity
        onPress={() => setOpen((o) => !o)}
        style={styles.sectionHeader}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionEmoji}>{emoji}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open ? <View style={styles.sectionBody}>{children}</View> : null}
    </GlassCard>
  );
}

function Tag({ text, color = COLORS.violetLight }: { text: string; color?: string }) {
  return (
    <View style={[styles.tag, { borderColor: color + '55', backgroundColor: color + '15' }]}>
      <Text style={[styles.tagText, { color }]}>{text}</Text>
    </View>
  );
}

export default function BrandStrategyScreen() {
  const { apiKey } = useApiKey();
  const [brandName, setBrandName] = useState('');
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [strategy, setStrategy] = useState<BrandStrategy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultAnim = useRef(new Animated.Value(0)).current;

  const handleGenerate = async () => {
    if (!brandName.trim() || !niche.trim()) {
      setError('Brand name and niche are required.');
      return;
    }
    if (!apiKey) return;
    setLoading(true);
    setError('');
    setStrategy(null);
    resultAnim.setValue(0);
    try {
      const result = await generateBrandStrategy(
        brandName.trim(),
        niche.trim(),
        audience.trim() || 'General',
        apiKey
      );
      setStrategy(result);
      Animated.timing(resultAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to generate strategy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setBrandName('');
    setNiche('');
    setAudience('');
    setStrategy(null);
    setError('');
    resultAnim.setValue(0);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <LinearGradient
            colors={['rgba(6,182,212,0.12)', 'transparent']}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <Text style={styles.badge}>◈  BRAND STRATEGY</Text>
              <Text style={styles.title}>AI-Powered Brand{'\n'}Intelligence</Text>
              <Text style={styles.subtitle}>
                Enter your brand details to receive a full strategic brief: persona, hooks, and audience insights.
              </Text>
            </View>
          </LinearGradient>

          {/* Form */}
          <GlassCard style={styles.formCard}>
            <Text style={styles.fieldLabel}>BRAND NAME *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. NovaMind"
              placeholderTextColor={COLORS.textMuted}
              value={brandName}
              onChangeText={(t) => { setBrandName(t); setError(''); }}
            />

            <Text style={[styles.fieldLabel, { marginTop: SPACING.md }]}>NICHE / INDUSTRY *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. AI Productivity Tools for Remote Teams"
              placeholderTextColor={COLORS.textMuted}
              value={niche}
              onChangeText={(t) => { setNiche(t); setError(''); }}
            />

            <Text style={[styles.fieldLabel, { marginTop: SPACING.md }]}>TARGET AUDIENCE (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Remote workers, 25-40, tech-savvy"
              placeholderTextColor={COLORS.textMuted}
              value={audience}
              onChangeText={setAudience}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.actionRow}>
              {strategy ? (
                <CustomButton title="Reset" variant="ghost" onPress={handleClear} />
              ) : null}
              <CustomButton
                title={loading ? 'Analyzing...' : '◈  Build Strategy'}
                onPress={handleGenerate}
                loading={loading}
                disabled={!brandName.trim() || !niche.trim()}
                fullWidth={!strategy}
                style={{ flex: strategy ? 1 : undefined }}
              />
            </View>
          </GlassCard>

          {loading ? <LoadingSpinner label="Building your brand brief..." /> : null}

          {strategy ? (
            <Animated.View style={{ opacity: resultAnim, gap: SPACING.md }}>
              {/* Brand Persona */}
              <SectionCard title="Brand Persona & Tone" emoji="🎭">
                <View style={styles.personaRow}>
                  <View style={styles.personaItem}>
                    <Text style={styles.personaKey}>Archetype</Text>
                    <Text style={styles.personaValue}>{strategy.persona.archetype}</Text>
                  </View>
                  <View style={styles.personaItem}>
                    <Text style={styles.personaKey}>Tone</Text>
                    <Text style={styles.personaValue}>{strategy.persona.tone}</Text>
                  </View>
                </View>
                <Text style={styles.personaKey}>Personality Traits</Text>
                <View style={styles.tagRow}>
                  {strategy.persona.personality.map((t) => (
                    <Tag key={t} text={t} color={COLORS.violetLight} />
                  ))}
                </View>
                <Text style={[styles.personaKey, { marginTop: SPACING.sm }]}>Brand Values</Text>
                <View style={styles.tagRow}>
                  {strategy.persona.values.map((v) => (
                    <Tag key={v} text={v} color={COLORS.cyanLight} />
                  ))}
                </View>
              </SectionCard>

              {/* Marketing Hooks */}
              <SectionCard title="Marketing Hooks" emoji="🎯">
                {strategy.hooks.map((hook, i) => (
                  <View key={i} style={styles.hookCard}>
                    <View style={styles.hookType}>
                      <Text style={styles.hookTypeText}>{hook.type}</Text>
                    </View>
                    <Text style={styles.hookHeadline}>{hook.headline}</Text>
                    <Text style={styles.hookSubtext}>{hook.subtext}</Text>
                  </View>
                ))}
              </SectionCard>

              {/* Audience */}
              <SectionCard title="Audience Deep-Dive" emoji="👥">
                <Text style={styles.personaKey}>Demographics</Text>
                <Text style={styles.audienceText}>{strategy.audience.demographics}</Text>

                <Text style={[styles.personaKey, { marginTop: SPACING.sm }]}>Psychographics</Text>
                <Text style={styles.audienceText}>{strategy.audience.psychographics}</Text>

                <Text style={[styles.personaKey, { marginTop: SPACING.sm }]}>Pain Points</Text>
                {strategy.audience.painPoints.map((p, i) => (
                  <Text key={i} style={styles.bulletItem}>• {p}</Text>
                ))}

                <Text style={[styles.personaKey, { marginTop: SPACING.sm }]}>Desired Outcomes</Text>
                {strategy.audience.desiredOutcomes.map((o, i) => (
                  <Text key={i} style={styles.bulletItem}>✓ {o}</Text>
                ))}

                <Text style={[styles.personaKey, { marginTop: SPACING.sm }]}>Best Platforms</Text>
                <View style={styles.tagRow}>
                  {strategy.audience.platforms.map((p) => (
                    <Tag key={p} text={p} color={COLORS.success} />
                  ))}
                </View>
              </SectionCard>
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
    marginBottom: SPACING.sm,
  },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  formCard: {},
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
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
  errorText: { color: COLORS.error, fontSize: 13, marginTop: SPACING.xs },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  sectionCard: { gap: 0 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionEmoji: { fontSize: 20 },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  chevron: { color: COLORS.textMuted, fontSize: 12 },
  sectionBody: { marginTop: SPACING.md, gap: SPACING.sm },
  personaRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.sm },
  personaItem: { flex: 1, gap: 4 },
  personaKey: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  personaValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: 4 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  tagText: { fontSize: 12, fontWeight: '600' },
  hookCard: {
    backgroundColor: COLORS.bg2,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  hookType: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.violetGlow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  hookTypeText: { color: COLORS.violetLight, fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  hookHeadline: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700', lineHeight: 22 },
  hookSubtext: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
  audienceText: { color: COLORS.textPrimary, fontSize: 14, lineHeight: 22 },
  bulletItem: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22 },
});

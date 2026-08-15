import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../../components/CustomButton';
import { GlassCard } from '../../components/GlassCard';
import { ResponsiveWrapper } from '../../components/ResponsiveWrapper';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useApiKey } from '../../hooks/useApiKey';
import { validateApiKey } from '../../services/gemini';

function maskKey(key: string): string {
  if (!key || key.length < 12) return '•••••••••••••••••••';
  return key.slice(0, 8) + '•'.repeat(Math.max(key.length - 12, 8)) + key.slice(-4);
}

export default function SettingsScreen() {
  const { apiKey, setKey, clearKey } = useApiKey();
  const [editing, setEditing] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async () => {
    const trimmed = newKey.trim();
    if (!trimmed) {
      setError('Please enter a new API key.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const valid = await validateApiKey(trimmed);
      if (!valid) {
        setError('Could not verify this key with Gemini. Please check and try again.');
        return;
      }
      await setKey(trimmed);
      setSuccess('API key updated successfully!');
      setEditing(false);
      setNewKey('');
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    // If on web, Alert.alert doesn't always work as expected depending on setup, 
    // but Expo handles it okay. A simple fallback:
    if (Platform.OS === 'web') {
      const confirm = window.confirm('This will log you out. Continue?');
      if (confirm) {
        clearKey().then(() => router.replace('/onboarding'));
      }
      return;
    }

    Alert.alert(
      'Remove API Key',
      'This will log you out and take you back to the setup screen. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await clearKey();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ResponsiveWrapper>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <LinearGradient
            colors={['rgba(124,58,237,0.1)', 'transparent']}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <Text style={styles.badge}>⚙  SETTINGS</Text>
              <Text style={styles.title}>Account &{'\n'}Configuration</Text>
            </View>
          </LinearGradient>

          {/* API Key Card */}
          <GlassCard gradient style={styles.keyCard}>
            <View style={styles.keyRow}>
              <View style={styles.keyIconWrap}>
                <LinearGradient
                  colors={['#7C3AED', '#06B6D4']}
                  style={styles.keyIcon}
                >
                  <Text style={{ fontSize: 20 }}>🔑</Text>
                </LinearGradient>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.keyCardTitle}>Gemini API Key</Text>
                <Text style={styles.maskedKey}>
                  {apiKey ? maskKey(apiKey) : 'No key stored'}
                </Text>
              </View>
            </View>

            {!editing ? (
              <View style={styles.keyActions}>
                <CustomButton
                  title="✏  Update Key"
                  onPress={() => {
                    setEditing(true);
                    setSuccess('');
                    setError('');
                  }}
                  variant="secondary"
                  style={{ flex: 1 }}
                />
                <CustomButton
                  title="Remove"
                  onPress={handleDelete}
                  variant="ghost"
                />
              </View>
            ) : (
              <View style={{ gap: SPACING.sm, marginTop: SPACING.md }}>
                <TextInput
                  style={[styles.input, error ? styles.inputError : null]}
                  placeholder="Enter new API key..."
                  placeholderTextColor={COLORS.textMuted}
                  value={newKey}
                  onChangeText={(t) => {
                    setNewKey(t);
                    setError('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <View style={styles.keyActions}>
                  <CustomButton
                    title="Save"
                    onPress={handleUpdate}
                    loading={saving}
                    style={{ flex: 1 }}
                  />
                  <CustomButton
                    title="Cancel"
                    variant="ghost"
                    onPress={() => {
                      setEditing(false);
                      setNewKey('');
                      setError('');
                    }}
                  />
                </View>
              </View>
            )}
            {success ? (
              <Text style={styles.successText}>✅ {success}</Text>
            ) : null}
          </GlassCard>

          {/* App Info */}
          <GlassCard style={styles.infoCard}>
            <Text style={styles.infoTitle}>PromptGenius</Text>
            <Text style={styles.infoVersion}>Version 2.0.0 · Web Ready</Text>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>{Platform.OS === 'web' ? '🌐 Web' : Platform.OS === 'ios' ? '🍎 iOS' : '🤖 Android'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>AI Model</Text>
              <Text style={styles.infoValue}>Gemini 1.5 Flash</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Storage</Text>
              <Text style={styles.infoValue}>Local AsyncStorage</Text>
            </View>
          </GlassCard>

          {/* Links */}
          <GlassCard style={styles.linksCard}>
            <Text style={styles.linksTitle}>Resources</Text>
            {[
              {
                label: 'Get / Manage API Keys',
                url: 'https://aistudio.google.com/app/apikey',
                icon: '🔑',
              },
              {
                label: 'Gemini API Docs',
                url: 'https://ai.google.dev/gemini-api/docs',
                icon: '📖',
              },
              {
                label: 'Source Code on GitHub',
                url: 'https://github.com/stratton6/PromptGenius',
                icon: '💻',
              },
            ].map((link) => (
              <TouchableOpacity
                key={link.url}
                onPress={() => Linking.openURL(link.url)}
                style={styles.linkRow}
                activeOpacity={0.7}
              >
                <Text style={styles.linkIcon}>{link.icon}</Text>
                <Text style={styles.linkText}>{link.label}</Text>
                <Text style={styles.linkArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </GlassCard>

          {/* Privacy note */}
          <GlassCard style={styles.privacyCard}>
            <Text style={styles.privacyText}>
              🔒 <Text style={{ fontWeight: '700', color: COLORS.success }}>Privacy First.</Text>{' '}
              PromptGenius never transmits your API key to any external server. All AI requests are
              made directly from your device to Google's Gemini API.
            </Text>
          </GlassCard>
        </ScrollView>
      </ResponsiveWrapper>
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
  },
  keyCard: {},
  keyRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  keyIconWrap: {
    shadowColor: COLORS.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  keyIcon: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyCardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  maskedKey: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
  },
  keyActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
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
  errorText: { color: COLORS.error, fontSize: 13 },
  successText: { color: COLORS.success, fontSize: 13, marginTop: SPACING.sm, fontWeight: '600' },
  infoCard: {},
  infoTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  infoVersion: { fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.sm },
  divider: { height: 1, backgroundColor: COLORS.glassBorder, marginVertical: SPACING.sm },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: { color: COLORS.textSecondary, fontSize: 14 },
  infoValue: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  linksCard: {},
  linksTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.glassBorder,
  },
  linkIcon: { fontSize: 18, width: 28 },
  linkText: { flex: 1, color: COLORS.textPrimary, fontSize: 14, fontWeight: '500' },
  linkArrow: { color: COLORS.textMuted, fontSize: 16 },
  privacyCard: { backgroundColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)' },
  privacyText: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 22 },
});

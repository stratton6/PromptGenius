import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResponsiveWrapper } from '../../components/ResponsiveWrapper';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const TRENDING_PROMPTS = [
  { id: '1', title: 'Cinematic Midjourney', emoji: '📸', desc: 'Create hyper-realistic portraits.' },
  { id: '2', title: 'React Hooks Guide', emoji: '⚛️', desc: 'Generate a senior-level dev explanation.' },
  { id: '3', title: 'SEO Blog Post', emoji: '✍️', desc: 'Write a ranked article structure.' },
];

const CATEGORIES = [
  { id: 'img', title: 'Best Wallpapers', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' },
  { id: 'code', title: 'Coding & Tech', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop' },
  { id: 'mkt', title: 'Marketing', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop' },
  { id: 'write', title: 'Copywriting', image: 'https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=600&auto=format&fit=crop' },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ResponsiveWrapper>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <LinearGradient
            colors={['rgba(6,182,212,0.15)', 'transparent']}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <Text style={styles.badge}>👋  WELCOME BACK</Text>
              <Text style={styles.title}>Explore &{'\n'}Discover</Text>
            </View>
          </LinearGradient>

          {/* AI News / Highlight */}
          <View style={styles.newsBanner}>
            <LinearGradient
              colors={['#7C3AED', '#06B6D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.newsGradient}
            >
              <Text style={styles.newsBadge}>LATEST AI NEWS</Text>
              <Text style={styles.newsTitle}>Gemini 1.5 Pro Expands Context Window!</Text>
              <Text style={styles.newsDesc}>
                Learn how to leverage the massive context to analyze entire codebases in one prompt.
              </Text>
            </LinearGradient>
          </View>

          {/* Trending Prompts */}
          <Text style={styles.sectionTitle}>🔥 Trending Prompts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {TRENDING_PROMPTS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.promptCard}
                onPress={() => router.navigate('/generate')}
              >
                <Text style={styles.promptEmoji}>{p.emoji}</Text>
                <Text style={styles.promptTitle}>{p.title}</Text>
                <Text style={styles.promptDesc}>{p.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Categories */}
          <Text style={styles.sectionTitle}>📂 Sectors & Categories</Text>
          <View style={styles.grid}>
            {CATEGORIES.map(c => (
              <TouchableOpacity
                key={c.id}
                style={styles.categoryCard}
                onPress={() => router.navigate('/generate')}
              >
                <Image source={{ uri: c.image }} style={styles.categoryImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.categoryOverlay}
                />
                <Text style={styles.categoryTitle}>{c.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
  newsBanner: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  newsGradient: {
    padding: SPACING.lg,
  },
  newsBadge: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  newsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  newsDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  horizontalScroll: {
    gap: SPACING.md,
    paddingRight: SPACING.lg,
  },
  promptCard: {
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    width: 160,
  },
  promptEmoji: { fontSize: 24, marginBottom: SPACING.sm },
  promptTitle: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 14, marginBottom: 4 },
  promptDesc: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  categoryCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: SPACING.sm,
  },
  categoryTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
  },
});

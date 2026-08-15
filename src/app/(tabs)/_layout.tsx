import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <Text
      style={[
        styles.tabIcon,
        { opacity: focused ? 1 : 0.45, transform: [{ scale: focused ? 1.15 : 1 }] },
      ]}
    >
      {icon}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.violetLight,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="generate"
        options={{
          title: 'Generator',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="✦" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="brand"
        options={{
          title: 'Brand',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="◈" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⚙" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(13, 13, 28, 0.95)',
    borderTopColor: COLORS.glassBorder,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 0 : 8,
    height: Platform.OS === 'ios' ? 85 : 64,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tabItem: {
    gap: 2,
  },
  tabIcon: {
    fontSize: 22,
    marginTop: 2,
  },
});

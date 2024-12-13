import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#444444',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: { backgroundColor: '#FFDE21' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Characters',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="manuals"
        options={{
          title: 'Manuals',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="character/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

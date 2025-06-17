import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      // Configure the appearance and behavior of the tab bar
      screenOptions={({ route }) => ({
        // Customize the tab bar icons based on the route and focus state
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'History':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Tab bar styling
        tabBarActiveTintColor: '#1565C0',    // Color for active tab
        tabBarInactiveTintColor: isDark ? '#666666' : '#999999',     // Color for inactive tabs
        tabBarStyle: {
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          borderTopColor: isDark ? '#333333' : '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      {/* Home Tab */}
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
      />
      {/* History Tab */}
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
      />
      {/* Settings Tab */}
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
      {/* Profile Tab */}
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator; 
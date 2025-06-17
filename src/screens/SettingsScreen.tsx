import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen: React.FC = () => {
  const { isDark, theme, setTheme } = useTheme();

  const renderSettingItem = (icon: string, title: string, value?: React.ReactNode) => (
    <View style={[styles.settingItem, isDark && styles.settingItemDark]}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={isDark ? '#FFFFFF' : '#2C3E50'} />
        <Text style={[styles.settingTitle, isDark && styles.textDark]}>{title}</Text>
      </View>
      {value}
    </View>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Appearance</Text>
          {renderSettingItem(
            'moon',
            'Dark Mode',
            <Switch
              value={isDark}
              onValueChange={() => setTheme(isDark ? 'light' : 'dark')}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDark ? '#1565C0' : '#f4f3f4'}
            />
          )}
          {renderSettingItem(
            'phone-portrait',
            'Use System Theme',
            <Switch
              value={theme === 'system'}
              onValueChange={(value) => setTheme(value ? 'system' : isDark ? 'dark' : 'light')}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={theme === 'system' ? '#1565C0' : '#f4f3f4'}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Notifications</Text>
          {renderSettingItem(
            'notifications',
            'Push Notifications',
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={true ? '#1565C0' : '#f4f3f4'}
            />
          )}
          {renderSettingItem(
            'mail',
            'Email Notifications',
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={false ? '#1565C0' : '#f4f3f4'}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>About</Text>
          {renderSettingItem('information-circle', 'App Version', <Text style={[styles.settingValue, isDark && styles.textDark]}>1.0.0</Text>)}
          {renderSettingItem('help-circle', 'Help & Support')}
          {renderSettingItem('document-text', 'Terms of Service')}
          {renderSettingItem('shield-checkmark', 'Privacy Policy')}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 15,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingItemDark: {
    backgroundColor: '#2C2C2C',
    borderBottomColor: '#404040',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 15,
  },
  settingValue: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  textDark: {
    color: '#FFFFFF',
  },
});

export default SettingsScreen; 
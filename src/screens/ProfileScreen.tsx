import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Mock user data
const userData = {
  name: 'Sheryar karim',
  email: 'shedymelvin777@gmail.com',
  quizzesCreated: 15,
  quizzesPlayed: 42,
  averageScore: 85,
  joinDate: 'January 2024',
};

// Mock achievements
const achievements = [
  {
    id: '1',
    title: 'Quiz Master',
    description: 'Created 10 quizzes',
    icon: 'trophy',
    completed: true,
  },
  {
    id: '2',
    title: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: 'star',
    completed: true,
  },
  {
    id: '3',
    title: 'Social Butterfly',
    description: 'Share 5 quizzes',
    icon: 'share-social',
    completed: false,
  },
];

const ProfileScreen: React.FC = () => {
  const { isDark, theme, setTheme } = useTheme();

  const stats = [
    { label: 'Quizzes Created', value: '12', icon: 'create' },
    { label: 'Quizzes Played', value: '45', icon: 'game-controller' },
    { label: 'Average Score', value: '85%', icon: 'trophy' },
  ];

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
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.header, isDark && styles.headerDark]}>
          <View style={styles.profileInfo}>
            <View style={[styles.avatar, isDark && styles.avatarDark]}>
              <Ionicons name="person" size={40} color={isDark ? '#FFFFFF' : '#2C3E50'} />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.username, isDark && styles.textDark]}>{userData.name}</Text>
              <Text style={[styles.email, isDark && styles.textDark]}>{userData.email}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.statsContainer, isDark && styles.statsContainerDark]}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, isDark && styles.statCardDark]}>
              <Ionicons name={stat.icon} size={24} color={isDark ? '#FFFFFF' : '#2C3E50'} />
              <Text style={[styles.statValue, isDark && styles.textDark]}>{stat.value}</Text>
              <Text style={[styles.statLabel, isDark && styles.textDark]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.achievementsContainer, isDark && styles.achievementsContainerDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Achievements</Text>
          {achievements.map((achievement, index) => (
            <View key={index} style={[styles.achievementCard, isDark && styles.achievementCardDark]}>
              <View style={styles.achievementHeader}>
                <Ionicons name={achievement.icon} size={24} color={isDark ? '#FFFFFF' : '#2C3E50'} />
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTitle, isDark && styles.textDark]}>{achievement.title}</Text>
                  <Text style={[styles.achievementDescription, isDark && styles.textDark]}>{achievement.description}</Text>
                </View>
              </View>
              <View style={[styles.progressBar, isDark && styles.progressBarDark]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${achievement.completed ? 100 : 0}%` },
                    isDark && styles.progressFillDark
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

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
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Account</Text>
          {renderSettingItem('person', 'Edit Profile')}
          {renderSettingItem('notifications', 'Notifications')}
          {renderSettingItem('lock-closed', 'Privacy')}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Support</Text>
          {renderSettingItem('help-circle', 'Help Center')}
          {renderSettingItem('information-circle', 'About')}
          {renderSettingItem('log-out', 'Sign Out')}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerDark: {
    backgroundColor: '#2C2C2C',
    borderBottomColor: '#333333',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarDark: {
    backgroundColor: '#404040',
  },
  userInfo: {
    marginLeft: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  email: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 4,
  },
  textDark: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statsContainerDark: {
    backgroundColor: '#2C2C2C',
    borderBottomColor: '#333333',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginHorizontal: 5,
  },
  statCardDark: {
    backgroundColor: '#404040',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  achievementsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  achievementsContainerDark: {
    backgroundColor: '#2C2C2C',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  achievementCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  achievementCardDark: {
    backgroundColor: '#404040',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementInfo: {
    marginLeft: 15,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 15,
  },
  progressBarDark: {
    backgroundColor: '#333333',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  progressFillDark: {
    backgroundColor: '#1565C0',
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
});

export default ProfileScreen; 
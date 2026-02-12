import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TASKS, DailyProgress } from '@/types';
import { getDayProgress, updateDailyProgress, getStreak, getStorageData } from '@/utils/storage';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/components/ThemeContext';

const QUOTES = [
  "Dream it. Believe it. Build it.",
  "Discipline corresponds to freedom.",
  "The hard way is the right way.",
  "Don't stop when you're tired. Stop when you're done.",
  "Your only limit is you.",
];

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<DailyProgress | null>(null);
  const [streak, setStreak] = useState(1);
  const [quote, setQuote] = useState(QUOTES[0]);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const { toggleTheme } = useTheme();

  const today = format(new Date(), 'yyyy-MM-dd');

  const loadData = async () => {
    try {
      const progress = await getDayProgress(today);
      const allData = await getStorageData();
      const currentStreak = getStreak(allData);

      setTasks(progress);
      setStreak(currentStreak);

      // Pick a quote based on day of month to be consistent for the day
      const dayOfMonth = new Date().getDate();
      setQuote(QUOTES[dayOfMonth % QUOTES.length]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleToggle = async (taskId: keyof DailyProgress) => {
    if (!tasks) return;
    const newValue = !tasks[taskId];

    // Optimistic update
    setTasks({ ...tasks, [taskId]: newValue });

    await updateDailyProgress(today, taskId, newValue);
  };

  const getProgress = () => {
    if (!tasks) return 0;
    const completed = TASKS.filter(t => tasks[t.id]).length;
    return completed / TASKS.length;
  };

  const progress = getProgress();

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <ThemedText type="title">Hard Mode 75</ThemedText>
          <ThemedText style={styles.subtitle}>No excuses. Just discipline.</ThemedText>
        </View>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <MaterialCommunityIcons name={colorScheme === 'dark' ? 'weather-sunny' : 'weather-night'} size={24} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.quoteContainer}>
        <ThemedText style={styles.quoteText}>"{quote}"</ThemedText>
      </View>

      <View style={[styles.streakCard, { backgroundColor: '#3B82F6' }]}>
        <ThemedText style={styles.streakLabel}>CURRENT STREAK</ThemedText>
        <ThemedText style={styles.streakValue}>Day {streak} of 75</ThemedText>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressLabelRow}>
          <ThemedText>Today's Progress</ThemedText>
          <ThemedText>{Math.round(progress * 100)}%</ThemedText>
        </View>
        <View style={[styles.progressBarBackground, { backgroundColor: colorScheme === 'dark' ? '#333' : '#E5E7EB' }]}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: '#3B82F6' }]} />
        </View>
      </View>

      <View style={styles.tasksContainer}>
        {TASKS.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskRow}
            onPress={() => handleToggle(task.id as keyof DailyProgress)}
            activeOpacity={0.7}
          >
            <View style={styles.taskIcon}>
              <MaterialCommunityIcons name={task.icon as any} size={24} color={themeColors.text} />
            </View>
            <ThemedText style={styles.taskLabel}>{task.label}</ThemedText>
            <View style={[styles.checkbox, tasks && tasks[task.id as keyof DailyProgress] && styles.checkboxChecked]}>
              {tasks && tasks[task.id as keyof DailyProgress] && (
                <MaterialCommunityIcons name="check" size={16} color="white" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  themeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  quoteContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  quoteText: {
    fontStyle: 'italic',
    fontSize: 14,
  },
  streakCard: {
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  streakLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 5,
  },
  streakValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  tasksContainer: {
    gap: 16,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  taskIcon: {
    width: 40,
    alignItems: 'center',
  },
  taskLabel: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
  }
});

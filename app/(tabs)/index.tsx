import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/components/ThemeContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DailyProgress, TASKS } from '@/types';
import { getDayProgress, getStorageData, getStreak, updateDailyProgress } from '@/utils/storage';

import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { QuoteCard } from '@/components/dashboard/QuoteCard';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { TaskItem } from '@/components/dashboard/TaskItem';

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View>
            <ThemedText type="title">Hard Mode 75</ThemedText>
            <ThemedText style={styles.subtitle}>No excuses. Just discipline.</ThemedText>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <MaterialCommunityIcons name={colorScheme === 'dark' ? 'weather-sunny' : 'weather-night'} size={24} color={themeColors.text} />
          </TouchableOpacity>
        </View>

        <QuoteCard quote={quote} />

        <StreakCard streak={streak} />

        <ProgressCard progress={progress} />

        <View style={styles.tasksContainer}>
          {TASKS.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isCompleted={!!tasks && !!tasks[task.id as keyof DailyProgress]}
              onToggle={() => handleToggle(task.id as keyof DailyProgress)}
            />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  tasksContainer: {
    gap: 16,
  },
});


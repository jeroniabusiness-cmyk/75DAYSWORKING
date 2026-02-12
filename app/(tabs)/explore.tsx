import { format, subDays } from 'date-fns';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { StatGrid } from '@/components/history/StatGrid';
import { WeeklyChart } from '@/components/history/WeeklyChart';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DailyProgress, TASKS } from '@/types';
import { getStorageData, getStreak } from '@/utils/storage';

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<Record<string, DailyProgress>>({});
  const [streak, setStreak] = useState(0);
  const [perfectDays, setPerfectDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const loadData = async () => {
    try {
      const data = await getStorageData();
      setHistory(data.history);
      setStreak(getStreak(data));

      // Calculate perfect days
      const perfect = Object.values(data.history).filter(day => {
        let completed = 0;
        TASKS.forEach(t => { if (day[t.id as keyof DailyProgress]) completed++ });
        return completed === TASKS.length;
      }).length;
      setPerfectDays(perfect);
      setTotalDays(Object.keys(data.history).length);

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

  const getLast7DaysData = () => {
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayLabel = format(date, 'EEEEE'); // S, M, T, W...

      labels.push(dayLabel);

      const dayData = history[dateStr];
      if (!dayData) {
        data.push(0);
      } else {
        let completed = 0;
        TASKS.forEach(t => { if (dayData[t.id as keyof DailyProgress]) completed++ });
        data.push((completed / TASKS.length) * 100);
      }
    }

    return {
      labels,
      datasets: [{ data }]
    };
  };

  const getTaskCompletionStats = () => {
    return TASKS.map(task => {
      let count = 0;
      Object.values(history).forEach(day => {
        if (day[task.id as keyof DailyProgress]) count++;
      });
      return count;
    });
  };

  const chartData = getLast7DaysData();
  const taskStats = getTaskCompletionStats();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">History</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <StatGrid streak={streak} perfectDays={perfectDays} totalDays={totalDays} />

        <WeeklyChart data={chartData} />

        <ThemedText type="subtitle" style={styles.sectionTitle}>Challenge Completion Rates</ThemedText>
        <ThemedText style={styles.chartSubtitle}>Overall success by category</ThemedText>

        <View style={styles.statsList}>
          {TASKS.map((task, index) => (
            <View key={task.id} style={styles.statRow}>
              <ThemedText>{task.label}</ThemedText>
              <ThemedText>{taskStats[index]}</ThemedText>
            </View>
          ))}
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 4,
    marginTop: 20,
  },
  chartSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 10,
  },
  statsList: {
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150,150,150, 0.2)',
  }
});


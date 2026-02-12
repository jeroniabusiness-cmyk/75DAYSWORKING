import { StyleSheet, Dimensions, ScrollView, View } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { format, subDays } from 'date-fns';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getStorageData, getStreak } from '@/utils/storage';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TASKS, DailyProgress } from '@/types';

const screenWidth = Dimensions.get('window').width;

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<Record<string, DailyProgress>>({});
  const [streak, setStreak] = useState(0);
  const [perfectDays, setPerfectDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const colorScheme = useColorScheme();

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
    // Calculate total success per category
    // This requires iterating all history. simplified for now.
    return TASKS.map(task => {
      let count = 0;
      Object.values(history).forEach(day => {
        if (day[task.id as keyof DailyProgress]) count++;
      });
      return count;
    });
  };

  // Only show if we have data, else plain 0s
  const chartData = getLast7DaysData();
  const taskStats = getTaskCompletionStats();

  const chartConfig = {
    backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#ffffff',
    backgroundGradientFrom: colorScheme === 'dark' ? '#1e1e1e' : '#ffffff',
    backgroundGradientTo: colorScheme === 'dark' ? '#1e1e1e' : '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => colorScheme === 'dark' ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#3B82F6"
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">History</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{streak}</ThemedText>
            <ThemedText style={styles.statLabel}>Current Streak</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{perfectDays}</ThemedText>
            <ThemedText style={styles.statLabel}>Perfect Days</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{totalDays}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Days</ThemedText>
          </View>
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>7-Day Progress</ThemedText>
        <ThemedText style={styles.chartSubtitle}>Daily completion percentage</ThemedText>

        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />

        <ThemedText type="subtitle" style={styles.sectionTitle}>Challenge Completion Rates</ThemedText>
        <ThemedText style={styles.chartSubtitle}>Overall success by category</ThemedText>

        {/* Simple Bar Chart for Task distribution is complex with library without clearer mapping, 
                     sticking to simple stats or just the line chart for now to keep it clean as requested.
                     Maybe just a list of stats?
                  */}
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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

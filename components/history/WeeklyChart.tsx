import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type WeeklyChartProps = {
    data: {
        labels: string[];
        datasets: { data: number[] }[];
    };
};

export function WeeklyChart({ data }: WeeklyChartProps) {
    const colorScheme = useColorScheme();

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
        <>
            <ThemedText type="subtitle" style={styles.sectionTitle}>7-Day Progress</ThemedText>
            <ThemedText style={styles.chartSubtitle}>Daily completion percentage</ThemedText>

            <LineChart
                data={data}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
            />
        </>
    );
}

const styles = StyleSheet.create({
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
});

import { ThemedText } from '@/components/themed-text';
import { StyleSheet, View } from 'react-native';

type StatGridProps = {
    streak: number;
    perfectDays: number;
    totalDays: number;
};

export function StatGrid({ streak, perfectDays, totalDays }: StatGridProps) {
    return (
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
    );
}

const styles = StyleSheet.create({
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
});

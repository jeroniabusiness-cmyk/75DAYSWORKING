import { ThemedText } from '@/components/themed-text';
import { StyleSheet, View } from 'react-native';

type StreakCardProps = {
    streak: number;
};

export function StreakCard({ streak }: StreakCardProps) {
    return (
        <View style={[styles.streakCard, { backgroundColor: '#3B82F6' }]}>
            <ThemedText style={styles.streakLabel}>CURRENT STREAK</ThemedText>
            <ThemedText style={styles.streakValue}>Day {streak} of 75</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
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
});

import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, View } from 'react-native';

type ProgressCardProps = {
    progress: number;
};

export function ProgressCard({ progress }: ProgressCardProps) {
    const colorScheme = useColorScheme();

    return (
        <View style={styles.progressContainer}>
            <View style={styles.progressLabelRow}>
                <ThemedText>Today's Progress</ThemedText>
                <ThemedText>{Math.round(progress * 100)}%</ThemedText>
            </View>
            <View style={[styles.progressBarBackground, { backgroundColor: colorScheme === 'dark' ? '#333' : '#E5E7EB' }]}>
                <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: '#3B82F6' }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
});

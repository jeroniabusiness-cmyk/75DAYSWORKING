import { ThemedText } from '@/components/themed-text';
import { StyleSheet, View } from 'react-native';

type QuoteCardProps = {
    quote: string;
};

export function QuoteCard({ quote }: QuoteCardProps) {
    return (
        <View style={styles.quoteContainer}>
            <ThemedText style={styles.quoteText}>"{quote}"</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
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
});

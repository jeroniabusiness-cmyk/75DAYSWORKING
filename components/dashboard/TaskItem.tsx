import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TASKS } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type TaskItemProps = {
    task: typeof TASKS[number];
    isCompleted: boolean;
    onToggle: () => void;
};

export function TaskItem({ task, isCompleted, onToggle }: TaskItemProps) {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];

    return (
        <TouchableOpacity
            style={styles.taskRow}
            onPress={onToggle}
            activeOpacity={0.7}
        >
            <View style={styles.taskIcon}>
                <MaterialCommunityIcons name={task.icon as any} size={24} color={themeColors.text} />
            </View>
            <ThemedText style={styles.taskLabel}>{task.label}</ThemedText>
            <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
                {isCompleted && (
                    <MaterialCommunityIcons name="check" size={16} color="white" />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: 'rgba(150, 150, 150, 0.05)',
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    taskIcon: {
        width: 40,
        alignItems: 'center',
    },
    taskLabel: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500',
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

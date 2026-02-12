import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { AppData, DailyProgress } from '../types';

const CHECK_STORAGE_KEY = '@75hard_data';

const initialState: AppData = {
    startDate: null,
    history: {},
};

export const getStorageData = async (): Promise<AppData> => {
    try {
        const jsonValue = await AsyncStorage.getItem(CHECK_STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : initialState;
    } catch (e) {
        console.error('Failed to load data', e);
        return initialState;
    }
};

export const saveStorageData = async (data: AppData) => {
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem(CHECK_STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error('Failed to save data', e);
    }
};

export const updateDailyProgress = async (date: string, taskId: keyof DailyProgress, value: boolean) => {
    const currentData = await getStorageData();

    if (!currentData.startDate) {
        currentData.startDate = date;
    }

    const dayData = currentData.history[date] || {
        diet: false,
        workout1: false,
        workout2: false,
        water: false,
        reading: false,
        photo: false,
        date: date,
    };

    const updatedDayData = { ...dayData, [taskId]: value };
    const updatedHistory = { ...currentData.history, [date]: updatedDayData };

    const updatedData = { ...currentData, history: updatedHistory };
    await saveStorageData(updatedData);
    return updatedData;
};

export const getDayProgress = async (date: string): Promise<DailyProgress> => {
    const data = await getStorageData();
    return data.history[date] || {
        diet: false,
        workout1: false,
        workout2: false,
        water: false,
        reading: false,
        photo: false,
        date: date,
    };
}

export const getStreak = (data: AppData): number => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const history = data.history;
    let streak = 0;

    // Check if today is completed (for live updating streak)
    // Actually, usually streak counts completed DAYS. 
    // If today is in progress, it doesn't count as a "streak day" yet unless we want to carry over yesterday's.
    // Standard approach: Count backwards from yesterday. If today is done, add 1.

    // Let's iterate backwards from TODAY.
    // If today is fully completed, streak starts at 1. If not, start at 0.
    // Then check yesterday, day before, etc.

    let currentDate = new Date();

    // Check today first
    const todayStr = format(currentDate, 'yyyy-MM-dd');
    if (isDayComplete(history[todayStr])) {
        streak++;
    } else {
        // If today is not complete, we don't break the streak yet, we just don't count today.
        // But if YESTERDAY was missed, then streak is 0.
    }

    // Iterate backwards
    while (true) {
        currentDate.setDate(currentDate.getDate() - 1);
        const dateStr = format(currentDate, 'yyyy-MM-dd');

        if (isDayComplete(history[dateStr])) {
            streak++;
        } else {
            // Found a break in the chain
            break;
        }
    }

    return streak;
}

const isDayComplete = (day: DailyProgress | undefined): boolean => {
    if (!day) return false;
    return day.diet && day.workout1 && day.workout2 && day.water && day.reading && day.photo;
}

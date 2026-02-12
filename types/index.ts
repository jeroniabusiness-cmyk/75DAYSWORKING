export interface DailyProgress {
    diet: boolean;
    dietNotes?: string;
    workout1: boolean;
    workout1Type?: string;
    workout2: boolean;
    workout2Type?: string;
    water: boolean;
    reading: boolean;
    readingBook?: string;
    readingPages?: number;
    photo: boolean;
    photoUri?: string;
    date: string; // ISO string YYYY-MM-DD
}

export interface AppData {
    startDate: string | null;
    history: Record<string, DailyProgress>; // Key is YYYY-MM-DD
}

export const TASKS = [
    { id: 'diet', label: 'Follow Diet', icon: 'food-apple-outline' },
    { id: 'workout1', label: 'Workout #1 (45+ min)', icon: 'dumbbell' },
    { id: 'workout2', label: 'Workout #2 (45+ min)', icon: 'run' },
    { id: 'water', label: 'Drink 4 Liters of Water', icon: 'water-outline' },
    { id: 'reading', label: 'Read 10 Pages', icon: 'book-open-variant' },
    { id: 'photo', label: 'Take Progress Photo', icon: 'camera-outline' },
] as const;

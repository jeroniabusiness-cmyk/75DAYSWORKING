import { format, subDays } from 'date-fns';

// Mocking the types locally to avoid import issues if any
interface DailyProgress {
    diet: boolean;
    workout1: boolean;
    workout2: boolean;
    water: boolean;
    reading: boolean;
    photo: boolean;
    date: string;
}

interface AppData {
    startDate: string | null;
    history: Record<string, DailyProgress>;
}

// COPIED LOGIC FROM storage.ts
const isDayComplete = (day: DailyProgress | undefined): boolean => {
    if (!day) return false;
    return day.diet && day.workout1 && day.workout2 && day.water && day.reading && day.photo;
}

const getStreak = (data: AppData): number => {
    const history = data.history;
    let streak = 0;

    let currentDate = new Date();

    // Check today first
    const todayStr = format(currentDate, 'yyyy-MM-dd');
    if (isDayComplete(history[todayStr])) {
        streak++;
    }

    // Iterate backwards from yesterday
    while (true) {
        currentDate.setDate(currentDate.getDate() - 1);
        const dateStr = format(currentDate, 'yyyy-MM-dd');

        if (isDayComplete(history[dateStr])) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}


// TESTS
const createMockData = (daysCompleted: number[]): AppData => {
    const history: Record<string, DailyProgress> = {};
    const today = new Date();

    daysCompleted.forEach(daysAgo => {
        const date = subDays(today, daysAgo);
        const dateStr = format(date, 'yyyy-MM-dd');
        history[dateStr] = {
            date: dateStr,
            diet: true,
            workout1: true,
            workout2: true,
            water: true,
            reading: true,
            photo: true
        };
    });

    return {
        startDate: '2024-01-01',
        history
    };
};

console.log('Testing Streak Logic (Isolated)...');

// Scenario 1: No days completed
let data = createMockData([]);
let streak = getStreak(data);
console.log(`Scenario 1: Streak = ${streak} (Expected: 0)`);
if (streak !== 0) console.error('FAILED Scenario 1');

// Scenario 2: Today completed (Streak 1)
data = createMockData([0]);
streak = getStreak(data);
console.log(`Scenario 2: Streak = ${streak} (Expected: 1)`);
if (streak !== 1) console.error('FAILED Scenario 2');

// Scenario 3: Today and Yesterday completed (Streak 2)
data = createMockData([0, 1]);
streak = getStreak(data);
console.log(`Scenario 3: Streak = ${streak} (Expected: 2)`);
if (streak !== 2) console.error('FAILED Scenario 3');

// Scenario 4: Yesterday missed
data = createMockData([0, 2]); // Today, DayBeforeYesterday
streak = getStreak(data);
console.log(`Scenario 4: Streak = ${streak} (Expected: 1)`);
if (streak !== 1) console.error('FAILED Scenario 4');

// Scenario 5: Only yesterday
data = createMockData([1]);
streak = getStreak(data);
// logic: today is checked first (false). then yesterday (true). streak = 1?
// wait, if today is NOT checked, streak should still include yesterday?
// In 75 Hard, if you miss a day, streak resets.
// If today is NOT OVER yet, you still have a chance.
// So if today is incomplete, streak should be current streak from yesterday.
// My logic: starts at 0. If today complete -> 1. Then checks yesterday.
// If today incomplete -> starts 0. Then checks yesterday -> 1.
// So yes, streak = 1.
console.log(`Scenario 5: Streak = ${streak} (Expected: 1)`);
if (streak !== 1) console.error('FAILED Scenario 5');

// Scenario 6: Yesterday missed, today incomplete
data = createMockData([2]); // DayBeforeYesterday
streak = getStreak(data);
// Today incomplete (0), yesterday incomplete (break).
// Streak = 0.
console.log(`Scenario 6: Streak = ${streak} (Expected: 0)`);
if (streak !== 0) console.error('FAILED Scenario 6');

console.log('Done.');

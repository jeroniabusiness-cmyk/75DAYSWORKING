import { format, subDays } from 'date-fns';
import { AppData, DailyProgress } from '../types';
import { getStreak } from '../utils/storage';

const createMockData = (daysCompleted: number[]): AppData => {
    const history: Record<string, DailyProgress> = {};
    const today = new Date();

    // daysCompleted: [0, 1, 2] means today, yesterday, day before yesterday are complete.
    // [0, 2] means today complete, yesterday missed, day before complete.

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

const testStreak = () => {
    console.log('Testing Streak Logic...');

    // Scenario 1: No days completed
    let data = createMockData([]);
    let streak = getStreak(data);
    console.log(`Scenario 1 (No days): Streak = ${streak} (Expected: 0)`);
    if (streak !== 0) console.error('FAILED Scenario 1');

    // Scenario 2: Today completed (Streak 1)
    data = createMockData([0]);
    streak = getStreak(data);
    console.log(`Scenario 2 (Today only): Streak = ${streak} (Expected: 1)`);
    if (streak !== 1) console.error('FAILED Scenario 2');

    // Scenario 3: Today and Yesterday completed (Streak 2)
    data = createMockData([0, 1]);
    streak = getStreak(data);
    console.log(`Scenario 3 (Today + Yesterday): Streak = ${streak} (Expected: 2)`);
    if (streak !== 2) console.error('FAILED Scenario 3');

    // Scenario 4: Usage of strict logic - Yesterday missed (Streak 0 or 1 depending on today)
    // If today is complete, streak is 1. If today is incomplete, streak is 0?
    // Wait, if yesterday is missed, streak is broken. 
    // If today is complete, it's the start of a new streak. So 1.
    // If today is NOT complete, streak is 0.

    data = createMockData([0, 2]); // Today done, Yesterday missed, Day before done.
    streak = getStreak(data);
    console.log(`Scenario 4 (Today done, Yesterday missed): Streak = ${streak} (Expected: 1)`);
    if (streak !== 1) console.error('FAILED Scenario 4');

    data = createMockData([2]); // Only day before yesterday done. Today/Yesterday empty.
    streak = getStreak(data);
    console.log(`Scenario 5 (Gap of 2 days): Streak = ${streak} (Expected: 0)`);
    if (streak !== 0) console.error('FAILED Scenario 5');

    console.log('Done.');
};

testStreak();

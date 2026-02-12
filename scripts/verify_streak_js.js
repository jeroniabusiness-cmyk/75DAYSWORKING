const { format, subDays } = require('date-fns');

// COPIED LOGIC FROM storage.ts (slightly modified for JS)
const isDayComplete = (day) => {
    if (!day) return false;
    return day.diet && day.workout1 && day.workout2 && day.water && day.reading && day.photo;
}

const getStreak = (data) => {
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
const createMockData = (daysCompleted) => {
    const history = {};
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

console.log('Testing Streak Logic (JS)...');
let failures = 0;

const assert = (scenario, actual, expected) => {
    if (actual !== expected) {
        console.error(`FAILED ${scenario}: Streak = ${actual} (Expected: ${expected})`);
        failures++;
    } else {
        console.log(`PASSED ${scenario}`);
    }
}

// Scenario 1: No days completed
let data = createMockData([]);
let streak = getStreak(data);
assert('Scenario 1', streak, 0);

// Scenario 2: Today completed (Streak 1)
data = createMockData([0]);
streak = getStreak(data);
assert('Scenario 2', streak, 1);

// Scenario 3: Today and Yesterday completed (Streak 2)
data = createMockData([0, 1]);
streak = getStreak(data);
assert('Scenario 3', streak, 2);

// Scenario 4: Yesterday missed
data = createMockData([0, 2]); // Today, DayBeforeYesterday
streak = getStreak(data);
assert('Scenario 4', streak, 1);

// Scenario 5: Only yesterday
data = createMockData([1]);
streak = getStreak(data);
assert('Scenario 5', streak, 1);

// Scenario 6: Yesterday missed, today incomplete
data = createMockData([2]); // DayBeforeYesterday
streak = getStreak(data);
assert('Scenario 6', streak, 0);

const fs = require('fs');
if (failures > 0) {
    console.error(`Total Failures: ${failures}`);
    fs.writeFileSync('verify_result.txt', `FAILED: ${failures} tests failed.`);
    process.exit(1);
} else {
    console.log('All tests passed.');
    fs.writeFileSync('verify_result.txt', 'PASSED');
    process.exit(0);
}

const RunningNumber = require('../models/RunningNumber');

const INITIAL_SEEDS = [
    { category: 'Car', series: 'CBU', lastNumber: 3919 },
    { category: 'Dual Purpose', series: 'PK', lastNumber: 9452 }, // Commercial/Van
    { category: 'Motor Cycle', series: 'BKO', lastNumber: 4259 },
    { category: 'Lorry Trailer/Bowser', series: 'LX', lastNumber: 5269 },
    { category: 'Three Wheeler', series: 'ABX', lastNumber: 1820 }
];

// Helper: Increment letters (e.g., AA -> AB, AZ -> BA, AAA -> AAB)
function incrementSeries(series) {
    let chars = series.split('');
    let i = chars.length - 1;

    while (i >= 0) {
        let charCode = chars[i].charCodeAt(0);
        if (charCode < 90) { // 'Z' is 90
            chars[i] = String.fromCharCode(charCode + 1);
            return chars.join('');
        } else {
            chars[i] = 'A'; // Reset this char to A and move left
            i--;
        }
    }
    // If we overflowed all (e.g. ZZZ), prepend A => AAAA (Logic assumption)
    return 'A' + chars.join('');
}

// Helper: Format Number (pad to 4 digits: 1 -> 0001)
function formatNumber(num) {
    return num.toString().padStart(4, '0');
}

async function initializeRunningNumbers() {
    try {
        for (const seed of INITIAL_SEEDS) {
            const exists = await RunningNumber.findOne({ category: seed.category });
            if (!exists) {
                await RunningNumber.create({
                    category: seed.category,
                    series: seed.series,
                    lastNumber: seed.lastNumber,
                    lastIssued: `${seed.series}-${formatNumber(seed.lastNumber)}`
                });
                console.log(`Seeded RunningNumber for ${seed.category}: ${seed.series}-${seed.lastNumber}`);
            }
        }
    } catch (error) {
        console.error('Error seeding running numbers:', error);
    }
}

async function generateNextNumber(category) {
    // Map application vehicleClass to our internal RunningNumber categories
    // Default to 'Car' if unknown, or handle errors
    // Mapping Logic:
    let dbCategory = 'Car'; // Default
    if (['Motorcycle', 'Motor Cycle'].includes(category)) dbCategory = 'Motor Cycle';
    else if (['Auto Rickshaw', 'Three Wheeler'].includes(category)) dbCategory = 'Three Wheeler';
    else if (['Van', 'Dual Purpose', 'Truck', 'Lorry'].includes(category)) dbCategory = 'Dual Purpose'; // Mapping Van/Truck to Dual Purpose based on user prompt proximity
    else if (['Lorry Trailer', 'Bowser', 'Heavy'].includes(category)) dbCategory = 'Lorry Trailer/Bowser';
    else if (category === 'Car') dbCategory = 'Car';

    // Fetch current
    let running = await RunningNumber.findOne({ category: dbCategory });

    // If not found, try to look for exact match or default
    if (!running) {
        console.warn(`No running number found for ${category} (mapped to ${dbCategory}). Using default Car logic.`);
        running = await RunningNumber.findOne({ category: 'Car' });
    }

    // Logic to increment
    let nextNum = running.lastNumber + 1;
    let nextSeries = running.series;

    if (nextNum > 9999) {
        nextNum = 1; // standard reset is to 1? or 0? usually 1-9999
        nextSeries = incrementSeries(running.series);
    }

    const fullNumber = `${nextSeries}-${formatNumber(nextNum)}`;

    // Update DB
    running.lastNumber = nextNum;
    running.series = nextSeries;
    running.lastIssued = fullNumber;
    await running.save();

    return fullNumber;
}

// Function to get all ongoing numbers (for frontend API)
async function getOngoingNumbers() {
    return await RunningNumber.find({});
}

module.exports = {
    initializeRunningNumbers,
    generateNextNumber,
    getOngoingNumbers
};

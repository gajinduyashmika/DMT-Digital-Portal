const axios = require('axios');

async function checkSize(url) {
    try {
        const start = Date.now();
        const res = await axios.get(url);
        const end = Date.now();
        const size = JSON.stringify(res.data).length;
        console.log(`URL: ${url}`);
        console.log(`Size: ${size} bytes`);
        console.log(`Time: ${end - start} ms`);

        // Check if any item has 'documents' or 'vehicleImage'
        const hasHeavyFields = Array.isArray(res.data) && res.data.some(item => item.documents || item.vehicleImage);
        console.log(`Has heavy fields: ${hasHeavyFields}`);
    } catch (err) {
        console.error(`Error fetching ${url}:`, err.message);
    }
}

async function run() {
    await checkSize('http://localhost:5000/api/vehicles/all');
    await checkSize('http://localhost:5000/api/applications/all');
}

run();

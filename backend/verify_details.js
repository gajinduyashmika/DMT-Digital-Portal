const axios = require('axios');

async function checkDetailsSize() {
    try {
        // 1. Get an ID from the list
        console.log("Fetching list to get an ID...");
        const listRes = await axios.get('http://localhost:5000/api/applications/all');
        if (listRes.data.length === 0) {
            console.log("No applications found to test.");
            return;
        }
        const id = listRes.data[0]._id;
        console.log(`Testing with ID: ${id}`);

        // 2. Measure Metadata size
        const startMeta = Date.now();
        const metaRes = await axios.get(`http://localhost:5000/api/applications/${id}`);
        const endMeta = Date.now();
        const metaSize = JSON.stringify(metaRes.data).length;
        console.log(`Metadata Endpoint (GET /${id}):`);
        console.log(`  Size: ${metaSize} bytes`);
        console.log(`  Time: ${endMeta - startMeta} ms`);

        // 3. Measure Resources size
        const startRes = Date.now();
        const resRes = await axios.get(`http://localhost:5000/api/applications/${id}/resources`);
        const endRes = Date.now();
        const resSize = JSON.stringify(resRes.data).length;
        console.log(`Resources Endpoint (GET /${id}/resources):`);
        console.log(`  Size: ${resSize} bytes`);
        console.log(`  Time: ${endRes - startRes} ms`);

        console.log(`\nImprovement: Initial load is ${(resSize / metaSize).toFixed(1)}x smaller!`);

    } catch (err) {
        console.error(`Error:`, err.message);
    }
}

checkDetailsSize();

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    console.log('Fetching available models...');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API Key found.');
        return;
    }

    try {
        // Accessing the model list directly might require a different REST call if the SDK doesn't expose it easily in this version,
        // but let's try via the SDK's generic access or just test a known list.
        // Actually, the error message suggests "Call ListModels". In REST that's GET /v1beta/models.
        // The Node SDK usually exposes this. checking...
        // If SDK doesn't have it handy, we can use fetch/axios.

        // Using axios to hit the REST endpoint directly for certainty
        const axios = require('axios');
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        const response = await axios.get(url);
        const models = response.data.models;

        const fs = require('fs');
        let output = 'Available Models:\n';
        models.forEach(m => {
            if (m.supportedGenerationMethods.includes('generateContent')) {
                output += `- ${m.name.replace('models/', '')}\n`;
            }
        });
        fs.writeFileSync('available_models.txt', output);
        console.log('List written to available_models.txt');

    } catch (error) {
        console.error('Error listing models:', error.response?.data || error.message);
    }
}

listModels();
